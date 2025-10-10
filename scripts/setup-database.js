import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase configuration
const supabaseUrl = 'https://xmhopsdfmadqltufbmeq.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaG9wc2RmbWFkcWx0dWZibWVxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTc2OTEwMSwiZXhwIjoyMDc1MzQ1MTAxfQ.SmMngfIha6bIWxTSI-4fRE1DnWC7c_OrH3OX7jrIb1c';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up FaithFlow database...');
    console.log('📋 Please run the SQL schema manually in your Supabase dashboard:');
    console.log('🔗 Go to: https://supabase.com/dashboard/project/xmhopsdfmadqltufbmeq/sql');
    console.log('📄 Copy and paste the contents of database/schema.sql');
    console.log('');
    
    // Read and display the schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📝 SQL Schema to execute:');
    console.log('=' .repeat(80));
    console.log(schema);
    console.log('=' .repeat(80));
    console.log('');
    
    // Create some sample data
    await createSampleData();
    
    console.log('🎉 Database setup instructions provided!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  }
}

async function createSampleData() {
  try {
    console.log('📝 Creating sample data...');
    
    // Create sample users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert([
        {
          id: '00000000-0000-0000-0000-000000000001',
          email: 'admin@faithflow.app',
          username: 'Admin',
          is_facilitator: true,
          reading_plan: '40-days',
          current_streak: 15,
          total_visits: 45
        },
        {
          id: '00000000-0000-0000-0000-000000000002',
          email: 'user@faithflow.app',
          username: 'Faithful User',
          is_facilitator: false,
          reading_plan: '40-days',
          current_streak: 8,
          total_visits: 22
        }
      ])
      .select();
    
    if (usersError) {
      console.log('⚠️ Sample users may already exist:', usersError.message);
    } else {
      console.log('✅ Sample users created');
    }
    
    // Create sample announcements
    const { data: announcements, error: announcementsError } = await supabase
      .from('announcements')
      .insert([
        {
          facilitator_id: '00000000-0000-0000-0000-000000000001',
          title: 'Welcome to FaithFlow!',
          message: 'We are excited to have you join our community. Let\'s grow together in faith!',
          link: 'https://faithflow.app'
        },
        {
          facilitator_id: '00000000-0000-0000-0000-000000000001',
          title: 'Daily Reading Reminder',
          message: 'Don\'t forget to complete your daily Bible reading and journal reflection.',
          link: null
        }
      ])
      .select();
    
    if (announcementsError) {
      console.log('⚠️ Sample announcements may already exist:', announcementsError.message);
    } else {
      console.log('✅ Sample announcements created');
    }
    
    console.log('✅ Sample data created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
  }
}

// Run the setup
setupDatabase();
