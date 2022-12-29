import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { type Database } from '~types/supabase';

interface MutationProps {
    isNutritionist?: boolean;
    height?: number;
}

export const useProfile = () => {
    const queryClient = useQueryClient();
    const supabaseClient = useSupabaseClient<Database>();

    const user = useUser();

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

    return {
        profile,
        isFetching,
        updateProfile,
        user,
    };
};
