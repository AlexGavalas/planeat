import { type Database } from './supabase';

export type Connection = Database['public']['Tables']['connections']['Row'];

export type EditedConnection =
    Database['public']['Tables']['connections']['Insert'];

export type ConnectionsMap = Record<string, Connection | EditedConnection>;
