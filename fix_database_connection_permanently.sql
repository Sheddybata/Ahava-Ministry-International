-- Comprehensive database connection fix
-- Run this in your Supabase SQL Editor

-- 1. Check current database status
SELECT 'Database connection diagnostic' as status;

-- 2. Verify all tables exist and are accessible
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 3. Check RLS status on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 4. Ensure all tables have proper permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- 5. Create a simple test function to verify connectivity
CREATE OR REPLACE FUNCTION test_connection()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Database connection is working!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant execute permission on test function
GRANT EXECUTE ON FUNCTION test_connection() TO anon;
GRANT EXECUTE ON FUNCTION test_connection() TO authenticated;

-- 7. Test the function
SELECT test_connection() as connection_test;

-- 8. Verify environment variables are accessible
SELECT 
    'Environment check' as status,
    current_database() as database_name,
    current_user as current_user,
    version() as postgres_version;

-- 9. Check if there are any blocking locks
SELECT 
    pid,
    state,
    query_start,
    query
FROM pg_stat_activity 
WHERE state = 'active' 
AND query NOT LIKE '%pg_stat_activity%';

-- 10. Final verification - test basic operations
SELECT 'Testing basic operations...' as status;

-- Test users table
SELECT COUNT(*) as user_count FROM users;

-- Test journal_entries table  
SELECT COUNT(*) as journal_count FROM journal_entries;

-- Test community_posts table
SELECT COUNT(*) as community_count FROM community_posts;

SELECT 'Database connection fix completed successfully!' as final_status;
