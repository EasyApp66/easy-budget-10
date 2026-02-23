import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://cwmxrnnwrrkaculypyav.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3bXhybm53cnJrYWN1bHlweWF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1NDQwMTcsImV4cCI6MjA4NTEyMDAxN30.S5v0apigYBmLPbsUgP5mqJTmjZlXLTU1JJZZ6TsjIEE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
