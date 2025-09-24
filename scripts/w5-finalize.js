#!/usr/bin/env node
const {
  existsSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
} = require("node:fs");
function read(p) {
  try {
    return JSON.parse(readFileSync(p, "utf-8"));
  } catch {
    return undefined;
  }
}
const artifacts = {
  poly: read("reports/w5/polyglot-e2e.json"),
  ablation: read("reports/w5/planner-ablation.json"),
  tokens: read("reports/w5/planner-tokens-v2.json"),
  go: read("reports/w5/go-e2e.json"),
  java: read("reports/w5/java-e2e.json"),
  contracts: read("reports/w5/contracts-report.json"),
  mutation: read("reports/w5/mutation-preview.json"),
};
const hasGo = !!artifacts.go || (artifacts.poly && artifacts.poly.go);
const hasJava = !!artifacts.java || (artifacts.poly && artifacts.poly.java);
const hasContracts = !!artifacts.contracts;
const hasMutation = !!artifacts.mutation;
const tokensV2 = artifacts.tokens?.samples?.[0]?.tokens ?? null;

const finalcheck = {
  packs: { go: hasGo, java: hasJava },
  proofTwin: { previews: hasContracts },
  mutation: { preview: hasMutation },
  planner: { tokensV2 },
  artifacts: Object.keys(artifacts).filter((k) => !!artifacts[k]),
  ok: hasGo && hasJava && tokensV2 !== null,
};

const lines = [];
lines.push("# Wave 5 — QA Summary");
lines.push("");
lines.push(`- Go E2E: ${hasGo ? "✅" : "❌"}`);
lines.push(`- Java E2E: ${hasJava ? "✅" : "❌"}`);
lines.push(`- Contracts Preview Report: ${hasContracts ? "✅" : "❌"}`);
lines.push(`- Mutation Preview: ${hasMutation ? "✅" : "❌"}`);
lines.push(
  `- Planner Tokens v2 sample: ${tokensV2 !== null ? "✅ (" + tokensV2 + ")" : "❌"}`,
);
if (artifacts.go)
  lines.push(
    `- Go: lint=${artifacts.go.lintWarnings ?? "?"}, tests=${artifacts.go.testFailures ?? "?"}, vulns=${artifacts.go.vulns ?? "?"}`,
  );
if (artifacts.java)
  lines.push(
    `- Java: lint=${artifacts.java.lintWarnings ?? "?"}, tests=${artifacts.java.testFailures ?? "?"}`,
  );
if (artifacts.ablation)
  lines.push(
    `- Planner ablation: before=${artifacts.ablation.beforeOrder?.join(",") || "-"} → after=${artifacts.ablation.afterOrder?.join(",") || "-"}`,
  );
lines.push("");
lines.push(`Overall OK: ${finalcheck.ok ? "✅" : "❌"}`);

mkdirSync("reports/w5", { recursive: true });
writeFileSync(
  "reports/w5/w5-finalcheck.json",
  JSON.stringify(finalcheck, null, 2),
);
writeFileSync("reports/w5/w5-qa.md", lines.join("\n"));
console.log("w5-finalcheck.json & w5-qa.md written");
process.exit(0);
