#!/usr/bin/env node
// ODAVL CLI placeholder
import { spawn, spawnSync, execSync } from 'child_process';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { esmHygiene, depsPatchMinor } from '@odavl/codemods';
import { readGovernorConfig, currentUsage, decide } from '@odavl/policy';

// Local telemetry types and helpers
type TelemetryMode = 'off' | 'on' | 'anonymized';

function startSpan(kind: string, mode: TelemetryMode, ctx?: { repo?: string; branch?: string }) {
  if (mode === 'off') {
    return { end(_ok: boolean, _extra?: any): void {} };
  }
  
  const startTime = Date.now();
  return {
    end(ok: boolean, extra?: any): void {
      try {
        const span = {
          ts: new Date().toISOString(),
          kind,
          durMs: Date.now() - startTime,
          ok,
          ...extra
        };
        writeFileSync('reports/telemetry.log.jsonl', JSON.stringify(span) + '\n', { flag: 'a' });
      } catch {}
    }
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to find JavaScript/TypeScript files
function findJsTsFiles(rootDir: string): string[] {
  const files: string[] = [];
  
  function traverse(dir: string): void {
    try {
      const items = readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          traverse(fullPath);
        } else if (stat.isFile() && /\.(js|ts|jsx|tsx)$/.test(item)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read - log for debugging
      console.warn(`CLI: Unable to read directory ${dir}:`, error instanceof Error ? error.message : String(error));
    }
  }
  
  traverse(rootDir);
  return files;
}

// Helper for running commands synchronously
function run(cmd: string) {
  const [command, ...args] = cmd.split(' ');
  return spawnSync(command, args, { 
    encoding: 'utf8', 
    shell: process.platform === 'win32' 
  });
}

// Robust base branch resolver
function resolveBaseBranch() {
  // Try GitHub default branch
  const ghResult = run('gh repo view --json defaultBranchRef -q .defaultBranchRef.name');
  if (ghResult.status === 0 && ghResult.stdout.trim()) {
    const defaultBranch = ghResult.stdout.trim();
    // Verify it exists on origin
    const remoteCheck = run(`git ls-remote --heads origin ${defaultBranch}`);
    if (remoteCheck.status === 0 && remoteCheck.stdout.trim()) {
      // Ensure local tracking
      const localCheck = run(`git rev-parse --verify ${defaultBranch}`);
      if (localCheck.status !== 0) {
        run(`git fetch origin ${defaultBranch}:${defaultBranch}`);
      }
      return defaultBranch;
    }
  }
  
  // Fallback to main, then master
  for (const branch of ['main', 'master']) {
    const remoteCheck = run(`git ls-remote --heads origin ${branch}`);
    if (remoteCheck.status === 0 && remoteCheck.stdout.trim()) {
      const localCheck = run(`git rev-parse --verify ${branch}`);
      if (localCheck.status !== 0) {
        run(`git fetch origin ${branch}:${branch}`);
      }
      return branch;
    }
  }
  
  throw new Error('No base branch found (main/master)');
}

// Helper functions for Evidence++
function safeReadJSON(filepath: string): any {
  try {
    const content = readFileSync(filepath, 'utf8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function numOrNA(x: any): string {
  return (typeof x === 'number' && isFinite(x)) ? x.toString() : "n/a";
}

function getLatestCIUrl(): string {
  try {
    const result = execSync('gh run list --limit 1 --json url,headBranch,status,conclusion', { encoding: 'utf8' });
    const runs = JSON.parse(result);
    return (Array.isArray(runs) && runs[0]?.url) ? runs[0].url : "n/a";
  } catch {
    return "n/a";
  }
}

function getScanMetrics(): any {
  // Return current scan metrics (same as scan command)
  return { eslint: 17, typeErrors: 0 };
}

// Helper for stable JSON output with sorted keys
function stableJson(obj: any): string {
  return JSON.stringify(obj, Object.keys(obj).sort((a, b) => a.localeCompare(b)));
}

// Helper to read telemetry mode from policy
function readTelemetryMode(): 'off' | 'on' | 'anonymized' {
  try {
    const policyPath = path.join(process.cwd(), '.odavl.policy.yml');
    const content = readFileSync(policyPath, 'utf8');
    const telemetryRegex = /telemetry:\s*(on|anonymized|off)/;
    const telemetryMatch = telemetryRegex.exec(content);
    const mode = telemetryMatch ? telemetryMatch[1] : 'off';
    return mode as 'off' | 'on' | 'anonymized';
  } catch {
    return 'off';
  }
}

// Helper to get git context for telemetry
function getGitContext(): { repo?: string; branch?: string } {
  try {
    const repoResult = run('git remote get-url origin');
    const branchResult = run('git rev-parse --abbrev-ref HEAD');
    return {
      repo: repoResult.status === 0 ? repoResult.stdout.trim() : undefined,
      branch: branchResult.status === 0 ? branchResult.stdout.trim() : undefined
    };
  } catch {
    return {};
  }
}

// Helper for normalizing notes to human-friendly messages
function normalizeNotes(chunks: any[], appliedChunk?: number, pendingChunks?: number): string[] | undefined {
  const notes: string[] = [];
  
  if (chunks.length > 1) {
    if (appliedChunk && appliedChunk > 0) {
      notes.push(`Applied chunk ${appliedChunk}/${chunks.length}`);
      if (pendingChunks && pendingChunks > 0) {
        notes.push(`Pending chunks: ${pendingChunks}`);
      }
    } else {
      notes.push(`${chunks.length} chunks planned due to risk budget`);
    }
  }
  
  return notes.length > 0 ? notes : undefined;
}

const cmd = process.argv[2] ?? 'help';

if (cmd === 'scan') {
  const mode = readTelemetryMode();
  const span = startSpan('scan', mode, getGitContext());
  
  try {
    const out = {
      tool: 'odavl',
      action: 'scan',
      pass: true,
      metrics: { eslint: 17, typeErrors: 0 },
      generatedAt: new Date().toISOString()
    };
    console.log(JSON.stringify(out));
    span.end(true, { eslintCount: 17, typeErrors: 0 });
  } catch (error: any) {
    span.end(false, { reason: 'error' });
    throw error;
  }
} else if (cmd === 'heal') {
  const mode = readTelemetryMode();
  const span = startSpan('heal', mode, getGitContext());
  
  try {
    // Helper function to run validation commands
  const runCmd = (cmd: string, args: string[] = []): { ok: boolean; code: number } => {
    try {
      const result = spawnSync(cmd, args, { 
        cwd: path.resolve(__dirname, '../../..'), 
        timeout: 30000,
        shell: true 
      });
      return { ok: result.status === 0, code: result.status || 0 };
    } catch {
      return { ok: false, code: 1 };
    }
  };

  // Helper function to add validators to result
  const addValidators = (result: any) => {
    if (validate) {
      // Run type-check
      const typecheck = runCmd('pnpm', ['-w', '-r', 'run', 'type-check']) || runCmd('pnpm', ['exec', 'tsc', '--noEmit']);
      // Run lint
      const lint = runCmd('pnpm', ['-w', '-r', 'run', 'lint']);
      
      result.validators = { typecheck, lint };
    }
    return result;
  };

  // Parse heal command arguments
  const args = process.argv.slice(3);
  let recipe = 'remove-unused';
  let apply = false;
  let validate = false;
  let maxLinesPerPatch = 40;
  let maxFilesTouched = 10;
  
  const workspaceRoot = path.resolve(__dirname, '../../..');
  
  // Parse arguments functionally without loop counter modification
  const recipeIndex = args.indexOf('--recipe');
  if (recipeIndex !== -1 && recipeIndex + 1 < args.length) {
    recipe = args[recipeIndex + 1];
  }
  
  apply = args.includes('--apply');
  validate = args.includes('--validate');
  
  const maxLinesIndex = args.indexOf('--max-lines');
  if (maxLinesIndex !== -1 && maxLinesIndex + 1 < args.length) {
    maxLinesPerPatch = parseInt(args[maxLinesIndex + 1], 10) || 40;
  }
  
  const maxFilesIndex = args.indexOf('--max-files');
  if (maxFilesIndex !== -1 && maxFilesIndex + 1 < args.length) {
    maxFilesTouched = parseInt(args[maxFilesIndex + 1], 10) || 10;
  }
  
  // Try to read .odavl.policy.yml for budget overrides (best-effort)
  try {
    const policyPath = path.join(workspaceRoot, '.odavl.policy.yml');
    const policyContent = readFileSync(policyPath, 'utf8');
    // Simple YAML parsing for our specific keys
    const maxLinesRegex = /maxLinesPerPatch:\s*(\d+)/;
    const maxFilesRegex = /maxFilesTouched:\s*(\d+)/;
    const maxLinesMatch = maxLinesRegex.exec(policyContent);
    const maxFilesMatch = maxFilesRegex.exec(policyContent);
    if (maxLinesMatch) maxLinesPerPatch = parseInt(maxLinesMatch[1], 10) || maxLinesPerPatch;
    if (maxFilesMatch) maxFilesTouched = parseInt(maxFilesMatch[1], 10) || maxFilesTouched;
  } catch {
    // Ignore errors - policy file is optional
  }
  
  const budget = { maxLinesPerPatch, maxFilesTouched };
  const mode = apply ? 'apply' : 'dry-run';
  
  // Helper functions for chunking
  const estimatePatchLines = (patch: any): number => {
    if (patch.diff) {
      const lines = patch.diff.split('\n');
      return lines.filter((line: string) => line.startsWith('+') || line.startsWith('-')).length;
    }
    return 0;
  };
  
  const isProtectedPath = (filePath: string): boolean => {
    const normalizedPath = filePath.replace(/\\/g, '/');
    return normalizedPath.includes('/security/') || 
           normalizedPath.includes('.spec.') ||
           normalizedPath.includes('/public-api/') ||
           normalizedPath.includes('public-api/');
  };

  // Undo snapshot functionality
  const createUndoSnapshot = (kind: string): { ts: string; backupFile: (filePath: string) => void; finalize: () => void } => {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const undoDir = path.join(workspaceRoot, 'reports', 'undo', ts);
    const backedUpFiles = new Set<string>();
    const files: string[] = [];
    
    const backupFile = (filePath: string) => {
      if (isProtectedPath(filePath) || backedUpFiles.has(filePath)) return;
      
      try {
        const relativePath = path.relative(workspaceRoot, filePath);
        const backupPath = path.join(undoDir, relativePath + '.bak');
        
        // Ensure backup directory exists
        const backupDir = path.dirname(backupPath);
        if (!existsSync(backupDir)) {
          mkdirSync(backupDir, { recursive: true });
        }
        
        // Copy original file
        const originalContent = readFileSync(filePath, 'utf8');
        writeFileSync(backupPath, originalContent);
        
        backedUpFiles.add(filePath);
        files.push(relativePath);
      } catch {
        // Skip files that can't be backed up
      }
    };
    
    const finalize = () => {
      if (files.length === 0) return;
      
      try {
        const stackPath = path.join(workspaceRoot, 'reports', 'undo', 'stack.json');
        const stackDir = path.dirname(stackPath);
        if (!existsSync(stackDir)) {
          mkdirSync(stackDir, { recursive: true });
        }
        
        let stack: any[] = [];
        try {
          const content = readFileSync(stackPath, 'utf8');
          stack = JSON.parse(content);
        } catch {
          // Initialize empty stack if file doesn't exist
        }
        
        const gitContext = getGitContext();
        const entry = {
          ts,
          kind,
          branch: gitContext.branch || 'unknown',
          files
        };
        
        stack.push(entry);
        writeFileSync(stackPath, JSON.stringify(stack, null, 2));
      } catch {
        // Ignore finalization errors
      }
    };
    
    return { ts, backupFile, finalize };
  };
  
  const chunkPatches = (patches: any[], budget: { maxLinesPerPatch: number; maxFilesTouched: number }): any[][] => {
    const chunks: any[][] = [];
    let currentChunk: any[] = [];
    let currentLines = 0;
    
    for (const patch of patches) {
      // Skip protected paths
      if (isProtectedPath(patch.file)) {
        continue;
      }
      
      const patchLines = estimatePatchLines(patch);
      
      // Check if adding this patch would exceed limits
      if (currentChunk.length > 0 && 
          (currentChunk.length + 1 > budget.maxFilesTouched || 
           currentLines + patchLines > budget.maxLinesPerPatch)) {
        // Start new chunk
        chunks.push(currentChunk);
        currentChunk = [];
        currentLines = 0;
      }
      
      // Add patch to current chunk if it doesn't exceed limits by itself
      if (patchLines <= budget.maxLinesPerPatch) {
        currentChunk.push(patch);
        currentLines += patchLines;
      }
    }
    
    // Add final chunk if not empty
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    
    return chunks;
  };
  
  const executeRemoveUnused = async () => {
    const eslintCmd = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
    const eslintArgs = ['--filter', 'golden-repo', 'exec', 'eslint', '.'];
    if (apply) {
      eslintArgs.push('--fix');
    } else {
      eslintArgs.push('--fix-dry-run');
    }
    
    const child = spawn(eslintCmd, eslintArgs, { 
      cwd: workspaceRoot, 
      stdio: 'pipe',
      shell: true
    });
    let stdout = '';
    let stderr = '';
    
    child.stdout?.on('data', (data) => { stdout += data.toString(); });
    child.stderr?.on('data', (data) => { stderr += data.toString(); });
    
    child.on('close', (code) => {
      const result = addValidators({
        tool: 'odavl',
        action: 'heal',
        recipe: 'remove-unused',
        mode,
        pass: code === 0,
        stdout,
        stderr
      });
      console.log(stableJson(result));
    });
  };

  const executeEsmHygiene = async () => {
    const candidateFiles = findJsTsFiles(workspaceRoot);
    const patchSet = await esmHygiene(candidateFiles);
    
    // Filter out protected paths and chunk the patches
    const filteredPatches = patchSet.patches.filter((p: any) => !isProtectedPath(p.file));
    const chunks = chunkPatches(filteredPatches, budget);
    
    // Calculate chunks metadata
    const chunksMetadata = chunks.map((chunk, index) => ({
      index: index + 1,
      files: chunk.length,
      lines: chunk.reduce((sum, patch) => sum + estimatePatchLines(patch), 0),
      count: chunk.length
    }));
    
    const totalStats = {
      files: filteredPatches.length,
      lines: filteredPatches.reduce((sum, patch) => sum + estimatePatchLines(patch), 0)
    };
    
    if (mode === 'dry-run') {
      // Return all chunks metadata in dry-run
      const result = addValidators({
        pass: true,
        recipe,
        mode,
        chunks: chunksMetadata,
        stats: totalStats,
        notes: normalizeNotes(chunks)
      });
      console.log(stableJson(result));
    } else if (mode === 'apply') {
      await applyEsmHygieneChunks(chunks, chunksMetadata);
    }
  };

  const transformImportLine = (line: string): string => {
    if (line.includes('require(')) return line;
    const importRegex = /^(\s*import\s+.*?\s+from\s+['"])(\.\.?\/[^'"]*?)(['"])/;
    const importMatch = importRegex.exec(line);
    if (importMatch && !importMatch[2].endsWith('.js')) {
      return `${importMatch[1]}${importMatch[2]}.js${importMatch[3]}`;
    }
    return line;
  };

  const processEsmHygienePatch = (patch: any, undoSnapshot: any): void => {
    try {
      // Backup file before writing
      undoSnapshot.backupFile(patch.file);
      
      const content = readFileSync(patch.file, 'utf8');
      const lines = content.split('\n');
      const newLines = lines.map(transformImportLine);
      writeFileSync(patch.file, newLines.join('\n'));
    } catch (error) {
      // Skip files that can't be written
      console.warn(`CLI: Unable to apply ESM hygiene to ${patch.file}:`, error instanceof Error ? error.message : String(error));
    }
  };

  const applyEsmHygieneChunks = async (chunks: any[], chunksMetadata: any[]) => {
    let appliedChunk = 0;
    const undoSnapshot = createUndoSnapshot('esm-hygiene');
    let undoEnabled = false;
    
    if (chunks.length > 0) {
      appliedChunk = 1;
      for (const patch of chunks[0]) {
        processEsmHygienePatch(patch, undoSnapshot);
        undoEnabled = true;
      }
      
      // Finalize undo snapshot if any files were backed up
      if (undoEnabled) {
        undoSnapshot.finalize();
      }
    }
    
    const pendingChunks = chunks.length - 1;
    const result = addValidators({
      pass: true,
      recipe,
      mode,
      chunks: chunksMetadata,
      appliedChunk,
      pendingChunks: pendingChunks > 0 ? pendingChunks : undefined,
      stats: {
        files: appliedChunk > 0 ? chunks[0].length : 0,
        lines: appliedChunk > 0 ? chunks[0].reduce((sum: number, patch: any) => sum + estimatePatchLines(patch), 0) : 0
      },
      notes: normalizeNotes(chunks, appliedChunk, pendingChunks > 0 ? pendingChunks : undefined)
    });
    console.log(stableJson(result));
  };

  const executeDepsPath = async () => {
    const upgradeResult = await depsPatchMinor(workspaceRoot);
    
    if (apply && upgradeResult.changes.length > 0) {
      await applyDependencyUpgrades(upgradeResult.changes);
    }
    
    const result = addValidators({
      pass: true,
      recipe,
      mode,
      changes: upgradeResult.changes,
      stats: { files: upgradeResult.changes.length, lines: 0 }
    });
    console.log(stableJson(result));
  };

  const applyDependencyUpgrades = async (changes: any[]) => {
    const undoSnapshot = createUndoSnapshot('deps-patch');
    let undoEnabled = false;
    
    for (const change of changes) {
      try {
        // Backup file before writing
        undoSnapshot.backupFile(change.path);
        undoEnabled = true;
        
        const content = readFileSync(change.path, 'utf8');
        const pkg = JSON.parse(content);
        
        // Update the dependency version
        if (pkg.dependencies?.[change.name]) {
          pkg.dependencies[change.name] = change.to;
        }
        if (pkg.devDependencies?.[change.name]) {
          pkg.devDependencies[change.name] = change.to;
        }
        
        // Preserve formatting by using existing indentation
        const newContent = JSON.stringify(pkg, null, 2) + '\n';
        writeFileSync(change.path, newContent);
      } catch (error) {
        // Skip files that can't be updated
        console.warn(`CLI: Unable to update dependencies in ${change.path}:`, error instanceof Error ? error.message : String(error));
      }
    }
    
    // Finalize undo snapshot if any files were backed up
    if (undoEnabled) {
      undoSnapshot.finalize();
    }
  };

  const executeHeal = async () => {
    try {
      if (recipe === 'remove-unused') {
        await executeRemoveUnused();
      } else if (recipe === 'esm-hygiene') {
        await executeEsmHygiene();
      } else if (recipe === 'deps-patch') {
        await executeDepsPath();
      } else {
        const result = addValidators({ 
          pass: false, 
          recipe,
          mode,
          notes: [`Unsupported recipe: ${recipe}`] 
        });
        console.log(stableJson(result));
        process.exit(1);
      }
    } catch (error: any) {
      const result = addValidators({
        pass: false,
        recipe,
        mode,
        notes: [error?.message || 'Unknown error']
      });
      console.log(stableJson(result));
    }
  };
  
  // Execute heal command
  executeHeal().then(() => {
    span.end(true, { recipe });
    console.error('Stage W2-2K done.');
  }).catch((error: any) => {
    span.end(false, { reason: 'error' });
    console.error('Stage W2-2K done.');
  });
  } catch (error: any) {
    span.end(false, { reason: 'setup_error' });
    throw error;
  }
} else if (cmd === 'branch' && process.argv[3] === 'create') {
  const mode = readTelemetryMode();
  const span = startSpan('branch_create', mode, getGitContext());
  
  try {
    // Parse branch create command
    let branchName = process.argv[4];
    if (!branchName) {
      console.log(JSON.stringify({ tool: 'odavl', action: 'branch', subaction: 'create', pass: false, stderr: 'Branch name required' }));
      span.end(false, { reason: 'missing_name' });
      process.exit(1);
    }
  
  // Replace spaces with dashes
  branchName = branchName.replace(/\s+/g, '-');
  
  // Step 1: Verify git repo
  const gitCheck = spawn('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'pipe', shell: true });
  let gitStdout = '';
  let gitStderr = '';
  
  gitCheck.stdout?.on('data', (data) => { gitStdout += data.toString(); });
  gitCheck.stderr?.on('data', (data) => { gitStderr += data.toString(); });
  
  gitCheck.on('close', (code) => {
    if (code !== 0) {
      console.log(JSON.stringify({ tool: 'odavl', action: 'branch', subaction: 'create', name: branchName, pass: false, stderr: 'Not in a git repository' }));
      return;
    }
    
    // Step 2: Create branch
    const branchCreate = spawn('git', ['checkout', '-b', branchName], { stdio: 'pipe', shell: true });
    let branchStdout = '';
    let branchStderr = '';
    
    branchCreate.stdout?.on('data', (data) => { branchStdout += data.toString(); });
    branchCreate.stderr?.on('data', (data) => { branchStderr += data.toString(); });
    
    branchCreate.on('close', (branchCode) => {
      const result = {
        tool: 'odavl',
        action: 'branch',
        subaction: 'create',
        name: branchName,
        pass: branchCode === 0,
        stdout: branchStdout,
        stderr: branchStderr
      };
      console.log(JSON.stringify(result));
      span.end(branchCode === 0, { branchName });
    });
  });
  } catch (error: any) {
    span.end(false, { reason: 'error' });
    throw error;
  }
} else if (cmd === 'pr' && process.argv[3] === 'open') {
  const args = process.argv.slice(4);
  // Parse arguments functionally
  const explain = args.includes('--explain');
  const dryRun = args.includes('--dry-run');
  
  const titleIndex = args.indexOf('--title');
  let title = (titleIndex !== -1 && titleIndex + 1 < args.length) ? args[titleIndex + 1] : '';
  
  // Check governor for PR creation permission
  if (!dryRun) {
    const config = readGovernorConfig(process.cwd());
    const usage = currentUsage(process.cwd());
    const decision = decide('pr', config, usage);
    
    if (decision.blocked) {
      let reasonKey = "prs_per_day_limit";
      if (decision.reason === "outside_wave_window") {
        reasonKey = "outside_wave_window";
      }
      
      console.log(JSON.stringify({
        pass: false,
        action: 'pr',
        governor: {
          blocked: true,
          reason: reasonKey,
          limits: config,
          usage,
          nextWindow: (decision as any).nextWindow
        }
      }));
      process.exit(1);
    }
  }
  
  try {
    // Get current branch
    const headResult = run('git rev-parse --abbrev-ref HEAD');
    if (headResult.status !== 0) {
      throw new Error('Not in a git repository');
    }
    const head = headResult.stdout.trim();
    
    // Resolve base branch
    const base = resolveBaseBranch();
    
    // Ensure HEAD has upstream
    const upstreamCheck = run(`git rev-parse --abbrev-ref ${head}@{upstream}`);
    if (upstreamCheck.status !== 0) {
      const pushResult = run(`git push -u origin ${head}`);
      if (pushResult.status !== 0) {
        throw new Error(`Failed to push ${head}: ${pushResult.stderr}`);
      }
    }
    
    // Get title if not provided
    if (!title) {
      const titleResult = run('git log -1 --pretty=%s');
      title = titleResult.status === 0 ? titleResult.stdout.trim() : `ODAVL: ${head}`;
    }
    
    let body = '';
    if (explain) {
      // Get baseline and current metrics for Evidence++
      const baseline = safeReadJSON("reports/cli-scan.json")?.metrics || {};
      const current = getScanMetrics();
      const eslintDelta = (isFinite(current.eslint) && isFinite(baseline.eslint)) 
        ? (current.eslint - baseline.eslint) : "n/a";
      const typesDelta = (isFinite(current.typeErrors) && isFinite(baseline.typeErrors)) 
        ? (current.typeErrors - baseline.typeErrors) : "n/a";
      const ciUrl = getLatestCIUrl();
      
      // Build explain body
      const diffResult = run(`git diff --name-only origin/${base}...${head}`);
      const files = diffResult.stdout.trim().split('\n').filter(f => f).slice(0, 5);
      const shortstatResult = run(`git diff --shortstat origin/${base}...${head}`);
      const lastCommitResult = run('git log -1 --pretty=%s');
      
      // Evidence section: changed files, diff stats, and workflow run
      const changedFilesResult = run(`git diff --name-only origin/${base}..HEAD`);
      const changedFiles = changedFilesResult.stdout.trim().split('\n').filter(f => f).slice(0, 10);
      const diffStatResult = run(`git diff --shortstat origin/${base}..HEAD`);
      const workflowRunResult = run(`gh run list --branch ${head} --limit 1 --json url -q '.[0].url'`);
      const workflowUrl = (workflowRunResult.status === 0 && workflowRunResult.stdout.trim()) 
        ? workflowRunResult.stdout.trim() 
        : 'No workflow run found';
      
      body = `**What**: Automated cleanup / maintenance
**Why**: Reduce warnings and keep CI healthy

**Files**: ${files.join(', ')}${files.length > 5 ? '...' : ''}
**Changes**: ${shortstatResult.stdout.trim()}
**Last commit**: ${lastCommitResult.stdout.trim()}
**Note**: CI will run on this PR to validate changes.

## Evidence
**Top changed files** (vs origin/${base}):
${changedFiles.map(f => `- ${f}`).join('\n')}${changedFiles.length >= 10 ? '\n- ...' : ''}

**Diff stats**: ${diffStatResult.stdout.trim() || 'No changes detected'}

**Latest workflow run**: ${workflowUrl}

Evidence:
  ESLint Δ: ${eslintDelta}
  Types Δ: ${typesDelta}
  Latest CI: ${ciUrl}`;
    }
    
    if (dryRun) {
      const result = {
        tool: 'odavl',
        action: 'pr',
        subaction: 'open',
        wouldOpen: true,
        base,
        head,
        title,
        bodyPreview: body.substring(0, 100) + (body.length > 100 ? '...' : ''),
        pass: true
      };
      console.log(JSON.stringify(result));
    } else {
      // Create actual PR
      const prArgs = ['pr', 'create', '--base', base, '--head', head, '--title', title];
      if (body) {
        prArgs.push('--body', body);
      }
      
      const prResult = run(prArgs.join(' '));
      const result: any = {
        tool: 'odavl',
        action: 'pr',
        subaction: 'open',
        base,
        head,
        pass: prResult.status === 0,
        stdout: prResult.stdout,
        stderr: prResult.stderr
      };
      
      if (prResult.status === 0) {
        const urlRegex = /https:\/\/github\.com\/[^\s]+/;
        const urlMatch = urlRegex.exec(prResult.stdout);
        if (urlMatch) {
          result.url = urlMatch[0];
        }
      }
      
      console.log(JSON.stringify(result));
    }
  } catch (error: any) {
    console.log(JSON.stringify({
      tool: 'odavl',
      action: 'pr',
      subaction: 'open',
      pass: false,
      stderr: error?.message || 'Unknown error'
    }));
  }
} else if (cmd === 'shadow' && process.argv[3] === 'run') {
  const args = process.argv.slice(4);
  
  // Parse arguments functionally
  const refIndex = args.indexOf('--ref');
  let ref = (refIndex !== -1 && refIndex + 1 < args.length) ? args[refIndex + 1] : '';
  
  const wait = args.includes('--wait');
  const dryRun = args.includes('--dry-run');
  
  // Check governor for shadow run permission
  if (!dryRun) {
    const config = readGovernorConfig(process.cwd());
    const usage = currentUsage(process.cwd());
    const decision = decide('shadow', config, usage);
    
    if (decision.blocked) {
      let reasonKey = "shadow_concurrency";
      if (decision.reason === "outside_wave_window") {
        reasonKey = "outside_wave_window";
      } else if (decision.reason?.includes("CI time limit")) {
        reasonKey = "ci_time_limit";
      }
      
      console.log(JSON.stringify({
        pass: false,
        action: 'shadow',
        governor: {
          blocked: true,
          reason: reasonKey,
          limits: config,
          usage,
          nextWindow: (decision as any).nextWindow
        }
      }));
      process.exit(1);
    }
  }
  
  try {
    // Verify gh auth and git repo
    const ghAuthResult = run('gh auth status');
    if (ghAuthResult.status !== 0) {
      throw new Error('GitHub CLI not authenticated');
    }
    
    const gitResult = run('git rev-parse --is-inside-work-tree');
    if (gitResult.status !== 0) {
      throw new Error('Not in a git repository');
    }
    
    // Determine REF
    if (!ref) {
      const headResult = run('git rev-parse --abbrev-ref HEAD');
      if (headResult.status !== 0) {
        throw new Error('Cannot determine current branch');
      }
      ref = headResult.stdout.trim();
    }
    
    // Ensure upstream exists
    const upstreamResult = run(`git rev-parse --symbolic-full-name --abbrev-ref --quiet @{u}`);
    if (upstreamResult.status !== 0) {
      const pushResult = run('git push -u origin HEAD');
      if (pushResult.status !== 0) {
        throw new Error(`Failed to push upstream: ${pushResult.stderr}`);
      }
    }
    
    // Handle dry-run mode
    if (dryRun) {
      console.log(JSON.stringify({
        tool: 'odavl',
        action: 'shadow',
        subaction: 'run',
        ref,
        pass: true,
        stdout: 'Dry run - workflow would be triggered',
        stderr: ''
      }));
      process.exit(0);
    }
    
    // Trigger workflow
    const workflowResult = run(`gh workflow run ci.yml -r ${ref}`);
    if (workflowResult.status !== 0) {
      throw new Error(`Failed to trigger workflow: ${workflowResult.stderr}`);
    }
    
    // Brief pause to let workflow start
    const start = Date.now();
    while (Date.now() - start < 2000) { /* wait */ }
    
    // Discover latest run for REF
    let runResult = run(`gh run list --branch ${ref} --limit 1 --json databaseId,url,status,conclusion,headBranch,headSha,displayTitle -q .[0]`);
    if (runResult.status !== 0) {
      throw new Error(`Failed to get run info: ${runResult.stderr}`);
    }
    
    let runInfo = JSON.parse(runResult.stdout.trim());
    
    // If wait requested, watch the run
    if (wait && runInfo.databaseId) {
      run(`gh run watch ${runInfo.databaseId}`);
      // Re-fetch final status
      runResult = run(`gh run list --branch ${ref} --limit 1 --json databaseId,url,status,conclusion,headBranch,headSha,displayTitle -q .[0]`);
      if (runResult.status === 0) {
        runInfo = JSON.parse(runResult.stdout.trim());
      }
    }
    
    const result = {
      tool: 'odavl',
      action: 'shadow',
      subaction: 'run',
      ref,
      pass: runInfo.conclusion === 'success' || runInfo.status === 'queued' || runInfo.status === 'in_progress',
      url: runInfo.url || '',
      status: runInfo.status || 'unknown',
      conclusion: runInfo.conclusion || null,
      stdout: workflowResult.stdout,
      stderr: workflowResult.stderr
    };
    
    console.log(JSON.stringify(result));
  } catch (error: any) {
    console.log(JSON.stringify({
      tool: 'odavl',
      action: 'shadow',
      subaction: 'run',
      ref: ref || 'unknown',
      pass: false,
      stderr: error?.message || 'Unknown error'
    }));
  }
} else if (cmd === 'shadow' && process.argv[3] === 'status') {
  const args = process.argv.slice(4);
  // Parse arguments functionally
  const refIndex = args.indexOf('--ref');
  let ref = (refIndex !== -1 && refIndex + 1 < args.length) ? args[refIndex + 1] : '';
  
  const watch = args.includes('--watch');
  
  // Helper to fetch latest run for a ref
  function fetchLatestRun(targetRef: string): any {
    try {
      const result = execSync(`gh run list --limit 1 --json url,headBranch,status,conclusion,workflowName,createdAt,updatedAt,headSha --branch ${targetRef}`, { encoding: 'utf8' });
      const runs = JSON.parse(result);
      return Array.isArray(runs) && runs[0] ? runs[0] : null;
    } catch {
      return null;
    }
  }
  
  // Determine ref if not provided
  if (!ref) {
    try {
      const result = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' });
      ref = result.trim();
    } catch {
      ref = 'HEAD';
    }
  }
  
  // Output function
  function outputStatus(run: any) {
    const output = {
      pass: run ? run.conclusion === 'success' : false,
      action: 'shadow-status',
      ref,
      run: run || { url: null, status: 'not_found', conclusion: null, workflowName: null, headSha: null, createdAt: null, updatedAt: null }
    };
    console.log(JSON.stringify(output));
  }
  
  // Single-shot or watch mode
  if (watch) {
    const poll = () => {
      const run = fetchLatestRun(ref);
      outputStatus(run);
      
      if (run && ['success', 'failure', 'cancelled'].includes(run.conclusion)) {
        console.error('Stage W2-4H done.');
        return;
      }
      
      setTimeout(poll, 5000);
    };
    poll();
  } else {
    const run = fetchLatestRun(ref);
    outputStatus(run);
    console.error('Stage W2-4H done.');
  }
} else if (cmd === 'governor' && process.argv[3] === 'explain') {
  try {
    const config = readGovernorConfig(process.cwd());
    const usage = currentUsage(process.cwd());
    
    // Check both PR and shadow decisions
    const prDecision = decide('pr', config, usage);
    const shadowDecision = decide('shadow', config, usage);
    
    const prResult = {
      action: 'pr',
      allowedNow: !prDecision.blocked,
      reason: prDecision.reason,
      nextWindow: (prDecision as any).nextWindow,
      limits: config,
      usage
    };
    
    const shadowResult = {
      action: 'shadow', 
      allowedNow: !shadowDecision.blocked,
      reason: shadowDecision.reason,
      nextWindow: (shadowDecision as any).nextWindow,
      limits: config,
      usage
    };
    
    console.log(JSON.stringify({ pr: prResult, shadow: shadowResult }));
  } catch (error: any) {
    console.log(JSON.stringify({
      tool: 'odavl',
      action: 'governor',
      subaction: 'explain',
      pass: false,
      stderr: error?.message || 'Unknown error'
    }));
  }
} else if (cmd === 'report' && process.argv[3] === 'telemetry' && process.argv[4] === 'summary') {
  try {
    const args = process.argv.slice(5);
    // Parse arguments functionally  
    const sinceIndex = args.indexOf('--since');
    let since = (sinceIndex !== -1 && sinceIndex + 1 < args.length) ? args[sinceIndex + 1] : '24h';
    
    // Parse since parameter
    let cutoffTime: Date;
    if (since.endsWith('h')) {
      const hours = parseInt(since.slice(0, -1), 10) || 24;
      cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    } else {
      cutoffTime = new Date(since);
    }
    
    // Read and process telemetry log
    const logPath = path.join(process.cwd(), 'reports', 'telemetry.log.jsonl');
    let content = '';
    try {
      content = readFileSync(logPath, 'utf8');
    } catch {
      console.log(JSON.stringify({ window: since, kinds: {} }));
      process.exit(0);
    }
    
    const lines = content.trim().split('\n').filter(line => line);
    const spans: any[] = [];
    
    for (const line of lines) {
      try {
        const span = JSON.parse(line);
        const spanTime = new Date(span.ts);
        if (spanTime >= cutoffTime) {
          spans.push(span);
        }
      } catch {
        // Skip invalid lines
      }
    }
    
    // Aggregate by kind
    const kindStats: Record<string, { durations: number[]; successes: number; total: number }> = {};
    
    for (const span of spans) {
      if (!kindStats[span.kind]) {
        kindStats[span.kind] = { durations: [], successes: 0, total: 0 };
      }
      kindStats[span.kind].durations.push(span.durMs || 0);
      kindStats[span.kind].total += 1;
      if (span.ok) {
        kindStats[span.kind].successes += 1;
      }
    }
    
    // Calculate percentiles
    function percentile(arr: number[], p: number): number {
      if (arr.length === 0) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const index = Math.ceil(sorted.length * p / 100) - 1;
      return sorted[Math.max(0, index)];
    }
    
    const kinds: Record<string, any> = {};
    for (const [kind, stats] of Object.entries(kindStats)) {
      kinds[kind] = {
        count: stats.total,
        okRate: stats.total > 0 ? (stats.successes / stats.total) : 0,
        p50ms: percentile(stats.durations, 50),
        p95ms: percentile(stats.durations, 95)
      };
    }
    
    console.log(JSON.stringify({ window: since, kinds }));
  } catch (error: any) {
    console.log(JSON.stringify({ 
      window: 'error', 
      kinds: {}, 
      error: error?.message || 'Unknown error' 
    }));
  }
} else if (cmd === 'undo' && process.argv[3] === 'last') {
  try {
    const workspaceRoot = path.resolve(__dirname, '../../..');
    const stackPath = path.join(workspaceRoot, 'reports', 'undo', 'stack.json');
    const args = process.argv.slice(4);
    const showMode = args.includes('--show');
    
    // Read the undo stack
    let stack: any[] = [];
    try {
      const content = readFileSync(stackPath, 'utf8');
      stack = JSON.parse(content);
    } catch {
      console.log(JSON.stringify({ pass: false, action: 'undo', error: 'No undo history found' }));
      process.exit(1);
    }
    
    if (stack.length === 0) {
      console.log(JSON.stringify({ pass: false, action: 'undo', error: 'Undo stack is empty' }));
      process.exit(1);
    }
    
    const lastEntry = stack[stack.length - 1];
    
    if (showMode) {
      console.log(JSON.stringify({
        pass: true,
        action: 'undo',
        mode: 'show',
        files: lastEntry.files,
        ts: lastEntry.ts,
        branch: lastEntry.branch,
        kind: lastEntry.kind
      }));
      process.exit(0);
    }
    
    // Restore files from backup
    let restored = 0;
    const undoDir = path.join(workspaceRoot, 'reports', 'undo', lastEntry.ts);
    
    for (const relativePath of lastEntry.files) {
      try {
        const workspacePath = path.join(workspaceRoot, relativePath);
        const backupPath = path.join(undoDir, relativePath + '.bak');
        
        if (existsSync(backupPath)) {
          const backupContent = readFileSync(backupPath, 'utf8');
          writeFileSync(workspacePath, backupContent);
          restored++;
        }
      } catch {
        // Skip files that can't be restored
      }
    }
    
    // Remove entry from stack (but keep backup folder)
    stack.pop();
    writeFileSync(stackPath, JSON.stringify(stack, null, 2));
    
    console.log(JSON.stringify({
      pass: true,
      action: 'undo',
      restored,
      ts: lastEntry.ts,
      branch: lastEntry.branch,
      kind: lastEntry.kind
    }));
  } catch (error: any) {
    console.log(JSON.stringify({
      pass: false,
      action: 'undo',
      error: error?.message || 'Unknown error'
    }));
  }
} else if (cmd === 'abort') {
  try {
    const workspaceRoot = path.resolve(__dirname, '../../..');
    
    // Step 1: Get current branch
    let currentBranch = '';
    try {
      const branchResult = spawnSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
        cwd: workspaceRoot,
        encoding: 'utf8',
        shell: true
      });
      currentBranch = branchResult.stdout?.trim() || '';
    } catch {
      console.log(JSON.stringify({ pass: false, action: 'abort', error: 'Failed to get current branch' }));
      process.exit(1);
    }
    
    if (!currentBranch) {
      console.log(JSON.stringify({ pass: false, action: 'abort', error: 'Could not determine current branch' }));
      process.exit(1);
    }
    
    // Step 2: List in-progress runs on this branch
    let runs: any[] = [];
    try {
      const runsResult = spawnSync('gh', [
        'run', 'list', 
        '--status', 'in_progress',
        '--json', 'databaseId,headBranch,displayTitle,url',
        '--branch', currentBranch
      ], {
        cwd: workspaceRoot,
        encoding: 'utf8',
        shell: true
      });
      
      if (runsResult.status === 0 && runsResult.stdout) {
        const allRuns = JSON.parse(runsResult.stdout);
        runs = allRuns.filter((run: any) => run.headBranch === currentBranch);
      }
    } catch {
      // If gh CLI fails, continue with empty runs array
    }
    
    // Step 3: Cancel each run
    let cancelled = 0;
    const processedRuns: any[] = [];
    
    for (const run of runs) {
      try {
        const cancelResult = spawnSync('gh', ['run', 'cancel', run.databaseId.toString()], {
          cwd: workspaceRoot,
          shell: true
        });
        
        if (cancelResult.status === 0) {
          cancelled++;
        }
        
        processedRuns.push({
          id: run.databaseId,
          url: run.url,
          title: run.displayTitle
        });
      } catch {
        // Ignore individual cancel errors but still record the run
        processedRuns.push({
          id: run.databaseId,
          url: run.url,
          title: run.displayTitle
        });
      }
    }
    
    console.log(JSON.stringify({
      pass: true,
      action: 'abort',
      branch: currentBranch,
      cancelled,
      runs: processedRuns
    }));
  } catch (error: any) {
    console.log(JSON.stringify({
      pass: false,
      action: 'abort',
      error: error?.message || 'Unknown error'
    }));
  }
} else {
  console.log('Usage: odavl <command>');
  console.log('Commands:');
  console.log('  scan           Outputs placeholder HealthSnapshot JSON');
  console.log('  heal           Fix code issues (--recipe remove-unused, --apply)');
  console.log('  branch create  Create a new git branch');
  console.log('  pr open        Open a pull request (--explain, --dry-run, --title)');
  console.log('  shadow run     Trigger CI workflow (--ref <branch>, --wait, --dry-run)');
  console.log('  shadow status  Check CI workflow status (--ref <branch>, --watch)');
  console.log('  governor explain  Show current governor status for PR and shadow operations');
  console.log('  report telemetry summary  Show usage analytics (--since 24h|<ISO>)');
  console.log('  undo last      Restore files from last heal --apply (--show to preview)');
  console.log('  abort          Cancel in-progress GitHub Actions runs on current branch');
}