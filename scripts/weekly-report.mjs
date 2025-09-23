#!/usr/bin/env node

import { readdir, readFile, writeFile } from "fs/promises";
import { join } from "path";

/**
 * Weekly telemetry report generator
 * Scans ./reports for JSON artifacts and produces KPI summary
 */

async function scanReportsDirectory() {
  try {
    const files = await readdir("./reports");
    return files.filter((f) => f.endsWith(".json"));
  } catch (error) {
    // Reports directory doesn't exist yet - return empty array for new installations
    if (error.code === "ENOENT") {
      console.warn("Reports directory not found, creating empty summary");
      return [];
    }
    // Re-throw unexpected errors
    throw error;
  }
}

async function readJsonFile(filepath) {
  try {
    const content = await readFile(filepath, "utf8");
    return JSON.parse(content);
  } catch (error) {
    console.warn(`Failed to read ${filepath}:`, error.message);
    return null;
  }
}

function extractE2EKPIs(data) {
  return {
    e2eTests: data.stats.totalTests || 0,
    e2ePassed: data.stats.passedTests || 0,
    e2eFailed: data.stats.failedTests || 0,
  };
}

function extractGovernorKPIs(data) {
  if (!data.entries || !Array.isArray(data.entries)) return {};

  return {
    prsCreated: data.entries.filter((e) => e.action === "pr_create").length,
    ciMinutesUsed: data.entries
      .filter((e) => e.action === "ci_run")
      .reduce((sum, e) => sum + (e.minutes || 0), 0),
  };
}

function extractKPIs(data, filename) {
  const kpis = {};

  // E2E test results
  if (filename.startsWith("e2e-") && data.stats) {
    Object.assign(kpis, extractE2EKPIs(data));
  }

  // Wave 3 status
  if (filename === "w3-status.json" && data.health) {
    kpis.eslintErrors = data.health.eslintErrors || 0;
    kpis.typeErrors = data.health.typeErrors || 0;
    kpis.waveProgress = data.progress?.completed || 0;
  }

  // CLI scan results
  if (filename.startsWith("cli-scan") && data.validators) {
    kpis.eslintErrors = data.validators.eslint?.errorCount || 0;
    kpis.typeErrors = data.validators.typescript?.errorCount || 0;
  }

  // Shadow CI runs
  if (filename.includes("shadow") && data.runs) {
    kpis.ciRuns = Array.isArray(data.runs) ? data.runs.length : 0;
  }

  // PR data
  if (filename.includes("pr") && data.length) {
    kpis.openPRs = data.length;
  }

  // Governor ledger
  if (filename === "governor_ledger.json") {
    Object.assign(kpis, extractGovernorKPIs(data));
  }

  // Test telemetry data
  if (filename === "test-telemetry.json") {
    Object.assign(kpis, extractGovernorKPIs(data));
  }

  return kpis;
}

function aggregateKPIs(allKPIs) {
  const summary = {
    eslintErrors: 0,
    typeErrors: 0,
    e2eTests: 0,
    e2ePassed: 0,
    e2eFailed: 0,
    ciRuns: 0,
    ciMinutesUsed: 0,
    prsCreated: 0,
    openPRs: 0,
    waveProgress: 0,
  };

  // Aggregate metrics (taking latest/max values where appropriate)
  allKPIs.forEach((kpi) => {
    Object.keys(kpi).forEach((key) => {
      if (key === "eslintErrors" || key === "typeErrors") {
        // Take latest non-zero value
        if (kpi[key] > 0) summary[key] = kpi[key];
      } else if (key === "waveProgress") {
        // Take maximum progress
        summary[key] = Math.max(summary[key], kpi[key]);
      } else {
        // Sum other metrics
        summary[key] += kpi[key] || 0;
      }
    });
  });

  return summary;
}

function generateMarkdownReport(summary) {
  const timestamp = new Date().toISOString().split("T")[0];

  return `# Weekly Summary Report - ${timestamp}

## 🎯 Key Performance Indicators

### Code Quality
- **ESLint Errors**: ${summary.eslintErrors} 
- **TypeScript Errors**: ${summary.typeErrors}
- **Quality Trend**: ${summary.eslintErrors === 0 && summary.typeErrors === 0 ? "✅ Clean" : "⚠️ Issues detected"}

### Testing & CI
- **E2E Tests**: ${summary.e2ePassed}/${summary.e2eTests} passed (${summary.e2eTests > 0 ? Math.round((summary.e2ePassed / summary.e2eTests) * 100) : 0}%)
- **CI Runs**: ${summary.ciRuns} executions
- **CI Minutes Used**: ${summary.ciMinutesUsed} minutes

### Development Activity  
- **PRs Created**: ${summary.prsCreated}
- **Open PRs**: ${summary.openPRs}
- **Wave Progress**: ${summary.waveProgress}% complete

### Automation Health
- **Governor Status**: ${summary.prsCreated > 0 ? "🟢 Active" : "🟡 Idle"}
- **E2E Pipeline**: ${summary.e2eFailed === 0 ? "🟢 Stable" : "🔴 Issues"}
- **Overall Health**: ${getOverallHealth(summary)}

## 📊 Weekly Insights

${generateInsights(summary)}

---
*Generated on ${new Date().toISOString()} by ODAVL Studio*
`;
}

function getOverallHealth(summary) {
  const issues = [];
  if (summary.eslintErrors > 0) issues.push("Code quality");
  if (summary.typeErrors > 0) issues.push("Type safety");
  if (summary.e2eFailed > 0) issues.push("E2E tests");

  if (issues.length === 0) return "🟢 Excellent";
  if (issues.length === 1) return "🟡 Good";
  return "🔴 Needs attention";
}

function generateInsights(summary) {
  const insights = [];

  if (summary.eslintErrors === 0 && summary.typeErrors === 0) {
    insights.push("✅ Codebase maintains high quality standards");
  }

  if (summary.e2ePassed === summary.e2eTests && summary.e2eTests > 0) {
    insights.push("✅ All E2E tests passing consistently");
  }

  if (summary.prsCreated > 0) {
    insights.push(`🔄 ${summary.prsCreated} PRs created through automation`);
  }

  if (summary.ciMinutesUsed > 0) {
    insights.push(
      `⏱️ ${summary.ciMinutesUsed} CI minutes utilized for validation`,
    );
  }

  if (insights.length === 0) {
    insights.push("📊 Monitoring period with baseline metrics captured");
  }

  return insights.map((insight) => `- ${insight}`).join("\n");
}

async function main() {
  console.log("🔍 Scanning reports directory...");

  const jsonFiles = await scanReportsDirectory();
  console.log(`📁 Found ${jsonFiles.length} JSON files`);

  const allKPIs = [];

  for (const filename of jsonFiles) {
    const filepath = join("./reports", filename);
    const data = await readJsonFile(filepath);

    if (data) {
      const kpis = extractKPIs(data, filename);
      if (Object.keys(kpis).length > 0) {
        allKPIs.push(kpis);
        console.log(`📊 Extracted KPIs from ${filename}`);
      }
    }
  }

  const summary = aggregateKPIs(allKPIs);
  console.log("📈 Aggregated metrics:", summary);

  const report = generateMarkdownReport(summary);

  await writeFile("./reports/weekly-summary.md", report);
  console.log("✅ Weekly summary generated: ./reports/weekly-summary.md");
}

main().catch(console.error);
