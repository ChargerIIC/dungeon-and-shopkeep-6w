#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript/JavaScript files
const files = glob.sync('**/*.{ts,tsx,js,jsx}', {
  ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
});

console.log('🔍 Checking for unused imports in', files.length, 'files...\n');

let totalUnusedImports = 0;
const reports = [];

files.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');
    
    // Find import lines
    const importLines = lines.filter((line, index) => {
      return line.trim().startsWith('import ') && 
             !line.includes('import type') && 
             !line.includes('import {') || 
             (line.includes('import {') && !line.includes('}'));
    });
    
    const unusedImports = [];
    
    importLines.forEach((importLine, lineIndex) => {
      // Extract imported names
      if (importLine.includes('import {')) {
        const match = importLine.match(/import\s*\{\s*([^}]+)\s*\}/);
        if (match) {
          const importedNames = match[1]
            .split(',')
            .map(name => name.trim())
            .map(name => name.split(' as ')[0].trim()) // Handle 'as' aliases
            .filter(name => name);
          
          importedNames.forEach(importName => {
            // Skip type imports
            if (importName.startsWith('type ')) return;
            
            // Check if the import is used in the file
            const isUsed = content.includes(`${importName}(`) ||
                          content.includes(`${importName}.`) ||
                          content.includes(`<${importName}`) ||
                          content.includes(`${importName} `) ||
                          content.includes(`{${importName}}`) ||
                          content.includes(`[${importName}]`) ||
                          content.includes(`= ${importName}`) ||
                          content.includes(`(${importName})`) ||
                          content.includes(`typeof ${importName}`) ||
                          content.includes(`extends ${importName}`) ||
                          content.includes(`: ${importName}`) ||
                          // Check for JSX usage
                          new RegExp(`<${importName}[\\s>]`).test(content) ||
                          // Check for object destructuring
                          new RegExp(`\\b${importName}\\b`).test(content.replace(importLine, ''));
            
            if (!isUsed) {
              unusedImports.push({
                name: importName,
                line: lineIndex + 1,
                importLine
              });
            }
          });
        }
      }
      // Handle default imports
      else if (importLine.match(/^import\s+\w+\s+from/)) {
        const match = importLine.match(/^import\s+(\w+)\s+from/);
        if (match) {
          const importName = match[1];
          const isUsed = content.includes(`${importName}(`) ||
                        content.includes(`${importName}.`) ||
                        content.includes(`<${importName}`) ||
                        content.includes(`= ${importName}`) ||
                        new RegExp(`\\b${importName}\\b`).test(content.replace(importLine, ''));
          
          if (!isUsed) {
            unusedImports.push({
              name: importName,
              line: lineIndex + 1,
              importLine
            });
          }
        }
      }
    });
    
    if (unusedImports.length > 0) {
      reports.push({
        file,
        unusedImports
      });
      totalUnusedImports += unusedImports.length;
    }
    
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

// Print results
if (reports.length === 0) {
  console.log('✅ No unused imports found!');
} else {
  console.log(`❌ Found ${totalUnusedImports} unused imports in ${reports.length} files:\n`);
  
  reports.forEach(({ file, unusedImports }) => {
    console.log(`📁 ${file}`);
    unusedImports.forEach(({ name, line, importLine }) => {
      console.log(`   Line ${line}: unused import '${name}'`);
      console.log(`   ${importLine.trim()}`);
    });
    console.log('');
  });
  
  console.log(`\n📊 Summary: ${totalUnusedImports} unused imports in ${reports.length} files`);
}
