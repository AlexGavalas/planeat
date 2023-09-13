import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchLatestFatMeasurementProps = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchLatestFatMeasurement = async ({
    supabase,
    userId,
}: FetchLatestFatMeasurementProps) => {
    const result = await supabase
        .from('measurements')
        .select('fat_percentage')
        .eq('user_id', userId)
        .not('fat_percentage', 'is', null)
        .order('date', { ascending: false })
        .limit(1);

    return result;
};

type FetchLatestWeightMeasurementProps = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchLatestWeightMeasurement = async ({
    supabase,
    userId,
}: FetchLatestWeightMeasurementProps) => {
    const result = await supabase
        .from('measurements')
        .select('weight')
        .eq('user_id', userId)
        .not('weight', 'is', null)
        .order('date', { ascending: false })
        .limit(1);

    return result;
};

type FetchMeasurementsProps = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchMeasurements = async ({
    supabase,
    userId,
}: FetchMeasurementsProps) => {
    const result = await supabase
        .from('measurements')
        .select('date, weight')
        .eq('user_id', userId)
        .not('weight', 'is', null)
        .limit(10)
        .order('date', { ascending: true });

    return result;
};

type FetchFatMeasurementsProps = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchFatMeasurements = async ({
    supabase,
    userId,
}: FetchFatMeasurementsProps) => {
    const result = supabase
        .from('measurements')
        .select('date, fat_percentage')
        .eq('user_id', userId)
        .not('fat_percentage', 'is', null)
        .limit(10)
        .order('date', { ascending: true });

    return result;
};
