// RBAC loader and enforcement stub
import fs from 'fs';
import yaml from 'js-yaml';
import { RbacConfig, RbacRole, RbacAction } from './rbac.schema.js';

export function loadRbacConfig(path = 'odavl.rbac.yml'): RbacConfig {
  const raw = fs.readFileSync(path, 'utf8');
  return yaml.load(raw) as RbacConfig;
}

export function enforceRbac(action: RbacAction, role: RbacRole, configPath = 'odavl.rbac.yml'): boolean {
  const config = loadRbacConfig(configPath);
  const roleDef = config.roles.find(r => r.name === role);
  if (!roleDef) return false;
  if (roleDef.allow.includes('*')) return true;
  return roleDef.allow.includes(action);
}
