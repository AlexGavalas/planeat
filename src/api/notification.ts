import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchNotification = {
    supabase: SupabaseClient<Database>;
    requestUserId: number;
    targetUserId: number;
};

export const fetchNotification = async ({
    supabase,
    requestUserId,
    targetUserId,
}: FetchNotification) => {
    const { data } = await supabase
        .from('notifications')
        .select('id')
        .eq('request_user_id', requestUserId)
        .eq('target_user_id', targetUserId)
        .maybeSingle();

    return data;
};

type CreateNotification = {
    supabase: SupabaseClient<Database>;
    requestUserId: number;
    targetUserId: number;
};

export const createConnectionRequestNotification = async ({
    requestUserId,
    supabase,
    targetUserId,
}: CreateNotification) => {
    const { error } = await supabase.from('notifications').insert({
        date: new Date().toISOString(),
        notification_type: 'connection_request',
        request_user_id: requestUserId,
        target_user_id: targetUserId,
    });

    return { error };
};

type FetchConnectionRequestNotifications = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchConnectionRequestNotifications = async ({
    supabase,
    userId,
}: FetchConnectionRequestNotifications) => {
    const { data } = await supabase
        .from('notifications')
        .select('*, users:request_user_id(full_name)')
        .eq('notification_type', 'connection_request')
        .eq('target_user_id', userId);

    return { data };
};

type DeleteConnectionRequestNotification = {
    supabase: SupabaseClient<Database>;
    id: string;
    userId: number;
};

export const deleteConnectionRequestNotification = async ({
    id,
    supabase,
    userId,
}: DeleteConnectionRequestNotification) => {
    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)
        .eq('target_user_id', userId);

    return { error };
};
