#!/usr/bin/env node
import {execSync} from'node:child_process';
try{execSync('git reset --hard',{stdio:'inherit'});execSync('git clean -fd',{stdio:'inherit'});console.log('UNDO: workspace reset to HEAD and cleaned.')}catch{process.exit(1)}
