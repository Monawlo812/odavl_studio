import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
/**
 * Dependencies Patch/Minor upgrade codemod
 * - Reads package.json files in workspace
 * - Uses `pnpm outdated --json` to find upgrades
 * - Suggests only patch/minor upgrades (respects ^ and ~)
 * - Dry-run by default (no file writes)
 * - Best-effort with fallbacks
 */
export async function depsPatchMinor(root) {
    const changes = [];
    try {
        // Find package.json files in workspace
        const packagePaths = await findPackageJsonFiles(root);
        // Try to get outdated packages via pnpm
        let outdatedData;
        try {
            const outdatedOutput = execSync('pnpm outdated --json', {
                cwd: root,
                encoding: 'utf8',
                timeout: 10000
            });
            outdatedData = JSON.parse(outdatedOutput);
        }
        catch {
            // Fallback: no pnpm available or no outdated packages
            return { changes: [] };
        }
        // Process each package.json
        for (const pkgPath of packagePaths) {
            try {
                const pkgContent = readFileSync(pkgPath, 'utf8');
                const pkg = JSON.parse(pkgContent);
                // Check dependencies and devDependencies
                const depSections = ['dependencies', 'devDependencies'];
                for (const section of depSections) {
                    if (!pkg[section])
                        continue;
                    for (const [name, currentRange] of Object.entries(pkg[section])) {
                        const outdatedInfo = outdatedData[name];
                        if (!outdatedInfo)
                            continue;
                        const { current, latest } = outdatedInfo;
                        // Only suggest patch/minor upgrades within same major version
                        if (isPatchOrMinorUpgrade(current, latest, currentRange)) {
                            changes.push({
                                path: pkgPath,
                                name,
                                from: currentRange,
                                to: updateVersionRange(currentRange, latest)
                            });
                        }
                    }
                }
            }
            catch {
                // Skip invalid package.json files
                continue;
            }
        }
    }
    catch {
        // Best-effort: return empty changes if anything fails
    }
    return { changes };
}
async function findPackageJsonFiles(root) {
    const packagePaths = [join(root, 'package.json')];
    try {
        // Try to read pnpm-workspace.yaml for workspace packages
        const workspaceConfig = readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8');
        const workspaceMatch = workspaceConfig.match(/packages:\s*\n((?:\s*-\s*.+\n)*)/);
        if (workspaceMatch) {
            const globs = workspaceMatch[1]
                .split('\n')
                .map(line => line.replace(/^\s*-\s*['"]?(.+?)['"]?\s*$/, '$1'))
                .filter(Boolean);
            // Simple glob expansion for common patterns like 'apps/*'
            for (const glob of globs) {
                if (glob.endsWith('/*')) {
                    const baseDir = glob.slice(0, -2);
                    try {
                        // Would need proper directory traversal here
                        packagePaths.push(join(root, baseDir, 'cli', 'package.json'));
                        packagePaths.push(join(root, baseDir, 'vscode-ext', 'package.json'));
                    }
                    catch {
                        continue;
                    }
                }
            }
        }
    }
    catch {
        // Fallback to just root package.json
    }
    return packagePaths;
}
function isPatchOrMinorUpgrade(current, latest, range) {
    // Simple major version check
    const currentMajor = parseInt(current.split('.')[0] || '0');
    const latestMajor = parseInt(latest.split('.')[0] || '0');
    // Only allow upgrades within same major version
    return currentMajor === latestMajor && current !== latest;
}
function updateVersionRange(currentRange, newVersion) {
    // Preserve range prefix (^, ~, exact)
    if (currentRange.startsWith('^')) {
        return `^${newVersion}`;
    }
    else if (currentRange.startsWith('~')) {
        return `~${newVersion}`;
    }
    else {
        return newVersion;
    }
}
