import { type Database } from './supabase';

export type MealPool = Database['public']['Tables']['meals_pool']['Row'];

export type EditedMealPool =
    Database['public']['Tables']['meals_pool']['Insert'];
