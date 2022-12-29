export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[];

export interface Database {
    public: {
        Tables: {
            meals: {
                Row: {
                    id: string;
                    meal: string;
                    user_id: string;
                    section_key: string;
                    day: string;
                };
                Insert: {
                    id?: string;
                    meal: string;
                    user_id: string;
                    section_key: string;
                    day: string;
                };
                Update: {
                    id?: string;
                    meal?: string;
                    user_id?: string;
                    section_key?: string;
                    day?: string;
                };
            };
            measurements: {
                Row: {
                    id: string;
                    user_id: string;
                    date: string;
                    weight: number;
                    fat_percentage: number | null;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    date: string;
                    weight: number;
                    fat_percentage?: number | null;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    date?: string;
                    weight?: number;
                    fat_percentage?: number | null;
                };
            };
            users: {
                Row: {
                    id: string;
                    created_at: string;
                    is_nutritionist: boolean;
                    full_name: string;
                    language: string;
                    height: number | null;
                };
                Insert: {
                    id: string;
                    created_at?: string;
                    is_nutritionist?: boolean;
                    full_name: string;
                    language?: string;
                    height?: number | null;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    is_nutritionist?: boolean;
                    full_name?: string;
                    language?: string;
                    height?: number | null;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}
