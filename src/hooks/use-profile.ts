import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { type Database } from '~types/supabase';

import { useUser } from './use-user';

interface MutationProps {
    isNutritionist?: boolean;
    height?: number;
}

export const useProfile = () => {
    const queryClient = useQueryClient();
    const supabaseClient = useSupabaseClient<Database>();

    const user = useUser();

    const { data: profile, isFetching } = useQuery(
        ['user'],
        async () => {
            if (!user?.email) return;

            const { data } = await supabaseClient
                .from('users')
                .select('*')
                .eq('email', user.email)
                .single();

            return data;
        },
        {
            enabled: !!user,
        },
    );

    const { mutate: updateProfile } = useMutation(
        async ({ isNutritionist, height }: MutationProps) => {
            if (!user?.email) return;

            const { data, error } = await supabaseClient
                .from('users')
                .update({
                    is_nutritionist: isNutritionist,
                    height,
                })
                .eq('email', user.email);

            if (error) throw error;

            return data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['user']);
            },
        },
    );

    return {
        profile,
        isFetching,
        updateProfile,
        user,
    };
};
