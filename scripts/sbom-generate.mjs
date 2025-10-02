// CycloneDX SBOM generator script
import { createBom } from '@cyclonedx/cyclonedx-library';
import fs from 'fs';
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));

const bom = createBom({
  name: pkg.name,
  version: pkg.version,
  components: Object.entries(pkg.dependencies || {}).map(([name, version]) => ({
    name,
    version,
    type: 'library',
  })),
});

fs.writeFileSync('sbom.json', JSON.stringify(bom, null, 2));
console.log('SBOM written to sbom.json');
