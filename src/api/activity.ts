import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchActivitiesProps = {
    startDate: string;
    endDate: string;
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchActivities = async ({
    startDate,
    endDate,
    supabase,
    userId,
}: FetchActivitiesProps) => {
    const result = await supabase
        .from('activities')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('user_id', userId);

    return result;
};

type FetchActivitiesCount = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchActivitiesCount = async ({
    supabase,
    userId,
}: FetchActivitiesCount) => {
    const { count } = await supabase
        .from('activities')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

    return count;
};

type FetchActivitiesPaginated = {
    supabase: SupabaseClient<Database>;
    start: number;
    end: number;
    userId: number;
};

export const fetchActivitiesPaginated = async ({
    supabase,
    start,
    end,
    userId,
}: FetchActivitiesPaginated) => {
    const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .range(start, end)
        .order('date', { ascending: false });

    return data;
};

type DeleteActivity = {
    supabase: SupabaseClient<Database>;
    activityId: string;
    userId: number;
};

export const deleteActivity = async ({
    supabase,
    activityId,
    userId,
}: DeleteActivity) => {
    const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)
        .eq('user_id', userId);

    return { error };
};

type UpdateActivity = {
    supabase: SupabaseClient<Database>;
    date: string;
    activity: string;
    userId: number;
    activityId?: string;
};

export const updateActivity = async ({
    activity,
    date,
    supabase,
    activityId,
    userId,
}: UpdateActivity) => {
    const { error } = await supabase
        .from('activities')
        .upsert({
            id: activityId,
            user_id: userId,
            date,
            activity,
        })
        .eq('user_id', userId);

    return { error };
};
