import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchUserConnections = {
    supabase: SupabaseClient<Database>;
    userId: number;
};

export const fetchUserConnections = async ({
    supabase,
    userId,
}: FetchUserConnections) => {
    const { data } = await supabase
        .from('connections')
        .select('*, users:connection_user_id(full_name)')
        .eq('user_id', userId);

    return { data };
};

type DeleteConnection = {
    supabase: SupabaseClient<Database>;
    connectionId: string;
    userId: number;
    connectionUserId: number;
};

export const deleteConnection = async ({
    connectionId,
    connectionUserId,
    supabase,
    userId,
}: DeleteConnection) => {
    const { error: currentUserError } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId);

    const { error: connectionUserError } = await supabase
        .from('connections')
        .delete()
        .eq('connection_user_id', userId)
        .eq('user_id', connectionUserId);

    return { error: currentUserError || connectionUserError };
};

type CreateConnection = {
    supabase: SupabaseClient<Database>;
    userId: number;
    connectionUserId: number;
};

export const createConnection = async ({
    supabase,
    userId,
    connectionUserId,
}: CreateConnection) => {
    const { error } = await supabase.from('connections').insert([
        {
            user_id: userId,
            connection_user_id: connectionUserId,
        },
        {
            user_id: connectionUserId,
            connection_user_id: userId,
        },
    ]);

    return { error };
};
