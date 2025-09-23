#!/usr/bin/env node
import { classify } from './triage-lib.mjs';
const cases = [
  [{tsErrors:2, eslintErrors:0, deps:{outdatedPatch:0,outdatedMinor:0}}, 'moderate','ts-import-repair'],
  [{tsErrors:0, eslintErrors:5, deps:{outdatedPatch:0,outdatedMinor:0}}, 'minor','eslint-autofix'],
  [{tsErrors:0, eslintErrors:0, deps:{outdatedPatch:3,outdatedMinor:0}}, 'minor','deps-patch-minor'],
  [{tsErrors:0, eslintErrors:0, deps:{outdatedPatch:0,outdatedMinor:2}}, 'minor','deps-patch-minor'],
  [{tsErrors:0, eslintErrors:0, deps:{outdatedPatch:0,outdatedMinor:0}}, 'healthy', null],
  [{}, 'healthy', null],
];
let pass=0;
for (const [snap, expC, expP] of cases) {
  const {classification:c, playbook:p} = classify(snap);
  const ok = c===expC && p===expP;
  if (ok) pass++; else console.error('FAIL', {snap, got:{c,p}, want:{expC,expP}});
}
console.log(`triage-verify: ${pass}/${cases.length} PASS`);
if (pass!==cases.length) process.exit(1);
