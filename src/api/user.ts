import {
    type PostgrestError,
    type SupabaseClient,
} from '@supabase/supabase-js';

import { type Database } from '~types/supabase';
import { type User } from '~types/user';

type FetchUser = (params: {
    supabase: SupabaseClient<Database>;
    email: string;
}) => Promise<User | null>;

export const fetchUser: FetchUser = async ({ supabase, email }) => {
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    return profile;
};

type UpdateFoodPreferences = (params: {
    supabase: SupabaseClient<Database>;
    email: string;
    positive: string | null;
    negative: string | null;
}) => Promise<{ profile: User | null; error: PostgrestError | null }>;

export const updateFoodPreferences: UpdateFoodPreferences = async ({
    supabase,
    email,
    positive,
    negative,
}) => {
    const { data: profile, error } = await supabase
        .from('users')
        .update({
            food_preferences_negative: negative,
            food_preferences_positive: positive,
        })
        .eq('email', email)
        .single();

    return {
        error,
        profile,
    };
};

type FindUsersByName = (params: {
    supabase: SupabaseClient<Database>;
    fullName: string;
    userId: number;
}) => Promise<{
    data: Pick<User, 'full_name'>[] | null;
}>;

const MAX_QUERY_RESULTS = 5;

export const findUsersByName: FindUsersByName = async ({
    fullName,
    supabase,
    userId,
}) => {
    const { data } = await supabase
        .from('users')
        .select('full_name')
        .ilike('full_name', `%${fullName}%`)
        .eq('is_discoverable', true)
        .neq('id', userId)
        .limit(MAX_QUERY_RESULTS);

    return {
        data,
    };
};

type FetchUserByFullname = (params: {
    supabase: SupabaseClient<Database>;
    fullName: string;
}) => Promise<{ data: Pick<User, 'id' | 'full_name'>[] | null }>;

export const fetchUserByFullname: FetchUserByFullname = async ({
    fullName,
    supabase,
}) => {
    const { data } = await supabase
        .from('users')
        .select('id, full_name')
        .eq('full_name', fullName);

    return {
        data,
    };
};

type UpdateProfile = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
    isDiscoverable?: boolean;
    height?: number | null;
    targetWeight?: number | null;
    language?: string;
    hasCompletedOnboarding?: boolean | null;
}) => Promise<{
    error: PostgrestError | null;
}>;

export const updateProfile: UpdateProfile = async ({
    supabase,
    userId,
    height,
    isDiscoverable,
    language,
    targetWeight,
    hasCompletedOnboarding,
}) => {
    const { error } = await supabase
        .from('users')
        .update({
            has_completed_onboarding:
                typeof hasCompletedOnboarding === 'boolean' &&
                !hasCompletedOnboarding
                    ? true
                    : hasCompletedOnboarding,
            height,
            is_discoverable: isDiscoverable,
            language,
            target_weight: targetWeight,
        })
        .eq('id', userId);

    return {
        error,
    };
};

type DeleteProfile = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<{
    error: PostgrestError | null;
}>;

export const deleteProfile: DeleteProfile = async ({ supabase, userId }) => {
    const { error } = await supabase.from('users').delete().eq('id', userId);

    return {
        error,
    };
};
