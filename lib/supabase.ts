import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eaqgeryytaaqneczfzbk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhcWdlcnl5dGFhcW5lY3pmemJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MzEyNTksImV4cCI6MjA3OTIwNzI1OX0.Ddqb_lUAECSAKVlQzbjbb0BHbfCY9rQqQILXKOb6o1g';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get or create user session ID
export const getUserSession = (): string => {
  let sessionId = localStorage.getItem('vibeapp_user_session');
  if (!sessionId) {
    sessionId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('vibeapp_user_session', sessionId);
  }
  return sessionId;
};

