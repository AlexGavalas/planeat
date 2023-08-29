import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useTranslation } from 'next-i18next';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { fetchUser } from '~api/user';
import { type Database } from '~types/supabase';

import { useUser } from './use-user';

interface MutationProps {
    isNutritionist?: boolean;
    height?: number;
    targetWeight?: number;
}

export const useProfile = () => {
    const queryClient = useQueryClient();
    const supabaseClient = useSupabaseClient<Database>();
    const { t } = useTranslation();
    const user = useUser();

    const { data: profile, isFetching } = useQuery(
        ['user'],
        async () => {
            if (!user?.email) return;

            return fetchUser({ email: user.email, supabase: supabaseClient });
        },
        {
            enabled: !!user,
        },
    );

    const { mutate: updateProfile } = useMutation(
        async ({ isNutritionist, height, targetWeight }: MutationProps) => {
            if (!user?.email) return;

            const { data, error } = await supabaseClient
                .from('users')
                .update({
                    is_nutritionist: isNutritionist,
                    target_weight: targetWeight,
                    height,
                })
                .eq('email', user.email);

            if (error) throw error;

            return data;
        },
        {
            onSuccess: () => {
                showNotification({
                    title: t('notification.success.title'),
                    message: t('notification.success.message'),
                    color: 'green.1',
                });

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
