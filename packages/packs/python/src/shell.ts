import { spawnSync } from "child_process";
export function execJson(
  cmd: string[],
  cwd = process.cwd(),
): { ok: boolean; code: number; stdout: string; stderr: string } {
  try {
    const p = spawnSync(cmd[0], cmd.slice(1), {
      cwd,
      encoding: "utf8",
      timeout: 20000,
    });
    return {
      ok: p.status === 0,
      code: p.status ?? 1,
      stdout: p.stdout || "",
      stderr: p.stderr || "",
    };
  } catch (e) {
    return {
      ok: false,
      code: 1,
      stdout: "",
      stderr:
        e && typeof e === "object" && "message" in e
          ? (e as any).message
          : String(e),
    };
  }
}
