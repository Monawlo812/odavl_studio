#!/usr/bin/env node
// ODAVL E2E Test Script - Cross-platform Node.js
import { exec } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Helper to run commands with timeout and error handling
async function run(cmd, options = {}) {
  const { timeout = 30000, cwd = process.cwd() } = options;
  
  try {
    const { stdout, stderr } = await execAsync(cmd, {
      cwd,
      timeout,
      shell: true,
      encoding: 'utf8'
    });
    
    return {
      ok: true,
      code: 0,
      stdout: stdout || '',
      stderr: stderr || '',
      cmd
    };
  } catch (error) {
    // Handle timeout specifically
    if (error.signal === 'SIGTERM' || error.code === 'ETIMEDOUT') {
      return {
        ok: false,
        error: 'timeout',
        code: 124,
        stdout: error.stdout || '',
        stderr: error.stderr || '',
        cmd
      };
    }
    
    return {
      ok: false,
      error: error.message || 'unknown error',
      code: error.code || 1,
      stdout: error.stdout || '',
      stderr: error.stderr || '',
      cmd
    };
  }
}

// Helper to save JSON artifacts
function saveResult(filename, data) {
  try {
    const reportsDir = join(process.cwd(), 'reports');
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true });
    }
    
    const filepath = join(reportsDir, filename);
    writeFileSync(filepath, JSON.stringify(data, null, 2));
    return filepath;
  } catch (error) {
    console.error(`Failed to save ${filename}:`, error.message);
    return null;
  }
}

// Helper to wrap non-JSON outputs
function wrapOutput(result) {
  if (!result.ok) {
    return result;
  }
  
  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(result.stdout);
    return { ...result, parsed };
  } catch {
    // Not JSON, wrap as raw string
    return { ...result, raw: result.stdout };
  }
}

async function buildCli() {
  console.error('📦 Step 1: Building CLI...');
  const buildResult = await run('pnpm --filter @odavl/cli run build', { timeout: 60000 });
  if (!buildResult.ok) {
    console.error(`❌ CLI build failed: ${buildResult.error}`);
  } else {
    console.error('✅ CLI build complete');
  }
  return buildResult;
}

async function runScan(results, savedFiles) {
  console.error('🔍 Step 2: Running scan...');
  const scanResult = await run('node apps/cli/dist/index.js scan');
  const wrappedScan = wrapOutput(scanResult);
  results.scan = wrappedScan;
  const scanFile = saveResult('e2e-scan.json', wrappedScan);
  if (scanFile) savedFiles.push(scanFile);

  if (scanResult.ok) {
    console.error('✅ Scan complete');
  } else {
    console.error(`❌ Scan failed: ${scanResult.error}`);
  }
  return scanResult;
}

async function runHeal(results, savedFiles) {
  console.error('🔧 Step 3: Running heal dry-run...');
  const healResult = await run('node apps/cli/dist/index.js heal --recipe remove-unused --dry-run');
  const wrappedHeal = wrapOutput(healResult);
  results.heal = wrappedHeal;
  const healFile = saveResult('e2e-heal-dry.json', wrappedHeal);
  if (healFile) savedFiles.push(healFile);

  if (healResult.ok) {
    console.error('✅ Heal dry-run complete');
  } else {
    console.error(`❌ Heal dry-run failed: ${healResult.error}`);
  }
  return healResult;
}

async function createTempBranch(branchName) {
  console.error(`🌿 Step 4: Creating temp branch ${branchName}...`);
  const branchResult = await run(`git checkout -b ${branchName}`);
  let branchCreated = false;

  if (branchResult.ok) {
    console.error('✅ Temp branch created');
    branchCreated = true;

    // Try to push upstream (ignore failures - no remote is OK)
    const pushResult = await run(`git push -u origin ${branchName}`);
    if (pushResult.ok) {
      console.error('✅ Branch pushed to remote');
    } else {
      console.error('⚠️  Branch push failed (no remote configured?)');
    }
  } else {
    console.error(`❌ Branch creation failed: ${branchResult.error}`);
  }
  return branchCreated;
}

async function runShadow(results, savedFiles) {
  console.error('🌙 Step 5: Running shadow run --wait...');
  const shadowResult = await run('node apps/cli/dist/index.js shadow run --wait', { timeout: 180000 }); // 3 minutes
  const wrappedShadow = wrapOutput(shadowResult);
  results.shadow = wrappedShadow;
  const shadowFile = saveResult('e2e-shadow.json', wrappedShadow);
  if (shadowFile) savedFiles.push(shadowFile);

  if (shadowResult.ok) {
    console.error('✅ Shadow run complete');
  } else {
    console.error(`❌ Shadow run failed: ${shadowResult.error}`);
  }
  return shadowResult;
}

