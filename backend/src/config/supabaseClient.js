import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Service-role client: full DB/storage access, used only in trusted server code.
// Never send this key to the frontend.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { autoRefreshToken: false, persistSession: false },
  }
);

export const RESUME_BUCKET = process.env.SUPABASE_RESUME_BUCKET || 'resumes';
