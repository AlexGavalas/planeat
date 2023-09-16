import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

const MAX_MEASUREMENTS = 12;

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
    const { count, error } = await supabase
        .from('measurements')
        .select('date, weight', { count: 'exact' })
        .eq('user_id', userId)
        .not('weight', 'is', null);

    if (count === null) {
        throw new Error(
            error?.message || 'Could not count weight measurements',
        );
    }

    const result = await supabase
        .from('measurements')
        .select('date, weight')
        .eq('user_id', userId)
        .not('weight', 'is', null)
        .order('date', { ascending: true })
        .range(count - MAX_MEASUREMENTS, count);

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
    const { count, error } = await supabase
        .from('measurements')
        .select('date, fat_percentage', { count: 'exact' })
        .eq('user_id', userId)
        .not('fat_percentage', 'is', null);

    if (count === null) {
        throw new Error(error?.message || 'Could not count fat measurements');
    }

    const result = await supabase
        .from('measurements')
        .select('date, fat_percentage')
        .eq('user_id', userId)
        .not('fat_percentage', 'is', null)
        .order('date', { ascending: true })
        .range(count - MAX_MEASUREMENTS, count);

    return result;
};
