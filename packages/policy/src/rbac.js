// RBAC loader and enforcement stub
import fs from 'fs';
import yaml from 'js-yaml';
export function loadRbacConfig(path = 'odavl.rbac.yml') {
    const raw = fs.readFileSync(path, 'utf8');
    return yaml.load(raw);
}
export function enforceRbac(action, role, configPath = 'odavl.rbac.yml') {
    const config = loadRbacConfig(configPath);
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
    // config.roles is an object: { admin: [...], runner: [...] }
    const allow = config.roles[role];
    if (!allow) return false;
    if (allow.includes('*')) return true;
    return allow.includes(action);
<<<<<<< HEAD
=======
    const roleDef = config.roles.find(r => r.name === role);
    if (!roleDef)
        return false;
    if (roleDef.allow.includes('*'))
        return true;
    return roleDef.allow.includes(action);
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
}
