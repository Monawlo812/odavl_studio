import esbuild from 'esbuild';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

esbuild.build({
  entryPoints: [join(__dirname, '../src/extension.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: join(__dirname, '../dist/extension.js'),
  external: ['vscode'],
  sourcemap: 'inline',
  logLevel: 'info',
}).catch(() => process.exit(1));
