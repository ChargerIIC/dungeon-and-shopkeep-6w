#!/usr/bin/env node

/**
 * Helper script to extract Firebase configuration for GitHub Actions
 * Run this with: node extract-firebase-config.js
 */

const fs = require('fs');
const path = require('path');

function extractFirebaseConfig() {
  console.log('🔥 Firebase Configuration Extractor for GitHub Actions\n');

  // Try to read from .env.local
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envLocalPath)) {
    console.log('📁 Found .env.local file, extracting configuration...\n');
    
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    const envLines = envContent.split('\n');
    
    const firebaseVars = {};
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ];

    envLines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=');
        
        if (requiredVars.includes(key)) {
          firebaseVars[key] = value.replace(/^["']|["']$/g, ''); // Remove quotes
        }
      }
    });

    console.log('🔧 GitHub Secrets to configure:\n');
    console.log('Go to your GitHub repository → Settings → Secrets and variables → Actions\n');
    console.log('Add these repository secrets:\n');

    requiredVars.forEach(varName => {
      const value = firebaseVars[varName];
      if (value) {
        console.log(`✅ ${varName}`);
        console.log(`   Value: ${value}\n`);
      } else {
        console.log(`❌ ${varName} - NOT FOUND`);
        console.log(`   Please add this variable to your .env.local file\n`);
      }
    });

    // Check for missing variables
    const missingVars = requiredVars.filter(varName => !firebaseVars[varName]);
    
    if (missingVars.length > 0) {
      console.log('⚠️  Missing variables:');
      missingVars.forEach(varName => {
        console.log(`   - ${varName}`);
      });
      console.log('\nPlease add these to your .env.local file and run this script again.\n');
    } else {
      console.log('✅ All required Firebase variables found!\n');
      console.log('📋 Summary for GitHub Actions setup:');
      console.log('1. Add AZURE_CREDENTIALS secret (see GITHUB_ACTIONS_SETUP.md)');
      console.log('2. Add all the Firebase secrets shown above');
      console.log('3. Push to main branch to trigger deployment\n');
    }

  } else {
    console.log('❌ No .env.local file found.');
    console.log('Please create a .env.local file with your Firebase configuration.\n');
    
    console.log('📋 Required variables in .env.local:');
    console.log('NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key');
    console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com');
    console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id');
    console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com');
    console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012');
    console.log('NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456\n');
  }
}

// Run the extraction
extractFirebaseConfig();
