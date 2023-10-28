import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { type User } from '~types/user';
import { showSuccessNotification } from '~util/notification';

import { useUser } from './use-user';

type MutationProps = {
    isDiscoverable?: boolean;
    height?: number;
    targetWeight?: number;
    language?: string;
    hasCompletedOnboarding?: boolean;
    silent?: boolean;
};

type UseProfile = () => {
    profile?: User;
    isFetching: boolean;
    updateProfile: (params: MutationProps) => void;
    user: Session['user'];
    deleteProfile: () => void;
    isDeleting: boolean;
};

export const useProfile: UseProfile = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { t } = useTranslation();
    const user = useUser();

    const { data: profile, isFetching } = useQuery({
        queryFn: async () => {
            const response = await fetch('/api/v1/user');

            const { data } = (await response.json()) as { data?: User };

            return data;
        },
        queryKey: ['user'],
    });

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: async ({
            isDiscoverable,
            height,
            targetWeight,
            language,
            hasCompletedOnboarding,
        }: MutationProps) => {
            const response = await fetch('/api/v1/user', {
                body: JSON.stringify({
                    hasCompletedOnboarding,
                    height,
                    isDiscoverable,
                    language,
                    targetWeight,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'PATCH',
            });

            if (!response.ok) {
                // TODO: Handle error
            }
        },
        onSuccess: async (_, { language, silent }) => {
            if (!silent) {
                showSuccessNotification({
                    message: t('notification.success.message', {
                        lng: language,
                    }),
                    title: t('notification.success.title', {
                        lng: language,
                    }),
                });
            }

            await queryClient.invalidateQueries({
                queryKey: ['user'],
            });
        },
    });

    const { mutate: deleteProfile } = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/v1/user', {
                method: 'DELETE',
            });

            if (!response.ok) {
                // TODO: Handle error
            }
        },
        onSuccess: async () => {
            showSuccessNotification({
                message: t('notification.success.message'),
                title: t('notification.success.title'),
            });

            queryClient.clear();

            await signOut();

            await router.push('/');
        },
    });

    return {
        deleteProfile,
        isDeleting: isPending,
        isFetching,
        profile,
        updateProfile,
        user,
    };
};
