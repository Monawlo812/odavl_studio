// scripts/synthesize-all-in-one.mjs
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

function collect(dir) {
  const files = [];
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, f.name);
    if (f.isDirectory()) files.push(...collect(p));
    else files.push(p);
  }
  return files;
}

const dirs = ["reports/evidence", "reports/shadow"];
let md = "# ODAVL All-in-One Evidence\n\n";

for (const dir of dirs) {
  let files = [];
  try { files = collect(dir); } catch {}
  for (const file of files) {
    const content = readFileSync(file, "utf8");
  md += `<details><summary>${file}</summary>\n\n\`\`\`\n${content}\n\`\`\`\n</details>\n\n`;
  }
}

writeFileSync("odavl-all-in-one.md", md);
console.log("All-in-One synthesized with", md.length, "chars");
