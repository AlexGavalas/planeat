import {
    type PostgrestError,
    type SupabaseClient,
} from '@supabase/supabase-js';

import { type Notification } from '~types/notification';
import { type Database } from '~types/supabase';

type FetchNotification = (params: {
    supabase: SupabaseClient<Database>;
    requestUserId: number;
    targetUserId: number;
}) => Promise<{ id: string } | null>;

export const fetchNotification: FetchNotification = async ({
    supabase,
    requestUserId,
    targetUserId,
}) => {
    const { data } = await supabase
        .from('notifications')
        .select('id')
        .eq('request_user_id', requestUserId)
        .eq('target_user_id', targetUserId)
        .maybeSingle();

    return data;
};

type CreateNotification = (params: {
    supabase: SupabaseClient<Database>;
    requestUserId: number;
    targetUserId: number;
}) => Promise<{ error: PostgrestError | null }>;

export const createConnectionRequestNotification: CreateNotification = async ({
    requestUserId,
    supabase,
    targetUserId,
}) => {
    const { error } = await supabase.from('notifications').insert({
        date: new Date().toISOString(),
        notification_type: 'connection_request',
        request_user_id: requestUserId,
        target_user_id: targetUserId,
    });

    return {
        error,
    };
};

type FetchConnectionRequestNotifications = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<{
    data: (Notification & { users: unknown })[] | null;
}>;

export const fetchConnectionRequestNotifications: FetchConnectionRequestNotifications =
    async ({ supabase, userId }) => {
        const { data } = await supabase
            .from('notifications')
            .select('*, users:request_user_id(full_name)')
            .eq('notification_type', 'connection_request')
            .eq('target_user_id', userId);

        return {
            data,
        };
    };

type DeleteConnectionRequestNotification = (params: {
    supabase: SupabaseClient<Database>;
    id: string;
    userId: number;
}) => Promise<{ error: PostgrestError | null }>;

export const deleteConnectionRequestNotification: DeleteConnectionRequestNotification =
    async ({ id, supabase, userId }) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id)
            .eq('target_user_id', userId);

        return {
            error,
        };
    };
