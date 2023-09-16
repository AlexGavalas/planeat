import { type Database } from './supabase';

export type Measurement = Database['public']['Tables']['measurements']['Row'];

export type EditedMeasurement =
    Database['public']['Tables']['measurements']['Insert'];

export type MeasurementsMap = Record<string, Measurement | EditedMeasurement>;
