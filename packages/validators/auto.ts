import { mkdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";
import { defineContract, generateSmokeTest, type Contract } from "./index";

export type PreviewReg = { fnPath:string; inputsShape?:any; outputsShape?:any; critical?:boolean };
const match = (p:string, target:string) => p===target || basename(p)===basename(target);

export function previewContractsForChanges(changedPaths:string[], registry:PreviewReg[]) {
  const out:string[] = [];
  const targets = new Set(changedPaths);
  const list = (registry||[]).filter(c => Array.from(targets).some(p => match(p, c.fnPath)));
  if (!list.length) return { generated: out };
  mkdirSync("reports/w5/contracts", { recursive:true });
  for (const c of list) {
    const ct:Contract = defineContract({ fnPath:c.fnPath, inputsShape:c.inputsShape||{}, outputsShape:c.outputsShape||{}, critical:c.critical });
    const code = generateSmokeTest(ct);
    const file = `reports/w5/contracts/${ct.id}.preview.test.js`;
    writeFileSync(file, code);
    out.push(file);
  }
  return { generated: out };
}
