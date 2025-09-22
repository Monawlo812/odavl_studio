export type Contract = {
  fnPath: string; inputsShape: any; outputsShape: any; critical?: boolean; id?: string;
};
export function defineContract(c: Contract): Contract {
  const id = Buffer.from(`${c.fnPath}:${Object.keys(c.inputsShape||{}).join(",")}`).toString("base64url").slice(0,16);
  return { ...c, id };
}
export function generateSmokeTest(c: Contract): string {
  const sIn = JSON.stringify(c.inputsShape ?? {});
  const sOut = JSON.stringify(c.outputsShape ?? {});
  return `// AUTO-GENERATED (preview)\n` +
    `const assert=require('node:assert');\n` +
    `const mod=require('${c.fnPath}');\n` +
    `const fn=(typeof mod==='function'?mod:mod.default||mod.fn);\n` +
    `assert.ok(typeof fn==='function','fn not found');\n` +
    `const out=fn(${sIn});\n` +
    `assert.ok(out!==undefined,'no output');\n` +
    `if (${sOut}!={}){ for(const k of Object.keys(${sOut})){ assert.ok(Object.hasOwn(out,k),'missing '+k); } }\n`;
}
