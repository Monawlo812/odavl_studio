const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
function sh(c){ try{return execSync(c,{stdio:"pipe"}).toString()}catch(e){return e.stdout?.toString()||''} }
fs.mkdirSync('reports/doctor',{recursive:true});
const dirty = sh('git status --porcelain').trim().length>0;
if(dirty) sh('git stash -k -u');
sh('npx -y eslint . --fix || true');
const diff = sh('git diff');
const patch = path.join('reports','doctor','patch.diff');
if(diff.trim()){ fs.writeFileSync(patch,diff); sh('git checkout -- .'); }
else { fs.writeFileSync(patch,'# no-op patch: no changes\n'); }
fs.writeFileSync(path.join('reports','doctor','README.txt'),'Artifacts by ODAVL Doctor.\n');
if(dirty) sh('git stash pop || true');
console.log('doctor-heal: patch at',patch);
