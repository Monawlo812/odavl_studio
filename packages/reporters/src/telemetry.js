import { createHash } from "crypto";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
function hash(input) {
    return createHash("sha256").update(input).digest("hex").slice(0, 16);
}
function ensureReportsDir() {
    try {
        const reportsPath = join(process.cwd(), "reports");
        if (!existsSync(reportsPath)) {
            mkdirSync(reportsPath, { recursive: true });
        }
    }
    catch {
        // Ignore errors
    }
}
function writeToLog(span) {
    try {
        ensureReportsDir();
        const logPath = join(process.cwd(), "reports", "telemetry.log.jsonl");
        const line = JSON.stringify(span) + "\n";
        writeFileSync(logPath, line, { flag: "a" });
    }
    catch {
        // Never throw
    }
}
async function sendToEndpoint(span) {
    try {
        const endpoint = process.env.ODAVL_TELEMETRY_ENDPOINT;
        if (!endpoint)
            return;
        await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(span),
        });
        // Best-effort, ignore response
    }
    catch {
        // Ignore all errors
    }
}
function createBaseSpan(ts, kind, durMs, ok) {
    return { ts, kind, durMs, ok };
}
function addContextToSpan(span, mode, ctx) {
    if (!ctx)
        return;
    if (mode === "on") {
        if (ctx.repo)
            span.repoHash = ctx.repo;
        if (ctx.branch)
            span.branchHash = ctx.branch;
    }
    else if (mode === "anonymized") {
        if (ctx.repo)
            span.repoHash = hash(ctx.repo);
        if (ctx.branch)
            span.branchHash = hash(ctx.branch);
    }
}
function addExtraToSpan(span, extra) {
    if (!extra)
        return;
    const filteredExtra = {};
    for (const [key, value] of Object.entries(extra)) {
        if (typeof value === "string" || typeof value === "number") {
            filteredExtra[key] = value;
        }
    }
    if (Object.keys(filteredExtra).length > 0) {
        span.extra = filteredExtra;
    }
}
export function startSpan(kind, mode, ctx) {
    if (mode === "off") {
        return {
            end(_ok, _extra) {
                // No-op for off mode
            },
        };
    }
    const startTime = Date.now();
    const ts = new Date().toISOString();
    return {
        end(ok, extra) {
            const durMs = Date.now() - startTime;
            const span = createBaseSpan(ts, kind, durMs, ok);
            addContextToSpan(span, mode, ctx);
            addExtraToSpan(span, extra);
            writeToLog(span);
            if (process.env.ODAVL_TELEMETRY_ENDPOINT) {
                sendToEndpoint(span).catch(() => { }); // Fire and forget
            }
        },
    };
}
