// RBAC loader and enforcement stub
import fs from 'fs';
import yaml from 'js-yaml';
import { RbacConfig, RbacRole, RbacAction } from './rbac.schema.js';

export function loadRbacConfig(path = 'odavl.rbac.yml'): RbacConfig {
  const raw = fs.readFileSync(path, 'utf8');
  return yaml.load(raw) as RbacConfig;
}

export function enforceRbac(action: RbacAction, role: RbacRole): boolean {
  // Minimal stub: always allow admin, else deny
  if (role === 'admin') return true;
  // Real logic will be added in next batch
  return false;
}
