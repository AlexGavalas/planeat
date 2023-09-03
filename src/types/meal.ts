import { type Database } from './supabase';

export type Meal = Database['public']['Tables']['meals']['Row'];

export type EditedMeal = Database['public']['Tables']['meals']['Insert'];

export type MealsMap = Record<string, Meal | EditedMeal>;
