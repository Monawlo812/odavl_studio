// RBAC loader and enforcement stub
import fs from 'fs';
import yaml from 'js-yaml';
export function loadRbacConfig(path = 'odavl.rbac.yml') {
    const raw = fs.readFileSync(path, 'utf8');
    return yaml.load(raw);
}
export function enforceRbac(action, role, configPath = 'odavl.rbac.yml') {
    const config = loadRbacConfig(configPath);
    // config.roles is an object: { admin: [...], runner: [...] }
    const allow = config.roles[role];
    if (!allow) return false;
    if (allow.includes('*')) return true;
    return allow.includes(action);
}
