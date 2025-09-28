// RBAC loader and enforcement stub
import fs from 'fs';
import yaml from 'js-yaml';
export function loadRbacConfig(path = 'odavl.rbac.yml') {
    const raw = fs.readFileSync(path, 'utf8');
    return yaml.load(raw);
}
export function enforceRbac(action, role, configPath = 'odavl.rbac.yml') {
    const config = loadRbacConfig(configPath);
    const roleDef = config.roles.find(r => r.name === role);
    if (!roleDef)
        return false;
    if (roleDef.allow.includes('*'))
        return true;
    return roleDef.allow.includes(action);
}
