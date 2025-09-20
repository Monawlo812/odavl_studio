import { readFileSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

/**
 * Dependencies Patch/Minor upgrade codemod with OSV security integration
 * - Reads package.json files in workspace
 * - Uses `pnpm outdated --json` to find upgrades
 * - Uses OSV scanner for security recommendations (best-effort)
 * - Suggests only patch/minor upgrades (respects ^ and ~)
 * - Dry-run by default (no file writes)
 */
export async function depsPatchMinor(root: string): Promise<{ changes: Array<{path: string; name: string; from: string; to: string; reason?: string}> }> {
  const changes: Array<{path: string; name: string; from: string; to: string; reason?: string}> = [];
  
  try {
    // Get OSV security recommendations (best-effort)
    const osvSafe = await getOsvSafeVersions(root);
    
    // Get outdated packages
    const outdatedOutput = execSync('pnpm outdated --json', { 
      cwd: root, encoding: 'utf8', timeout: 10000, stdio: 'pipe'
    });
    const outdatedData = JSON.parse(outdatedOutput);
    
    // Find and process package.json files
    const packagePaths = await findPackageJsonFiles(root);
    
    for (const pkgPath of packagePaths) {
      const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
      
      for (const section of ['dependencies', 'devDependencies']) {
        if (!pkg[section]) continue;
        
        for (const [name, currentRange] of Object.entries(pkg[section])) {
          const outdatedInfo = outdatedData[name];
          if (!outdatedInfo) continue;
          
          const { current, latest } = outdatedInfo;
          const osvVersion = osvSafe[name];
          
          // Prefer OSV safe version if within same major, otherwise use latest
          let targetVersion = latest;
          let reason = 'outdated';
          
          if (osvVersion && isWithinSameMajor(current, osvVersion)) {
            targetVersion = osvVersion;
            reason = 'osv';
          }
          
          // Only suggest patch/minor upgrades within same major version
          if (isPatchOrMinorUpgrade(current, targetVersion, currentRange as string)) {
            changes.push({
              path: pkgPath,
              name,
              from: currentRange as string,
              to: updateVersionRange(currentRange as string, targetVersion),
              reason
            });
          }
        }
      }
    }
  } catch {
    // Best-effort: return empty changes if anything fails
  }
  
  return { changes };
}

async function getOsvSafeVersions(root: string): Promise<{[pkgName: string]: string}> {
  try {
    const lockfilePath = join(root, 'pnpm-lock.yaml');
    if (!existsSync(lockfilePath)) return {};
    
    const osvOutput = execSync(`osv-scanner --format json --lockfile ${lockfilePath}`, {
      cwd: root, encoding: 'utf8', timeout: 15000, stdio: 'pipe'
    });
    
    const osvData = JSON.parse(osvOutput);
    const safeVersions: {[pkgName: string]: string} = {};
    
    osvData.results?.forEach((result: any) => {
      result.packages?.forEach((pkg: any) => {
        if (pkg.package?.name) {
          const fixedVersion = extractFixedVersion(result.vulnerabilities);
          if (fixedVersion) safeVersions[pkg.package.name] = fixedVersion;
        }
      });
    });
    
    return safeVersions;
  } catch {
    return {}; // OSV scan failed - proceed without OSV data
  }
}

function extractFixedVersion(vulnerabilities: any[]): string | null {
  for (const vuln of vulnerabilities || []) {
    const events = vuln.affected?.[0]?.ranges?.[0]?.events;
    if (events) {
      const fixedEvent = events.find((e: any) => e.fixed);
      if (fixedEvent?.fixed && /^\d+\.\d+\.\d+/.test(fixedEvent.fixed)) {
        return fixedEvent.fixed;
      }
    }
  }
  return null;
}

async function findPackageJsonFiles(root: string): Promise<string[]> {
  const packagePaths: string[] = [join(root, 'package.json')];
  
  try {
    const workspaceConfig = readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8');
    const workspaceMatch = workspaceConfig.match(/packages:\s*\n((?:\s*-\s*.+\n)*)/);
    
    if (workspaceMatch) {
      const globs = workspaceMatch[1].split('\n')
        .map(line => line.replace(/^\s*-\s*['"]?(.+?)['"]?\s*$/, '$1'))
        .filter(Boolean);
      
      for (const glob of globs) {
        if (glob.endsWith('/*')) {
          const baseDir = glob.slice(0, -2);
          packagePaths.push(join(root, baseDir, 'cli', 'package.json'));
          packagePaths.push(join(root, baseDir, 'vscode-ext', 'package.json'));
        }
      }
    }
  } catch {
    // Fallback to just root package.json
  }
  
  return packagePaths;
}

function isPatchOrMinorUpgrade(current: string, latest: string, range: string): boolean {
  const currentMajor = parseInt(current.split('.')[0] || '0');
  const latestMajor = parseInt(latest.split('.')[0] || '0');
  return currentMajor === latestMajor && current !== latest;
}

function isWithinSameMajor(current: string, target: string): boolean {
  const currentMajor = parseInt(current.split('.')[0] || '0');
  const targetMajor = parseInt(target.split('.')[0] || '0');
  return currentMajor === targetMajor;
}

function updateVersionRange(currentRange: string, newVersion: string): string {
  if (currentRange.startsWith('^')) return `^${newVersion}`;
  if (currentRange.startsWith('~')) return `~${newVersion}`;
  return newVersion;
}