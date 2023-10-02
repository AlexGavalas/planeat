import {
    type PostgrestError,
    type SupabaseClient,
} from '@supabase/supabase-js';

import { type Measurement } from '~types/measurement';
import { type Database } from '~types/supabase';

const MAX_MEASUREMENTS = 12;

type FetchLatestFatMeasurement = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<{ data: { fat_percentage: number | null }[] | null }>;

export const fetchLatestFatMeasurement: FetchLatestFatMeasurement = async ({
    supabase,
    userId,
}) => {
    const result = await supabase
        .from('measurements')
        .select('fat_percentage')
        .eq('user_id', userId)
        .not('fat_percentage', 'is', null)
        .order('date', { ascending: false })
        .limit(1);

    return result;
};

type FetchLatestWeightMeasurement = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<{ data: { weight: number | null }[] | null }>;

export const fetchLatestWeightMeasurement: FetchLatestWeightMeasurement =
    async ({ supabase, userId }) => {
        const result = await supabase
            .from('measurements')
            .select('weight')
            .eq('user_id', userId)
            .not('weight', 'is', null)
            .order('date', { ascending: false })
            .limit(1);

        return result;
    };

type FetchMeasurements = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<{ data: { date: string; weight: number }[] | null }>;

export const fetchMeasurements: FetchMeasurements = async ({
    supabase,
    userId,
}) => {
    const { count, error } = await supabase
        .from('measurements')
        .select('date, weight', { count: 'exact' })
        .eq('user_id', userId)
        .not('weight', 'is', null);

    if (count === null) {
        throw new Error(
            error?.message ?? 'Could not count weight measurements',
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

type FetchFatMeasurements = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<{
    data:
        | {
              date: string;
              fat_percentage: number | null;
          }[]
        | null;
}>;

export const fetchFatMeasurements: FetchFatMeasurements = async ({
    supabase,
    userId,
}) => {
    const { count, error } = await supabase
        .from('measurements')
        .select('date, fat_percentage', { count: 'exact' })
        .eq('user_id', userId)
        .not('fat_percentage', 'is', null);

    if (count === null) {
        throw new Error(error?.message ?? 'Could not count fat measurements');
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

type FetchMeasurementsCount = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<number | null>;

export const fetchMeasurementsCount: FetchMeasurementsCount = async ({
    supabase,
    userId,
}) => {
    const { count } = await supabase
        .from('measurements')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

    return count;
};

type FetchMeasurementsPaginated = (params: {
    supabase: SupabaseClient<Database>;
    start: number;
    end: number;
    userId: number;
}) => Promise<Measurement[] | null>;

export const fetchMeasurementsPaginated: FetchMeasurementsPaginated = async ({
    supabase,
    start,
    end,
    userId,
}) => {
    const { data } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', userId)
        .range(start, end)
        .order('date', { ascending: false });

    return data;
};

type DeleteMeasurement = (params: {
    supabase: SupabaseClient<Database>;
    measurementId: string;
    userId: number;
}) => Promise<{ error: PostgrestError | null }>;

export const deleteMeasurement: DeleteMeasurement = async ({
    supabase,
    measurementId,
    userId,
}) => {
    const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', measurementId)
        .eq('user_id', userId);

    return {
        error,
    };
};

type UpdateMeasurement = (params: {
    supabase: SupabaseClient<Database>;
    date: string;
    fatPercent: number;
    weight: number;
    userId: number;
    measurementId?: string;
}) => Promise<{ error: PostgrestError | null }>;

export const updateMeasurement: UpdateMeasurement = async ({
    date,
    fatPercent,
    supabase,
    measurementId,
    weight,
    userId,
}) => {
    const { error } = await supabase
        .from('measurements')
        .upsert({
            date,
            fat_percentage: fatPercent,
            id: measurementId,
            user_id: userId,
            weight,
        })
        .eq('user_id', userId);

    return {
        error,
    };
};
