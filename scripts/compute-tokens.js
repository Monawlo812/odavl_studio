#!/usr/bin/env node
const { mkdirSync, writeFileSync } = require("node:fs");
function compute(i) {
  const base = Math.min(15, Math.max(5, i.base ?? 10));
  const k1 = 5,
    k2 = 8,
    k3 = 1,
    k4 = 3;
  const raw =
    base +
    k1 * (i.coveragePct || 0) -
    k2 * (i.flakeRate || 0) -
    k3 * (i.rollbacks30d || 0) -
    k4 * (i.repoSizeFactor || 0);
  const tokens = Math.min(25, Math.max(5, Math.round(raw)));
  return { tokens, base, k: { k1, k2, k3, k4 }, input: i };
}
const sample = [
  {
    coveragePct: 0.75,
    flakeRate: 0.05,
    rollbacks30d: 0,
    repoSizeFactor: 0.3,
    base: 10,
  },
  {
    coveragePct: 0.35,
    flakeRate: 0.25,
    rollbacks30d: 2,
    repoSizeFactor: 0.7,
    base: 10,
  },
].map(compute);
mkdirSync("reports/w5", { recursive: true });
writeFileSync(
  "reports/w5/planner-tokens-v2.json",
  JSON.stringify({ stage: "W5-E.0", samples: sample }, null, 2),
);
console.log("reports/w5/planner-tokens-v2.json written");
