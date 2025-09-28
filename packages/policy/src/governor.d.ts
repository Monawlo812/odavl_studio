export interface GovernorCfg {
    prsPerDay?: number;
    ciMinutesPerHour?: number;
    maxConcurrentShadows?: number;
    waves?: Array<{
        window?: string;
        maxPrs?: number;
    }>;
}
export interface GovernorUsage {
    openPrsToday: number;
    shadowsInProgress: number;
    estCiMinsHour: number;
}
export interface GovernorDecision {
    blocked: boolean;
    reason?: string;
    limits: GovernorCfg;
    usage: GovernorUsage;
}
export declare function readGovernorConfig(root: string): GovernorCfg;
export declare function currentUsage(root: string): GovernorUsage;
export declare function parseWindow(str: string): {
    startMinutes: number;
    endMinutes: number;
} | null;
export declare function isWithin(nowLocalMinutes: number, win: {
    startMinutes: number;
    endMinutes: number;
}): boolean;
export declare function nextWaveStart(nowLocalMinutes: number, win: {
    startMinutes: number;
    endMinutes: number;
}): number;
export declare function decide(kind: "pr" | "shadow", cfg: GovernorCfg, usage: GovernorUsage): GovernorDecision;
//# sourceMappingURL=governor.d.ts.map