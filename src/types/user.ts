import { type Database } from './supabase';

export type User = Database['public']['Tables']['users']['Row'];

export type EditedUser = Database['public']['Tables']['users']['Insert'];
