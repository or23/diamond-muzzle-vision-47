import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uhhljqgxhdhbbhpohxll.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoaGxqcWd4aGRoYmJocG9oeGxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc0ODY1NTMsImV4cCI6MjA2MzA2MjU1M30._CGnKnTyltp1lIUmmOVI1nC4jRew2WkAU-bSf22HCDE";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);