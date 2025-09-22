const fs = require('fs');
const path = require('path');

// Helper functions to reduce complexity
function checkPackageJson(packagePath) {
  if (!fs.existsSync(packagePath)) {
    return { errors: ['package.json not found'], ok: false };
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    return { packageJson, ok: true, errors: [] };
  } catch (error) {
    return { errors: [`Failed to parse package.json: ${error.message}`], ok: false };
  }
}

function validateContainer(packageJson) {
  const checks = {};
  const errors = [];
  
  const viewsContainers = packageJson.contributes?.viewsContainers?.activitybar;
  if (!viewsContainers || !Array.isArray(viewsContainers)) {
    errors.push('Missing contributes.viewsContainers.activitybar');
    return { checks, errors };
  }
  
  const odavlContainer = viewsContainers.find(c => c.id === 'odavlControl');
  if (!odavlContainer) {
    errors.push('ODAVL container not found in activitybar');
  } else {
    checks.containerExists = true;
    if (!odavlContainer.icon) {
      errors.push('ODAVL container missing icon property');
    } else {
      checks.containerHasIcon = true;
    }
  }
  
  return { checks, errors };
}

function validateViews(packageJson) {
  const checks = {};
  const errors = [];
  
  const views = packageJson.contributes?.views?.odavlControl;
  if (!views || !Array.isArray(views)) {
    errors.push('Missing contributes.views.odavlControl');
    return { checks, errors };
  }
  
  const controlView = views.find(v => v.id === 'odavl.control.center');
  if (!controlView) {
    errors.push('Control Center view not found');
  } else {
    checks.controlViewExists = true;
  }
  
  return { checks, errors };
}

function validateCommands(packageJson) {
  const checks = {};
  const errors = [];
  
  const commands = packageJson.contributes?.commands;
  if (!commands || !Array.isArray(commands)) {
    errors.push('Missing contributes.commands');
    return { checks, errors };
  }
  
  const requiredCommands = ['odavl.controlCenter.open', 'odavl.magic.run', 'odavl.debug.showIconStatus'];
  for (const cmdId of requiredCommands) {
    const cmd = commands.find(c => c.command === cmdId);
    if (!cmd) {
      errors.push(`Missing command: ${cmdId}`);
    }
  }
  checks.commandsCount = commands.length;
  
  return { checks, errors };
}

function validateIconFiles() {
  const checks = {};
  const errors = [];
  
  const iconLight = path.join(__dirname, '..', 'media', 'odavl-icon-light.svg');
  const iconDark = path.join(__dirname, '..', 'media', 'odavl-icon-dark.svg');
  
  checks.iconLightExists = fs.existsSync(iconLight);
  checks.iconDarkExists = fs.existsSync(iconDark);
  
  if (!checks.iconLightExists) {
    errors.push('odavl-icon-light.svg not found');
  } else {
    try {
      const lightContent = fs.readFileSync(iconLight, 'utf8');
      checks.iconLightValid = lightContent.includes('<svg') && lightContent.includes('</svg>');
      if (!checks.iconLightValid) {
        errors.push('odavl-icon-light.svg invalid SVG structure');
      }
    } catch (error) {
      errors.push(`Error reading light icon: ${error.message}`);
    }
  }
  
  if (!checks.iconDarkExists) {
    errors.push('odavl-icon-dark.svg not found');
  } else {
    try {
      const darkContent = fs.readFileSync(iconDark, 'utf8');
      checks.iconDarkValid = darkContent.includes('<svg') && darkContent.includes('</svg>');
      if (!checks.iconDarkValid) {
        errors.push('odavl-icon-dark.svg invalid SVG structure');
      }
    } catch (error) {
      errors.push(`Error reading dark icon: ${error.message}`);
    }
  }
  
  return { checks, errors };
}

// Main validation function - simplified
function validateIcon() {
  const results = {
    timestamp: new Date().toISOString(),
    ok: true,
    errors: [],
    warnings: [],
    checks: {}
  };

  try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageResult = checkPackageJson(packagePath);
    
    if (!packageResult.ok) {
      results.errors.push(...packageResult.errors);
      results.ok = false;
      return results;
    }
    
    results.checks.packageParsed = true;
    const { packageJson } = packageResult;
    
    // Validate different sections
    const containerResult = validateContainer(packageJson);
    const viewsResult = validateViews(packageJson);
    const commandsResult = validateCommands(packageJson);
    const iconResult = validateIconFiles();
    
    // Merge results
    Object.assign(results.checks, containerResult.checks, viewsResult.checks, commandsResult.checks, iconResult.checks);
    results.errors.push(...containerResult.errors, ...viewsResult.errors, ...commandsResult.errors, ...iconResult.errors);
    
    // Check activation events
    const activationEvents = packageJson.activationEvents;
    results.checks.activationEventsOk = activationEvents && Array.isArray(activationEvents) && activationEvents.length > 0;
    
    // Check scripts
    const scripts = packageJson.scripts;
    results.checks.validateScriptExists = !!(scripts && scripts['icon:validate']);
    if (!results.checks.validateScriptExists) {
      results.warnings.push('icon:validate script not found in package.json');
    }
    
    results.ok = results.errors.length === 0;
    
  } catch (error) {
    results.errors.push(`Validation error: ${error.message}`);
    results.ok = false;
  }

  return results;
}

// Run validation and output results
function main() {
  const results = validateIcon();
  
  // Write to reports directory
  try {
    const reportsDir = path.join(__dirname, '..', '..', '..', 'reports', 'ux', 'VSCODE-ICON-FORCE');
    fs.mkdirSync(reportsDir, { recursive: true });
    
    const outputPath = path.join(reportsDir, 'validate.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log('✅ Validation results written to:', outputPath);
  } catch (error) {
    console.error('❌ Failed to write validation results:', error.message);
  }

  // Console output
  if (results.ok) {
    console.log('✅ ODAVL Activity Bar icon validation PASSED');
    console.log(`   - Container exists: ${results.checks.containerExists || false}`);
    console.log(`   - Icon files present: ${results.checks.iconLightExists && results.checks.iconDarkExists}`);
    console.log(`   - Commands configured: ${results.checks.commandsCount || 0}`);
  } else {
    console.log('❌ ODAVL Activity Bar icon validation FAILED');
    results.errors.forEach(error => console.log(`   ERROR: ${error}`));
  }

  if (results.warnings.length > 0) {
    results.warnings.forEach(warning => console.log(`   WARNING: ${warning}`));
  }

  // Exit with appropriate code
  process.exit(results.ok ? 0 : 1);
}

if (require.main === module) {
  main();
}

module.exports = { validateIcon };