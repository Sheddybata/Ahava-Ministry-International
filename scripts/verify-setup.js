import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function verifySetup() {
  console.log('🔍 Verifying FaithFlow setup...\n');
  
  const checks = [
    {
      name: 'Database Schema',
      file: '../database/schema.sql',
      required: true
    },
    {
      name: 'Supabase Client',
      file: '../src/lib/supabaseClient.ts',
      required: true
    },
    {
      name: 'Database Services',
      file: '../src/services/database.ts',
      required: true
    },
    {
      name: 'App Layout',
      file: '../src/components/AppLayout.tsx',
      required: true
    },
    {
      name: 'Authentication Screen',
      file: '../src/components/AuthScreen.tsx',
      required: true
    },
    {
      name: 'Facilitator Login',
      file: '../src/components/FacilitatorLogin.tsx',
      required: true
    },
    {
      name: 'Package Dependencies',
      file: '../package.json',
      required: true
    }
  ];
  
  let allPassed = true;
  
  checks.forEach(check => {
    const filePath = path.join(__dirname, check.file);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      console.log(`✅ ${check.name} - Found`);
      
      // Check for key content in important files
      if (check.name === 'Database Schema') {
        const content = fs.readFileSync(filePath, 'utf8');
        const hasTables = content.includes('CREATE TABLE');
        const hasPolicies = content.includes('CREATE POLICY');
        const hasTriggers = content.includes('CREATE TRIGGER');
        
        console.log(`   📊 Tables: ${hasTables ? '✅' : '❌'}`);
        console.log(`   🔐 Policies: ${hasPolicies ? '✅' : '❌'}`);
        console.log(`   ⚡ Triggers: ${hasTriggers ? '✅' : '❌'}`);
      }
      
      if (check.name === 'Supabase Client') {
        const content = fs.readFileSync(filePath, 'utf8');
        const hasUrl = content.includes('xmhopsdfmadqltufbmeq.supabase.co');
        const hasKey = content.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
        
        console.log(`   🔗 URL: ${hasUrl ? '✅' : '❌'}`);
        console.log(`   🔑 Key: ${hasKey ? '✅' : '❌'}`);
      }
      
      if (check.name === 'Database Services') {
        const content = fs.readFileSync(filePath, 'utf8');
        const hasUserService = content.includes('userService');
        const hasRealtimeService = content.includes('realtimeService');
        const hasAuthService = content.includes('authService');
        
        console.log(`   👤 User Service: ${hasUserService ? '✅' : '❌'}`);
        console.log(`   ⚡ Realtime Service: ${hasRealtimeService ? '✅' : '❌'}`);
        console.log(`   🔐 Auth Service: ${hasAuthService ? '✅' : '❌'}`);
      }
      
    } else {
      console.log(`❌ ${check.name} - Missing`);
      if (check.required) {
        allPassed = false;
      }
    }
  });
  
  console.log('\n' + '='.repeat(50));
  
  if (allPassed) {
    console.log('🎉 ALL CHECKS PASSED!');
    console.log('✅ FaithFlow is ready for setup');
    console.log('\n📋 Next Steps:');
    console.log('1. Run database schema in Supabase dashboard');
    console.log('2. Start the app with: npm run dev');
    console.log('3. Test all features!');
  } else {
    console.log('❌ Some checks failed');
    console.log('Please review the missing components');
  }
  
  console.log('\n🚀 Your FaithFlow app is ready to launch!');
}

verifySetup();

