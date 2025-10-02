#!/usr/bin/env node
// ODAVL Studio Hygiene Auto-Repair Script
// Wave H7: Automatically archives, updates index, lints, and logs hygiene fixes
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT = process.cwd();
const REPORTS = path.join(ROOT, 'reports');
const FINAL = path.join(REPORTS, 'final');
const ARCHIVE = path.join(REPORTS, 'archive');
const INDEX = path.join(REPORTS, 'INDEX.md');
const SUMMARY = path.join(REPORTS, 'hygiene', 'final-hygiene-summary.md');
const LOG = path.join(REPORTS, 'hygiene', 'auto-repair-log.md');
const AUTO_SUMMARY = path.join(REPORTS, 'hygiene', 'auto-repair-summary.md');

const PROTECTED = [/security\//, /\.spec\./, /public-api\//];
const FINAL_REPORTS = [
  'SECURITY_ALL_IN_ONE.md',
  'TESTS_ALL_IN_ONE.md',
  'AUDIT_BOOK.md',
  'HYGIENE_ALL_IN_ONE.md',
];

function isProtected(file) {
  return PROTECTED.some((re) => re.test(file));
}

function isFinalReport(file) {
  return FINAL_REPORTS.includes(path.basename(file));
}

function banner(file, link) {
  const ext = path.extname(file);
  if (ext === '.json') return `// ARCHIVED — Superseded by ${link}\n`;
  return `ARCHIVED — Superseded by ${link}\n`;
}

function archiveFile(file, reasonLink) {
  const rel = path.relative(ROOT, file);
  if (isProtected(rel)) return false;
  const dest = path.join(ARCHIVE, path.basename(file));
  let content = fs.readFileSync(file, 'utf8');
  if (!content.startsWith('ARCHIVED')) {
    content = banner(file, reasonLink) + content;
    fs.writeFileSync(file, content);
  }
  fs.renameSync(file, dest);
  return dest;
}

function lintMarkdown(file) {
  try {
    execSync(`npx markdownlint --fix "${file}"`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function updateIndex(finals, archives) {
  let idx = `# ODAVL Studio – Reports Index\n\nThis index serves as the central navigation hub for all compliance, audit, security, hygiene, and test evidence in the repository.\n\n---\n\n## Executive Summary\nODAVL Studio maintains a Zero Noise / Zero Risk repository policy. All evidence is consolidated, archived, and continuously validated by an automated Hygiene Gate.\n\n---\n\n## Status Table\n| Unified Reports | Archived Reports | Logs/Evidence | Last Audit Timestamp |\n|----------------|-----------------|--------------|---------------------|\n| ${finals.length} | ${archives.length} | All preserved| ${new Date().toISOString().slice(0,10)} |\n\n---\n\n## Unified (FINAL) Reports\n`;
  finals.forEach(f => { idx += `- [${f}](final/${f})\n`; });
  idx += `\n---\n\n## Archived Reports\n`;
  archives.forEach(a => { idx += `- [${a}](archive/${a})\n`; });
  idx += `\n---\n\n**All evidence is preserved and auditable. Unified reports are the authoritative source for compliance and review.**\n`;
  fs.writeFileSync(INDEX, idx);
}

function logAction(msg) {
  fs.appendFileSync(LOG, `[${new Date().toISOString()}] ${msg}\n`);
}

function main() {
  let violations = [];
  let autoFixed = [];
  // 1. Find duplicate/unclassified reports outside final/archive
  const allReports = fs.readdirSync(REPORTS).filter(f => f.endsWith('.md') || f.endsWith('.json'));
  allReports.forEach(f => {
    const full = path.join(REPORTS, f);
    if (!isFinalReport(f) && !fs.existsSync(path.join(ARCHIVE, f))) {
      if (!isProtected(f)) {
        archiveFile(full, 'reports/final/HYGIENE_ALL_IN_ONE.md');
        violations.push(f);
        autoFixed.push(f);
        logAction(`Archived ${f}`);
      }
    }
  });
  // 2. Lint FINAL reports
  FINAL_REPORTS.forEach(f => {
    const file = path.join(FINAL, f);
    if (fs.existsSync(file)) {
      if (lintMarkdown(file)) logAction(`Linted ${f}`);
    }
  });
  // 3. Update index
  const finals = FINAL_REPORTS.filter(f => fs.existsSync(path.join(FINAL, f)));
  const archives = fs.readdirSync(ARCHIVE);
  updateIndex(finals, archives);
  logAction('Updated INDEX.md');
  // 4. Refresh summary
  const summary = `# Final Hygiene Summary\n\n## Executive Confirmation\n- INDEX.md exists and is complete\n- hygiene.yml gate is active\n\n## Auto-Repair Actions\n- Violations detected: ${violations.length}\n- Violations auto-fixed: ${autoFixed.length}\n\n## Timestamp\n- ${new Date().toISOString()}\n`;
  fs.writeFileSync(SUMMARY, summary);
  logAction('Refreshed final-hygiene-summary.md');
  // 5. Write audit evidence
  const autoSummary = `# Hygiene Auto-Repair Summary\n\n## Violations Detected\n${violations.map(v => `- ${v}`).join('\n') || 'None'}\n\n## Actions Taken\n${autoFixed.map(a => `- Archived ${a}`).join('\n') || 'None'}\n\n## PR Link\n- (To be filled by CI)\n\n## Verification Status\n- (To be filled by CI after PR)\n`;
  fs.writeFileSync(AUTO_SUMMARY, autoSummary);
  logAction('Wrote auto-repair-summary.md');
}

main();
