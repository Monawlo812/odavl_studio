export function classify(s={}) {
  const r=[]; let c='healthy', p=null;
  const ts = Number.isFinite(s.tsErrors)? s.tsErrors : null;
  const es = Number.isFinite(s.eslintErrors)? s.eslintErrors : null;
  const dp = s.deps && Number.isFinite(s.deps.outdatedPatch)? s.deps.outdatedPatch : 0;
  const dm = s.deps && Number.isFinite(s.deps.outdatedMinor)? s.deps.outdatedMinor : 0;

  if (ts>0) { c='moderate'; p='ts-import-repair'; r.push('tsErrors>0'); }
  else if ((es??0)>0) { c='minor'; p='eslint-autofix'; r.push('eslintErrors>0'); }
  else if ((dp+dm)>0) { c='minor'; p='deps-patch-minor'; r.push(`deps outdated patch=${dp} minor=${dm}`); }

  return { classification: c, playbook: p, reasons: r };
}
