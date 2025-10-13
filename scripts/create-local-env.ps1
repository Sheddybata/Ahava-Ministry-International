$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path | Split-Path -Parent
$envPath = Join-Path $projectRoot '.env'

$content = @'
VITE_SUPABASE_URL=https://xmhopsdfmadqltufbmeq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtaG9wc2RmbWFkcWx0dWZibWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjkxMDEsImV4cCI6MjA3NTM0NTEwMX0.2oqmo0rXR5xHNBVE1OaiQfICH1Pp3onmG8zrw0aif2A
VITE_AUTH_REDIRECT_URL=https://ahava-ministry-international.vercel.app/
'@

Set-Content -Path $envPath -Value $content -Encoding UTF8
Write-Host "✅ Wrote .env to: $envPath"

