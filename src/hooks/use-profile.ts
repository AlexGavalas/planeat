import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { type User } from '~types/user';
import { showSuccessNotification } from '~util/notification';

import { useUser } from './use-user';

interface MutationProps {
    isDiscoverable?: boolean;
    height?: number;
    targetWeight?: number;
    language?: string;
    hasCompletedOnboarding?: boolean;
    silent?: boolean;
}

export const useProfile = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const user = useUser();

    const { data: profile, isFetching } = useQuery(
        ['user'],
        async () => {
            const response = await fetch('/api/v1/user');

            const { data } = await response.json();

            return data as User;
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
            hasCompletedOnboarding,
            silent = false,
        }: MutationProps) => {
            const response = await fetch('/api/v1/user', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isDiscoverable,
                    height,
                    targetWeight,
                    language,
                    hasCompletedOnboarding,
                }),
            });

            const { data, error } = await response.json();

            if (error) {
                throw error;
            }

            return { ...data, silent };
        },
        {
            onSuccess: (_, { language, silent }) => {
                if (!silent) {
                    showSuccessNotification({
                        title: t('notification.success.title', {
                            lng: language,
                        }),
                        message: t('notification.success.message', {
                            lng: language,
                        }),
                    });
                }
                queryClient.invalidateQueries(['user']);
            },
        },
    );

    const { mutate: deleteProfile } = useMutation(
        async () => {
            const response = await fetch('/api/v1/user', {
                method: 'DELETE',
            });

            const { data, error } = await response.json();

            if (error) {
                throw error;
            }

            return data;
        },
        {
            onSuccess: async () => {
                showSuccessNotification({
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
