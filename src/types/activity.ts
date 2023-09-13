import { type Database } from './supabase';

export type Activity = Database['public']['Tables']['activities']['Row'];

export type EditedActivity =
    Database['public']['Tables']['activities']['Insert'];

export type ActivitysMap = Record<string, Activity | EditedActivity>;
