import { createClient } from '@supabase/supabase-js';

// Test Supabase connection
const supabaseUrl = 'https://xmhopsdfmadqltufbmeq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaG9wc2RmbWFkcWx0dWZibWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjkxMDEsImV4cCI6MjA3NTM0NTEwMX0.2oqmo0rXR5xHNBVE1OaiQfICH1Pp3onmG8zrw0aif2A';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('⚠️ Database tables not yet created:', error.message);
      console.log('📋 Please run the database schema in Supabase dashboard first');
      return;
    }
    
    console.log('✅ Supabase connection successful!');
    
    // Test authentication
    console.log('🔐 Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️ Auth error:', authError.message);
    } else {
      console.log('✅ Authentication service working!');
    }
    
    // Test real-time connection
    console.log('⚡ Testing real-time connection...');
    const channel = supabase
      .channel('test-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users' },
        (payload) => {
          console.log('✅ Real-time subscription working!', payload);
        }
      )
      .subscribe();
    
    // Clean up after 2 seconds
    setTimeout(() => {
      channel.unsubscribe();
      console.log('✅ Real-time test completed');
    }, 2000);
    
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();

