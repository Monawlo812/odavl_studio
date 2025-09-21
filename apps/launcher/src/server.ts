import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 7777;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get workspace root (up from apps/launcher/dist)
const workspaceRoot = path.resolve(__dirname, '../../..');
const cliPath = path.join(workspaceRoot, 'apps', 'cli', 'dist', 'index.js');
const reportsDir = path.join(workspaceRoot, 'reports', 'launcher');

// SSE clients for log streaming
const sseClients: express.Response[] = [];

// Helper to run CLI commands and save results
async function runCLI(command: string[], reportFile: string): Promise<{ success: boolean; output: string; error?: string }> {
  return new Promise((resolve) => {
    const timestamp = new Date().toISOString();
    const child = spawn('node', [cliPath, ...command], { 
      cwd: workspaceRoot,
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout?.on('data', (data) => {
      const output = data.toString();
      stdout += output;
      broadcastLog(`[${timestamp}] ${output.trim()}`);
    });
    
    child.stderr?.on('data', (data) => {
      const output = data.toString();
      stderr += output;
      broadcastLog(`[${timestamp}] ERROR: ${output.trim()}`);
    });
    
    child.on('close', async (code) => {
      const success = code === 0;
      const result = {
        timestamp,
        command: command.join(' '),
        success,
        exitCode: code,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        reportFile
      };
      
      // Save to reports directory
      await fs.mkdir(reportsDir, { recursive: true });
      await fs.writeFile(path.join(reportsDir, reportFile), JSON.stringify(result, null, 2));
      
      resolve({
        success,
        output: stdout.trim(),
        error: success ? undefined : stderr.trim()
      });
    });
  });
}

// Broadcast logs to SSE clients
function broadcastLog(message: string) {
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify({ type: 'log', message })}\n\n`);
  });
}

// API Routes
app.post('/api/scan', async (req, res) => {
  broadcastLog('🔍 Starting scan...');
  const result = await runCLI(['scan', '--json'], `scan-${Date.now()}.json`);
  res.json(result);
});

app.post('/api/heal', async (req, res) => {
  broadcastLog('🔧 Starting heal dry-run...');
  const result = await runCLI(['heal', '--recipe', 'esm-hygiene', '--dry-run', '--max-files', '5'], `heal-${Date.now()}.json`);
  res.json(result);
});

app.post('/api/shadow', async (req, res) => {
  broadcastLog('☁️ Starting shadow run...');
  const result = await runCLI(['shadow', 'run', '--wait'], `shadow-${Date.now()}.json`);
  res.json(result);
});

app.post('/api/pr', async (req, res) => {
  broadcastLog('📝 Preparing PR...');
  const result = await runCLI(['pr', 'open', '--explain', '--dry-run'], `pr-${Date.now()}.json`);
  res.json(result);
});

app.post('/api/magic', async (req, res) => {
  const timestamp = Date.now();
  broadcastLog('✨ Starting Magic workflow...');
  
  try {
    // Sequential execution: scan -> heal -> shadow -> pr
    broadcastLog('Step 1/4: Scanning...');
    const scan = await runCLI(['scan', '--json'], `magic-${timestamp}-scan.json`);
    
    broadcastLog('Step 2/4: Healing...');
    const heal = await runCLI(['heal', '--recipe', 'esm-hygiene', '--apply', '--max-files', '3'], `magic-${timestamp}-heal.json`);
    
    broadcastLog('Step 3/4: Shadow CI...');
    const shadow = await runCLI(['shadow', 'run', '--json'], `magic-${timestamp}-shadow.json`);
    
    broadcastLog('Step 4/4: PR preparation...');
    const pr = await runCLI(['pr', 'open', '--explain', '--dry-run'], `magic-${timestamp}-pr.json`);
    
    const result = {
      success: scan.success && heal.success && shadow.success && pr.success,
      timestamp,
      steps: { scan, heal, shadow, pr }
    };
    
    await fs.writeFile(path.join(reportsDir, `magic-${timestamp}-summary.json`), JSON.stringify(result, null, 2));
    broadcastLog(`✅ Magic workflow complete! Results saved to magic-${timestamp}-summary.json`);
    
    res.json(result);
  } catch (error) {
    broadcastLog(`❌ Magic workflow failed: ${error}`);
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.get('/api/status', async (req, res) => {
  broadcastLog('📊 Getting status...');
  const result = await runCLI(['status', '--json'], `status-${Date.now()}.json`);
  res.json(result);
});

// SSE endpoint for real-time logs
app.get('/api/logs/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.write('data: {"type":"connected","message":"Connected to ODAVL launcher logs"}\n\n');
  sseClients.push(res);
  
  req.on('close', () => {
    const index = sseClients.indexOf(res);
    if (index !== -1) sseClients.splice(index, 1);
  });
});

// Serve static files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ODAVL Launcher running at http://localhost:${PORT}`);
  console.log(`📁 Reports saved to: ${reportsDir}`);
});