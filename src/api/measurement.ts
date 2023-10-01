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

type FetchMeasurementsCount = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchMeasurementsCount = async ({
    supabase,
    userId,
}: FetchMeasurementsCount) => {
    const { count } = await supabase
        .from('measurements')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

    return count;
};

type FetchMeasurementsPaginated = {
    supabase: SupabaseClient<Database>;
    start: number;
    end: number;
    userId: number;
};

export const fetchMeasurementsPaginated = async ({
    supabase,
    start,
    end,
    userId,
}: FetchMeasurementsPaginated) => {
    const { data } = await supabase
        .from('measurements')
        .select('*')
        .eq('user_id', userId)
        .range(start, end)
        .order('date', { ascending: false });

    return data;
};

type DeleteMeasurement = {
    supabase: SupabaseClient<Database>;
    measurementId: string;
    userId: number;
};

export const deleteMeasurement = async ({
    supabase,
    measurementId,
    userId,
}: DeleteMeasurement) => {
    const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', measurementId)
        .eq('user_id', userId);

    return {
        error,
    };
};

type UpdateMeasurement = {
    supabase: SupabaseClient<Database>;
    date: string;
    fatPercent: number;
    weight: number;
    userId: number;
    measurementId?: string;
};

export const updateMeasurement = async ({
    date,
    fatPercent,
    supabase,
    measurementId,
    weight,
    userId,
}: UpdateMeasurement) => {
    const { error } = await supabase
        .from('measurements')
        .upsert({
            id: measurementId,
            user_id: userId,
            date,
            weight,
            fat_percentage: fatPercent,
        })
        .eq('user_id', userId);

    return {
        error,
    };
};
