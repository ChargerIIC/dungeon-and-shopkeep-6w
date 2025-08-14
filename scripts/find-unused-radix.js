#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all Radix packages from package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const radixPackages = Object.keys(packageJson.dependencies || {})
  .filter(pkg => pkg.startsWith('@radix-ui/'));

// Find all usage in TypeScript/JavaScript files
const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**']
});

const usedPackages = new Set();

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  radixPackages.forEach(pkg => {
    if (content.includes(pkg)) {
      usedPackages.add(pkg);
    }
  });
});

console.log('=== RADIX UI PACKAGE ANALYSIS ===\n');
console.log(`Total Radix packages installed: ${radixPackages.length}`);
console.log(`Packages actually used: ${usedPackages.size}`);
console.log(`Potentially unused packages: ${radixPackages.length - usedPackages.size}\n`);

console.log('USED PACKAGES:');
Array.from(usedPackages).sort().forEach(pkg => console.log(`✅ ${pkg}`));

console.log('\nPOTENTIALLY UNUSED PACKAGES:');
radixPackages.filter(pkg => !usedPackages.has(pkg))
  .sort()
  .forEach(pkg => console.log(`❌ ${pkg}`));

console.log('\n=== REMOVAL COMMANDS ===');
const unused = radixPackages.filter(pkg => !usedPackages.has(pkg));
if (unused.length > 0) {
  console.log('\nRun these commands to remove unused packages:');
  console.log(`npm uninstall ${unused.join(' ')}`);
  
  const potentialSavings = unused.length * 25; // Rough estimate
  console.log(`\nEstimated bundle size reduction: ~${potentialSavings}KB`);
}
