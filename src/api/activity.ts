import {
    type PostgrestError,
    type SupabaseClient,
} from '@supabase/supabase-js';

import { type Activity } from '~types/activity';
import { type Database } from '~types/supabase';

type FetchActivities = (params: {
    startDate: string;
    endDate: string;
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<Activity[]>;

export const fetchActivities: FetchActivities = async ({
    startDate,
    endDate,
    supabase,
    userId,
}) => {
    const result = await supabase
        .from('activities')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .eq('user_id', userId);

    return result.data ?? [];
};

type FetchActivitiesCount = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<number | null>;

export const fetchActivitiesCount: FetchActivitiesCount = async ({
    supabase,
    userId,
}) => {
    const { count } = await supabase
        .from('activities')
        .select('id', { count: 'exact' })
        .eq('user_id', userId);

    return count;
};

type FetchActivitiesPaginated = (params: {
    supabase: SupabaseClient<Database>;
    start: number;
    end: number;
    userId: number;
}) => Promise<Activity[] | null>;

export const fetchActivitiesPaginated: FetchActivitiesPaginated = async ({
    supabase,
    start,
    end,
    userId,
}) => {
    const { data } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .range(start, end)
        .order('date', { ascending: false });

    return data;
};

type DeleteActivity = (params: {
    supabase: SupabaseClient<Database>;
    activityId: string;
    userId: number;
}) => Promise<{ error: PostgrestError | null }>;

export const deleteActivity: DeleteActivity = async ({
    supabase,
    activityId,
    userId,
}) => {
    const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)
        .eq('user_id', userId);

    return { error };
};

type UpdateActivity = (params: {
    supabase: SupabaseClient<Database>;
    date: string;
    activity: string;
    userId: number;
    activityId?: string;
}) => Promise<{ error: PostgrestError | null }>;

export const updateActivity: UpdateActivity = async ({
    activity,
    date,
    supabase,
    activityId,
    userId,
}) => {
    const { error } = await supabase
        .from('activities')
        .upsert({
            activity,
            date,
            id: activityId,
            user_id: userId,
        })
        .eq('user_id', userId);

    return { error };
};
