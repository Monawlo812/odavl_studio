import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';

export interface GovernorCfg {
  prsPerDay?: number;
  ciMinutesPerHour?: number;
  maxConcurrentShadows?: number;
}

export interface GovernorUsage {
  openPrsToday: number;
  shadowsInProgress: number;
  estCiMinsHour: number;
}

export interface GovernorDecision {
  blocked: boolean;
  reason?: string;
  limits: GovernorCfg;
  usage: GovernorUsage;
}

// Best-effort YAML parsing for governor config
export function readGovernorConfig(root: string): GovernorCfg {
  const defaults: GovernorCfg = {
    prsPerDay: 2,
    ciMinutesPerHour: 30,
    maxConcurrentShadows: 2
  };

  try {
    const policyPath = path.join(root, '.odavl.policy.yml');
    if (!existsSync(policyPath)) {
      return defaults;
    }

    const content = readFileSync(policyPath, 'utf8');
    const cfg: GovernorCfg = { ...defaults };

    // Simple regex-based YAML parsing for governor section
    const governorMatch = content.match(/governor:\s*\n((?:\s+\w+:.*\n?)*)/);
    if (governorMatch) {
      const governorSection = governorMatch[1];
      
      const prsMatch = governorSection.match(/prsPerDay:\s*(\d+)/);
      if (prsMatch) cfg.prsPerDay = parseInt(prsMatch[1], 10);
      
      const ciMatch = governorSection.match(/ciMinutesPerHour:\s*(\d+)/);
      if (ciMatch) cfg.ciMinutesPerHour = parseInt(ciMatch[1], 10);
      
      const shadowsMatch = governorSection.match(/maxConcurrentShadows:\s*(\d+)/);
      if (shadowsMatch) cfg.maxConcurrentShadows = parseInt(shadowsMatch[1], 10);
    }

    return cfg;
  } catch {
    return defaults;
  }
}

// Query current usage from GitHub API
export function currentUsage(root: string): GovernorUsage {
  const usage: GovernorUsage = {
    openPrsToday: 0,
    shadowsInProgress: 0,
    estCiMinsHour: 0
  };

  try {
    // Count open PRs created today
    const prResult = execSync('gh pr list --state open --json createdAt,headRefName', { 
      encoding: 'utf8',
      timeout: 10000 
    });
    const prs = JSON.parse(prResult);
    const today = new Date().toISOString().split('T')[0];
    
    usage.openPrsToday = prs.filter((pr: any) => 
      pr.createdAt && pr.createdAt.startsWith(today)
    ).length;

    // Count shadows (CI runs) in progress
    const runResult = execSync('gh run list --status in_progress --json status,headBranch,displayTitle', { 
      encoding: 'utf8',
      timeout: 10000 
    });
    const runs = JSON.parse(runResult);
    usage.shadowsInProgress = runs.length;

    // Estimate CI minutes per hour (rough heuristic)
    const cfg = readGovernorConfig(root);
    usage.estCiMinsHour = Math.min(
      usage.shadowsInProgress * 10, 
      cfg.ciMinutesPerHour || 30
    );

  } catch (error) {
    // Best-effort: if GitHub CLI fails, return safe defaults
  }

  // Update ledger
  updateLedger(root, usage);

  return usage;
}

// Decision logic for governor actions
export function decide(
  kind: "pr" | "shadow", 
  cfg: GovernorCfg, 
  usage: GovernorUsage
): GovernorDecision {
  const decision: GovernorDecision = {
    blocked: false,
    limits: cfg,
    usage
  };

  if (kind === "pr") {
    if (usage.openPrsToday >= (cfg.prsPerDay || 2)) {
      decision.blocked = true;
      decision.reason = `PR limit reached: ${usage.openPrsToday}/${cfg.prsPerDay} per day`;
    }
  } else if (kind === "shadow") {
    if (usage.shadowsInProgress >= (cfg.maxConcurrentShadows || 2)) {
      decision.blocked = true;
      decision.reason = `Shadow limit reached: ${usage.shadowsInProgress}/${cfg.maxConcurrentShadows} concurrent`;
    } else if (usage.estCiMinsHour >= (cfg.ciMinutesPerHour || 30)) {
      decision.blocked = true;
      decision.reason = `CI time limit reached: ${usage.estCiMinsHour}/${cfg.ciMinutesPerHour} minutes/hour`;
    }
  }

  return decision;
}

// Maintain simple ledger for tracking
function updateLedger(root: string, usage: GovernorUsage): void {
  try {
    const ledgerPath = path.join(root, 'reports', 'governor_ledger.json');
    const timestamp = new Date().toISOString();
    
    let ledger: any[] = [];
    if (existsSync(ledgerPath)) {
      const content = readFileSync(ledgerPath, 'utf8');
      ledger = JSON.parse(content);
    }

    // Keep only last 24 entries (roughly hourly samples)
    ledger.push({ timestamp, ...usage });
    if (ledger.length > 24) {
      ledger = ledger.slice(-24);
    }

    writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
  } catch {
    // Best-effort: ignore ledger failures
  }
}