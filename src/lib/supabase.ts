import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Employee {
  id: number;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceRecord {
  id: number;
  employee_id: string;
  date: string;
  status: 'Present' | 'Absent';
  created_at?: string;
}
