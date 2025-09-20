import { createHash } from 'crypto';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

export type TelemetryMode = "off" | "on" | "anonymized";

interface TelemetrySpan {
  ts: string;
  kind: string;
  durMs: number;
  ok: boolean;
  repoHash?: string;
  branchHash?: string;
  extra?: Record<string, string | number>;
}

interface SpanContext {
  repo?: string;
  branch?: string;
}

function hash(input: string): string {
  return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

function ensureReportsDir(): void {
  try {
    const reportsPath = join(process.cwd(), 'reports');
    if (!existsSync(reportsPath)) {
      mkdirSync(reportsPath, { recursive: true });
    }
  } catch {
    // Ignore errors
  }
}

function writeToLog(span: TelemetrySpan): void {
  try {
    ensureReportsDir();
    const logPath = join(process.cwd(), 'reports', 'telemetry.log.jsonl');
    const line = JSON.stringify(span) + '\n';
    writeFileSync(logPath, line, { flag: 'a' });
  } catch {
    // Never throw
  }
}

async function sendToEndpoint(span: TelemetrySpan): Promise<void> {
  try {
    const endpoint = process.env.ODAVL_TELEMETRY_ENDPOINT;
    if (!endpoint) return;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(span)
    });
    
    // Best-effort, ignore response
  } catch {
    // Ignore all errors
  }
}

export function startSpan(kind: string, mode: TelemetryMode, ctx?: SpanContext) {
  if (mode === "off") {
    return {
      end(_ok: boolean, _extra?: Record<string, any>): void {
        // No-op for off mode
      }
    };
  }

  const startTime = Date.now();
  const ts = new Date().toISOString();

  return {
    end(ok: boolean, extra?: Record<string, any>): void {
      const durMs = Date.now() - startTime;
      
      const span: TelemetrySpan = {
        ts,
        kind,
        durMs,
        ok
      };

      // Add context based on mode
      if (mode === "on" && ctx) {
        if (ctx.repo) span.repoHash = ctx.repo;
        if (ctx.branch) span.branchHash = ctx.branch;
      } else if (mode === "anonymized" && ctx) {
        if (ctx.repo) span.repoHash = hash(ctx.repo);
        if (ctx.branch) span.branchHash = hash(ctx.branch);
      }

      // Add extra data (filter to numbers/strings only)
      if (extra) {
        const filteredExtra: Record<string, string | number> = {};
        for (const [key, value] of Object.entries(extra)) {
          if (typeof value === 'string' || typeof value === 'number') {
            filteredExtra[key] = value;
          }
        }
        if (Object.keys(filteredExtra).length > 0) {
          span.extra = filteredExtra;
        }
      }

      // Write to local log
      writeToLog(span);

      // Send to endpoint if configured
      if (process.env.ODAVL_TELEMETRY_ENDPOINT) {
        sendToEndpoint(span).catch(() => {}); // Fire and forget
      }
    }
  };
}