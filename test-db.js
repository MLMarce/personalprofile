const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://xfbdsregdnzujkkvhcrx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmYmRzcmVnZG56dWpra3ZoY3J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3NzM5ODYsImV4cCI6MjA5MzM0OTk4Nn0.izBW15O9SkwO4bN8pHvVTJj8AAJ7IpfoCFIUJNmX69o');

async function test() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  console.log('Data:', data);
  console.log('Error:', error);
}

test();