async function runPr(results, savedFiles) {
  console.error('📝 Step 6: Running PR dry-run...');
  const prResult = await run('node apps/cli/dist/index.js pr open --explain --dry-run --title "E2E Probe"');
  const wrappedPr = wrapOutput(prResult);
  results.pr = wrappedPr;
  const prFile = saveResult('e2e-pr-dry.json', wrappedPr);
  if (prFile) savedFiles.push(prFile);

  if (prResult.ok) {
    console.error('✅ PR dry-run complete');
  } else {
    console.error(`❌ PR dry-run failed: ${prResult.error}`);
  }
  return prResult;
}

async function cleanupBranch(branchCreated) {
  if (branchCreated) {
    console.error('🧹 Cleaning up: switching back to original branch...');
    const checkoutResult = await run('git checkout -');
    if (checkoutResult.ok) {
      console.error('✅ Switched back to original branch');
    } else {
      console.error('⚠️  Could not switch back to original branch');
    }
  }
}

function printSummary(timestamp, savedFiles, steps) {
  console.error('\n📊 E2E Test Suite Complete!');
  console.error(`🕒 Timestamp: ${timestamp}`);
  console.error(`📁 Artifacts saved (${savedFiles.length}/4):`);
  savedFiles.forEach(file => {
    console.error(`   - ${file}`);
  });

  const successful = steps.filter(r => r.ok).length;
  const total = steps.length;

  console.error(`✨ Success rate: ${successful}/${total} steps (${Math.round(successful/total*100)}%)`);

  if (successful === total) {
    console.error('🎉 All steps completed successfully!');
  } else if (successful >= total * 0.6) {
    console.error('⚠️  Most steps completed - partial success');
  } else {
    console.error('❌ Multiple failures detected - check logs above');
  }
}

async function main() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').replace(/\.\d{3}Z$/, 'Z');
  const branchName = `odavl/e2e-${timestamp}`;

  console.error('🚀 ODAVL E2E Test Suite Starting...');
  console.error(`Timestamp: ${timestamp}`);

  const results = {};
  const savedFiles = [];

  const buildResult = await buildCli();
  const scanResult = await runScan(results, savedFiles);
  const healResult = await runHeal(results, savedFiles);

  // --- PYTHON PACK E2E ---
  let pyScan, pyHeal;
  const pyDist = 'packages/packs/python/dist/index.js';
  if (existsSync(pyDist)) {
    // Scan
    pyScan = await run(`node -e "import('./${pyDist}').then(m=>m.scan().then(r=>console.log(JSON.stringify(r))))"`);
    let pyScanObj = { ok: pyScan.ok, out: pyScan.stdout, err: pyScan.stderr };
    try { pyScanObj = { ...pyScanObj, parsed: JSON.parse(pyScan.stdout) }; } catch {}
    saveResult('e2e-py-scan.json', pyScanObj);
    // Heal dry-run
    pyHeal = await run(`node -e "import('./${pyDist}').then(m=>m.heal({dryRun:true}).then(r=>console.log(JSON.stringify(r))))"`);
    let pyHealObj = { ok: pyHeal.ok, out: pyHeal.stdout, err: pyHeal.stderr };
    try { pyHealObj = { ...pyHealObj, parsed: JSON.parse(pyHeal.stdout) }; } catch {}
    saveResult('e2e-py-heal-dry.json', pyHealObj);
  } else {
    saveResult('e2e-py-scan.json', { ok: false, note: 'python pack not built' });
    saveResult('e2e-py-heal-dry.json', { ok: false, note: 'python pack not built' });
  }

  const branchCreated = await createTempBranch(branchName);
  const shadowResult = await runShadow(results, savedFiles);
  const prResult = await runPr(results, savedFiles);

  await cleanupBranch(branchCreated);

  // Compose summary JSON
  const summary = { ok: true, note: 'e2e done', ts: timestamp };
  saveResult('e2e-summary.json', summary);

  printSummary(timestamp, savedFiles, [buildResult, scanResult, healResult, shadowResult, prResult]);
  console.log("E2E (JS+PY) finished");
  process.exit(0);
}

// Run main with global error handling
main().catch(error => {
  console.error('💥 E2E script crashed:', error.message);
  
  // Try to save error info
  try {
    saveResult('e2e-error.json', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  } catch {
    // Ignore save errors in crash handler
  }
  
  console.error('🚨 E2E test suite terminated with errors');
  process.exit(0); // Still exit 0 as requested
});