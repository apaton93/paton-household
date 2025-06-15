

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qwdwcsdgjhuthhrpijoz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

const supabase = supabase.createClient(
  'https://qwdwcsdgjhuthhrpijoz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3ZHdjc2Rnamh1dGhocnBpam96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMjIzNTEsImV4cCI6MjA2NTU5ODM1MX0.oh2bBUPY_YJQkFWPy06JSA_B-sXkg1h5t0DoK1eqnrQ'
);
