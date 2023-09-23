import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchUserProps = {
    supabase: SupabaseClient<Database>;
    email: string;
};

export const fetchUser = async ({ supabase, email }: FetchUserProps) => {
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    return profile;
};

type UpdateFoodPreferences = {
    supabase: SupabaseClient<Database>;
    email: string;
    positive: string | null;
    negative: string | null;
};

export const updateFoodPreferences = async ({
    supabase,
    email,
    positive,
    negative,
}: UpdateFoodPreferences) => {
    const { data: profile, error } = await supabase
        .from('users')
        .update({
            food_preferences_positive: positive,
            food_preferences_negative: negative,
        })
        .eq('email', email)
        .single();

    return { profile, error };
};

type FindUsersByName = {
    supabase: SupabaseClient<Database>;
    fullName: string;
    userId: number;
};

const MAX_QUERY_RESULTS = 5;

export const findUsersByName = async ({
    fullName,
    supabase,
    userId,
}: FindUsersByName) => {
    const { data } = await supabase
        .from('users')
        .select('full_name')
        .ilike('full_name', `%${fullName}%`)
        .eq('is_discoverable', true)
        .neq('id', userId)
        .limit(MAX_QUERY_RESULTS);

    return { data };
};

type FetchUserByFullname = {
    supabase: SupabaseClient<Database>;
    fullName: string;
};

export const fetchUserByFullname = async ({
    fullName,
    supabase,
}: FetchUserByFullname) => {
    const { data } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('full_name', fullName);

    return { data };
};

type UpdateProfile = {
    supabase: SupabaseClient<Database>;
    userId: number;
    isDiscoverable?: boolean;
    height?: number;
    targetWeight?: number;
    language?: string;
};

export const updateProfile = async ({
    supabase,
    userId,
    height,
    isDiscoverable,
    language,
    targetWeight,
}: UpdateProfile) => {
    const { data, error } = await supabase
        .from('users')
        .update({
            is_discoverable: isDiscoverable,
            target_weight: targetWeight,
            height,
            language,
        })
        .eq('id', userId);

    return { data, error };
};

type DeleteProfile = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const deleteProfile = async ({ supabase, userId }: DeleteProfile) => {
    const { data, error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

    return { data, error };
};
