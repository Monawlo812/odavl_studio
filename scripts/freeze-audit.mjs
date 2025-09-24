import { writeFileSync, existsSync } from "fs";

const required = [
  "reports/shadow/verify-report.md",
  "reports/attestation.json",
  "reports/cleanup/kill-list.json",
  "reports/executive/scoreboard.md"
];

const evidence = required.map(f => ({ file: f, exists: existsSync(f) }));

const result = {
  timestamp: new Date().toISOString(),
  allPresent: evidence.every(e => e.exists),
  evidence
};

writeFileSync("reports/final-audit.json", JSON.stringify(result, null, 2));

let md = `# Final Audit Report\n\n- Timestamp: ${result.timestamp}\n- All Required Present: ${result.allPresent}\n\n## Evidence\n`;
for (const e of evidence) {
  md += `- ${e.file}: ${e.exists ? "✅" : "❌"}\n`;
}
writeFileSync("reports/final-audit.md", md);

console.log("Final audit complete", result);
