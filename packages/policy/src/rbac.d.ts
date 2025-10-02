import { RbacConfig, RbacRole, RbacAction } from './rbac.schema.js';
export declare function loadRbacConfig(path?: string): RbacConfig;
export declare function enforceRbac(action: RbacAction, role: RbacRole, configPath?: string): boolean;
//# sourceMappingURL=rbac.d.ts.map