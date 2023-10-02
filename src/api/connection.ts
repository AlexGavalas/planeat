import {
    type PostgrestError,
    type SupabaseClient,
} from '@supabase/supabase-js';

import { type Connection } from '~types/connection';
import { type Database } from '~types/supabase';

type FetchUserConnections = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
}) => Promise<{
    data: Connection[] | null;
}>;

export const fetchUserConnections: FetchUserConnections = async ({
    supabase,
    userId,
}) => {
    const { data } = await supabase
        .from('connections')
        .select('*, users:connection_user_id(full_name)')
        .eq('user_id', userId);

    return {
        data,
    };
};

type DeleteConnection = (params: {
    supabase: SupabaseClient<Database>;
    connectionId: string;
    userId: number;
    connectionUserId: number;
}) => Promise<{ error: PostgrestError | null }>;

export const deleteConnection: DeleteConnection = async ({
    connectionId,
    connectionUserId,
    supabase,
    userId,
}) => {
    const { error: currentUserError } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId);

    const { error: connectionUserError } = await supabase
        .from('connections')
        .delete()
        .eq('connection_user_id', userId)
        .eq('user_id', connectionUserId);

    return {
        error: currentUserError ?? connectionUserError,
    };
};

type CreateConnection = (params: {
    supabase: SupabaseClient<Database>;
    userId: number;
    connectionUserId: number;
}) => Promise<{ error: PostgrestError | null }>;

export const createConnection: CreateConnection = async ({
    supabase,
    userId,
    connectionUserId,
}) => {
    const { error } = await supabase.from('connections').insert([
        {
            connection_user_id: connectionUserId,
            user_id: userId,
        },
        {
            connection_user_id: userId,
            user_id: connectionUserId,
        },
    ]);

    return {
        error,
    };
};
