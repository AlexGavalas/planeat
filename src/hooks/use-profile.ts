import { showNotification } from '@mantine/notifications';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { fetchUser } from '~api/user';
import { type Database } from '~types/supabase';

import { useUser } from './use-user';

interface MutationProps {
    isDiscoverable?: boolean;
    height?: number;
    targetWeight?: number;
    language?: string;
}

export const useProfile = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const supabase = useSupabaseClient<Database>();
    const { t } = useTranslation();
    const user = useUser();

    const { data: profile, isFetching } = useQuery(
        ['user'],
        async () => {
            if (!user?.email) {
                return;
            }

            return fetchUser({ email: user.email, supabase });
        },
        {
            enabled: Boolean(user?.email),
        },
    );

    const { mutate: updateProfile, isLoading } = useMutation(
        async ({
            isDiscoverable,
            height,
            targetWeight,
            language,
        }: MutationProps) => {
            if (!user?.email) {
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .update({
                    is_discoverable: isDiscoverable,
                    target_weight: targetWeight,
                    height,
                    language,
                })
                .eq('email', user.email);

            if (error) {
                throw error;
            }

            return data;
        },
        {
            onSuccess: (_, { language }) => {
                showNotification({
                    title: t('notification.success.title', { lng: language }),
                    message: t('notification.success.message', {
                        lng: language,
                    }),
                });

                queryClient.invalidateQueries(['user']);
            },
        },
    );

    const { mutate: deleteProfile } = useMutation(
        async () => {
            if (!user?.email) {
                return;
            }

            const { data, error } = await supabase
                .from('users')
                .delete()
                .eq('email', user.email)
                .single();

            if (error) {
                throw error;
            }

            return data;
        },
        {
            onSuccess: async () => {
                showNotification({
                    title: t('notification.success.title'),
                    message: t('notification.success.message'),
                });

                queryClient.clear();

                await signOut();

                router.push('/');
            },
        },
    );

    return {
        profile,
        isFetching,
        updateProfile,
        user,
        deleteProfile,
        isDeleting: isLoading,
    };
};
