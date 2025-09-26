const { execSync } = require('child_process');
const fs = require('fs'); const path = require('path');
function sh(cmd){ try{ return execSync(cmd,{stdio:'pipe'}).toString(); } catch(e){ return e.stdout?.toString()||''; } }
fs.mkdirSync('reports/doctor', { recursive: true });
const dirty = sh('git status --porcelain').trim().length>0;
if(dirty) sh('git stash -k -u');
// try eslint fix if present
sh('npx -y eslint . --fix || true');
// add more safe fixes here later (prettier, sort, etc.)
const diff = sh('git diff');
if(diff && diff.trim()){
  fs.writeFileSync(path.join('reports/doctor','patch.diff'), sh('git diff'));
  // revert changes so runner stays advice-only
  sh('git checkout -- .');
}
if(dirty) sh('git stash pop || true');
console.log('doctor-heal: patch.diff', fs.existsSync('reports/doctor/patch.diff')?'created':'absent');
