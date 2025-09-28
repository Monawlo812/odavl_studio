#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const policyPath = path.join(root, '.odavl.policy.yml');
const gatesPath = path.join(root, '.odavl', 'gates.yml');

const read = p => { try { return fs.readFileSync(p, 'utf8'); } catch { return ''; } };
const has = (txt, pat) => txt.includes(pat);

const policyTxt = read(policyPath);
const gatesTxt = read(gatesPath);

const ok = {
  policy_exists: fs.existsSync(policyPath),
  gates_exists: fs.existsSync(gatesPath),
  policy_keys_present: ['risk_budget','self_heal','vaccines','antibodies'].every(k => has(policyTxt, k + ':')),
  gates_rules_present: ['limits','protected_paths','requires'].every(k => has(gatesTxt, k + ':')),
  protected_paths_ok: ['**/security/**','**/*.spec.*','**/public-api/**'].every(p => has(gatesTxt, p)),
  limits_ok: has(gatesTxt, 'max_lines_changed: 40') && has(gatesTxt, 'max_files_changed: 10')
};

const outDir = path.join(root, 'reports', 'immune');
fs.mkdirSync(outDir, { recursive: true });

const report = { kind: 'p0-policy-attestation', time: new Date().toISOString(), ...ok };
const outPath = path.join(outDir, 'p0-policy-attestation.json');
fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8');
console.log('wrote', path.relative(root, outPath));
