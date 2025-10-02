import { execSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
// Best-effort YAML parsing for governor config
export function readGovernorConfig(root) {
    const defaults = {
        prsPerDay: 2,
        ciMinutesPerHour: 30,
        maxConcurrentShadows: 2,
    };
    try {
        const policyPath = path.join(root, ".odavl.policy.yml");
        if (!existsSync(policyPath)) {
            return defaults;
        }
        const content = readFileSync(policyPath, "utf8");
        const cfg = Object.assign({}, defaults);
        // Simple regex-based YAML parsing for governor section
        const governorRegex = /governor:\s*\n((?:\s+\w+:.*\n?)*)/;
        const governorMatch = governorRegex.exec(content);
        if (governorMatch) {
            const governorSection = governorMatch[1];
            const prsRegex = /prsPerDay:\s*(\d+)/;
            const prsMatch = prsRegex.exec(governorSection);
            if (prsMatch)
                cfg.prsPerDay = parseInt(prsMatch[1], 10);
            const ciRegex = /ciMinutesPerHour:\s*(\d+)/;
            const ciMatch = ciRegex.exec(governorSection);
            if (ciMatch)
                cfg.ciMinutesPerHour = parseInt(ciMatch[1], 10);
            const shadowsRegex = /maxConcurrentShadows:\s*(\d+)/;
            const shadowsMatch = shadowsRegex.exec(governorSection);
            if (shadowsMatch)
                cfg.maxConcurrentShadows = parseInt(shadowsMatch[1], 10);
        }
        return cfg;
    }
    catch (_a) {
        return defaults;
    }
}
// Query current usage from GitHub API
export function currentUsage(root) {
    const usage = {
        openPrsToday: 0,
        shadowsInProgress: 0,
        estCiMinsHour: 0,
    };
    try {
        // Count open PRs created today
        const prResult = execSync("gh pr list --state open --json createdAt,headRefName", {
            encoding: "utf8",
            timeout: 10000,
        });
        const prs = JSON.parse(prResult);
        const today = new Date().toISOString().split("T")[0];
        usage.openPrsToday = prs.filter((pr) => { var _a; return (_a = pr.createdAt) === null || _a === void 0 ? void 0 : _a.startsWith(today); }).length;
        // Count shadows (CI runs) in progress
        const runResult = execSync("gh run list --status in_progress --json status,headBranch,displayTitle", {
            encoding: "utf8",
            timeout: 10000,
        });
        const runs = JSON.parse(runResult);
        usage.shadowsInProgress = runs.length;
        // Estimate CI minutes per hour (rough heuristic)
        const cfg = readGovernorConfig(root);
        usage.estCiMinsHour = Math.min(usage.shadowsInProgress * 10, cfg.ciMinutesPerHour || 30);
    }
    catch (error) {
        // Best-effort: if GitHub CLI fails, return safe defaults
        console.warn("Governor: GitHub CLI command failed:", error instanceof Error ? error.message : String(error));
    }
    // Update ledger
    updateLedger(root, usage);
    return usage;
}
// Wave window helpers
export function parseWindow(str) {
    if (!str || typeof str !== "string")
        return null;
    const windowRegex = /^(\d{1,2}):(\d{2})-(\d{1,2}):(\d{2})$/;
    const match = windowRegex.exec(str);
    if (!match)
        return null;
    const [, startH, startM, endH, endM] = match;
    const startMinutes = parseInt(startH) * 60 + parseInt(startM);
    const endMinutes = parseInt(endH) * 60 + parseInt(endM);
    return { startMinutes, endMinutes };
}
export function isWithin(nowLocalMinutes, win) {
    const { startMinutes, endMinutes } = win;
    if (startMinutes <= endMinutes) {
        // Same day window: 09:00-17:00
        return nowLocalMinutes >= startMinutes && nowLocalMinutes <= endMinutes;
    }
    else {
        // Overnight window: 22:00-06:00
        return nowLocalMinutes >= startMinutes || nowLocalMinutes <= endMinutes;
    }
}
export function nextWaveStart(nowLocalMinutes, win) {
    const { startMinutes } = win;
    if (nowLocalMinutes < startMinutes) {
        // Next start is today
        return startMinutes;
    }
    else {
        // Next start is tomorrow
        return startMinutes + 1440; // +24 hours in minutes
    }
}
// Decision logic for governor actions
export function decide(kind, cfg, usage) {
    var _a;
    const decision = {
        blocked: false,
        limits: cfg,
        usage,
    };
    // Check wave window if configured
    const wave = (_a = cfg.waves) === null || _a === void 0 ? void 0 : _a[0];
    const window = (wave === null || wave === void 0 ? void 0 : wave.window) ? parseWindow(wave.window) : null;
    if (window) {
        const now = new Date();
        const nowLocalMinutes = now.getHours() * 60 + now.getMinutes();
        const inWindow = isWithin(nowLocalMinutes, window);
        if (!inWindow && kind === "pr" && (cfg.prsPerDay || 0) > 0) {
            // Block PRs outside wave window when PR limits are set
            const nextStart = nextWaveStart(nowLocalMinutes, window);
            const nextHour = Math.floor((nextStart % 1440) / 60);
            const nextMin = (nextStart % 1440) % 60;
            const nextWindow = `${nextHour.toString().padStart(2, "0")}:${nextMin.toString().padStart(2, "0")}`;
            decision.blocked = true;
            decision.reason = "outside_wave_window";
            decision.nextWindow = nextWindow;
            return decision;
        }
    }
    if (kind === "pr") {
        if (usage.openPrsToday >= (cfg.prsPerDay || 2)) {
            decision.blocked = true;
            decision.reason = `PR limit reached: ${usage.openPrsToday}/${cfg.prsPerDay} per day`;
        }
    }
    else if (kind === "shadow") {
        if (usage.shadowsInProgress >= (cfg.maxConcurrentShadows || 2)) {
            decision.blocked = true;
            decision.reason = `Shadow limit reached: ${usage.shadowsInProgress}/${cfg.maxConcurrentShadows} concurrent`;
        }
        else if (usage.estCiMinsHour >= (cfg.ciMinutesPerHour || 30)) {
            decision.blocked = true;
            decision.reason = `CI time limit reached: ${usage.estCiMinsHour}/${cfg.ciMinutesPerHour} minutes/hour`;
        }
    }
    return decision;
}
// Maintain simple ledger for tracking
function updateLedger(root, usage) {
    try {
        const ledgerPath = path.join(root, "reports", "governor_ledger.json");
        const timestamp = new Date().toISOString();
        let ledger = [];
        if (existsSync(ledgerPath)) {
            const content = readFileSync(ledgerPath, "utf8");
            ledger = JSON.parse(content);
        }
        // Keep only last 24 entries (roughly hourly samples)
        ledger.push(Object.assign({ timestamp }, usage));
        if (ledger.length > 24) {
            ledger = ledger.slice(-24);
        }
        writeFileSync(ledgerPath, JSON.stringify(ledger, null, 2));
    }
    catch (_a) {
        // Best-effort: ignore ledger failures
    }
}
