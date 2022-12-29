import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { type Database } from '~types/supabase';

interface MutationProps {
    isNutritionist?: boolean;
    height?: number;
}

export const useProfile = () => {
    const queryClient = useQueryClient();
    const supabaseClient = useSupabaseClient<Database>();

    const { data: user, isFetching: isFetchingSupabaseUser } = useQuery(
        ['supabase-user'],
        async () => {
            const { data } = await supabaseClient.auth.getSession();

            return data.session?.user;
        },
    );

    const { data: profile, isFetching } = useQuery(['user'], async () => {
        if (!user) return;

        const { data } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        return data;
    });

    const { mutate: updateProfile } = useMutation(
        async ({ isNutritionist, height }: MutationProps) => {
            if (!user) return;

            const { data, error } = await supabaseClient
                .from('users')
                .update({
                    is_nutritionist: isNutritionist,
                    height,
                })
                .eq('id', user.id);

            if (error) throw error;

            return data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['user']);
            },
        },
    );

    const logout = useCallback(async () => {
        await queryClient.invalidateQueries(['supabase-user']);
        await queryClient.invalidateQueries(['user']);
    }, [queryClient]);

    return {
        profile,
        isFetching: isFetchingSupabaseUser || isFetching,
        updateProfile,
        logout,
        user,
    };
};
