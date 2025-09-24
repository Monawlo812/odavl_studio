import { execJson } from "./shell";
export type PyScan = {
  ruff?: number;
  tests?: { failures?: number };
  vulns?: number;
  note: string;
};
export async function scan(): Promise<PyScan> {
  // Helper to run a linter and parse count
  function getLintCount(
    cmd: string[],
    fallbackCmd?: string[],
  ): { count?: number; note: string } {
    const res = execJson(cmd);
    if (res.ok) {
      try {
        const parsed = JSON.parse(res.stdout);
        return {
          count: Array.isArray(parsed) ? parsed.length : undefined,
          note: "",
        };
      } catch {
        return { count: undefined, note: `${cmd[0]} output parse error` };
      }
    } else if (fallbackCmd) {
      const fallback = execJson(fallbackCmd);
      if (fallback.ok) {
        return {
          count: fallback.stdout.split("\n").filter(Boolean).length,
          note: `${cmd[0]} missing, used ${fallbackCmd[0]}`,
        };
      } else {
        return {
          count: undefined,
          note: `${cmd[0]}/${fallbackCmd[0]} missing`,
        };
      }
    } else {
      return { count: undefined, note: `${cmd[0]} missing` };
    }
  }

  // Ruff or flake8
  const { count: ruff, note: ruffNote } = getLintCount(
    ["ruff", "--output-format=json", "."],
    ["flake8", "."],
  );

  // Pytest
  function getTestFailures(): { failures?: number; note: string } {
    const pyRes = execJson(["pytest", "-q", "--maxfail=1"]);
    if (pyRes.ok) return { failures: 0, note: "" };
    if (pyRes.code !== 1 && pyRes.stderr.includes("not found"))
      return { failures: undefined, note: "pytest missing" };
    if (pyRes.stdout.includes("no tests ran")) return { failures: 0, note: "" };
    return { failures: 1, note: "" };
  }
  const { failures, note: testNote } = getTestFailures();

  // pip-audit
  const { count: vulns, note: vulnNote } = getLintCount([
    "pip-audit",
    "-f",
    "json",
  ]);

  let notes = [ruffNote, testNote, vulnNote].filter(Boolean).join("; ");
  return {
    ruff,
    tests: { failures },
    vulns,
    note: "python.scan ok" + (notes ? " | " + notes : ""),
  };
}
export type PyHealResult = {
  dryRun: boolean;
  changes?: { files: number; lines: number };
  actions?: {
    unusedImports?: { files: number; lines: number; note?: string };
    format?: { files: number; lines: number; note?: string };
    deps?: { candidates: number; note?: string };
  };
  guards?: { maxFiles: number; maxLines: number; guardHit: boolean };
  note: string;
};
export async function heal(
  opts: { dryRun?: boolean; maxFiles?: number; maxLines?: number } = {},
): Promise<PyHealResult> {
  const maxFiles = typeof opts.maxFiles === "number" ? opts.maxFiles : 10;
  const maxLines = typeof opts.maxLines === "number" ? opts.maxLines : 40;
  let notes: string[] = [];

  // Helper for ruff unused imports
  function getUnusedImports() {
    const ruff = execJson([
      "ruff",
      "--fix-dry-run",
      "--exit-zero-even-if-changed",
      ".",
    ]);
    if (ruff.ok) {
      const lines = ruff.stdout.split("\n");
      const unusedFiles = lines.filter((l) => /would fix|Fixed/.test(l)).length;
      const unusedLines = unusedFiles; // Approximate: 1 line per file
      let unusedNote = "";
      if (unusedFiles === 0 && ruff.stdout?.includes("No changes"))
        unusedNote = "no unused imports";
      return { unusedFiles, unusedLines, unusedNote };
    } else {
      return { unusedFiles: 0, unusedLines: 0, unusedNote: "ruff missing" };
    }
  }

  // Helper for black format
  function getFormatCheck() {
    const black = execJson(["black", "--check", "."]);
    if (!black.ok) {
      const match = black.stdout.match(/would reformat (.+)/g);
      return {
        fmtFiles: match ? match.length : 1,
        fmtLines: 0,
        fmtNote: "format needed",
      };
    }
    return { fmtFiles: 0, fmtLines: 0, fmtNote: "" };
  }

  // Helper for pip outdated
  function getDepCandidates() {
    const pip = execJson(["pip", "list", "--outdated", "--format=json"]);
    if (pip.ok) {
      try {
        const parsed = JSON.parse(pip.stdout);
        return {
          depCandidates: Array.isArray(parsed) ? parsed.length : 0,
          depNote: "",
        };
      } catch {
        return { depCandidates: 0, depNote: "pip list parse error" };
      }
    } else {
      return { depCandidates: 0, depNote: "pip missing" };
    }
  }

  const { unusedFiles, unusedLines, unusedNote } = getUnusedImports();
  if (unusedNote === "ruff missing") notes.push("ruff missing");
  const { fmtFiles, fmtLines, fmtNote } = getFormatCheck();
  const { depCandidates, depNote } = getDepCandidates();
  if (depNote === "pip missing") notes.push("pip missing");

  // Guard logic
  const totalFiles = unusedFiles + fmtFiles + depCandidates;
  const totalLines = unusedLines + fmtLines;
  const guardHit = totalFiles > maxFiles || totalLines > maxLines;
  let guardNote = "";
  if (guardHit) guardNote = "guard hit: would split into waves";

  // Compose result
  return {
    dryRun: true,
    changes: { files: totalFiles, lines: totalLines },
    actions: {
      unusedImports: {
        files: unusedFiles,
        lines: unusedLines,
        note: unusedNote,
      },
      format: { files: fmtFiles, lines: fmtLines, note: fmtNote },
      deps: { candidates: depCandidates, note: depNote },
    },
    guards: { maxFiles, maxLines, guardHit },
    note:
      [notes.join("; "), guardNote].filter(Boolean).join(" | ") ||
      "python.heal dry-run ok",
  };
}
