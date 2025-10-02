export type RbacRole = 'viewer' | 'runner' | 'reviewer' | 'admin';
export type RbacAction = 'report.read' | 'scan.run' | 'heal.run' | 'shadow.run' | 'pr.open' | 'waiver.create' | '*';
export interface RbacRoleDef {
    name: RbacRole;
    allow: RbacAction[];
}
export interface RbacScope {
    type: 'repo' | 'org' | 'project' | 'path';
    id: string;
    protectedPaths?: string[];
}
export interface RbacConfig {
    version: number;
    roles: RbacRoleDef[];
    scopes: RbacScope[];
}
//# sourceMappingURL=rbac.schema.d.ts.map