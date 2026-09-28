import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

import { type User } from '~types/user';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

import { saveProfile } from '../app/actions';
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
    const { isLoading, user } = useUser();

    const { data: profile, isFetching } = useQuery({
        enabled: Boolean(user),
        queryFn: async () => {
            const response = await fetch('/api/v1/user');

            const { data } = (await response.json()) as { data?: User };

            if (!response.ok || !data) {
                throw new Error('Could not fetch user profile');
            }

            return data;
        },
        queryKey: ['user'],
    });

    const { mutate: updateProfile } = useMutation({
        mutationFn: async ({
            isDiscoverable,
            height,
            targetWeight,
            language,
            hasCompletedOnboarding,
        }: MutationProps) => {
            const response = await saveProfile({
                hasCompletedOnboarding,
                height,
                isDiscoverable,
                language,
                targetWeight,
            });
            if (!response.ok) throw new Error('Could not save profile');
        },
        onError: () => {
            showErrorNotification({
                message: t('notification.error.message'),
                title: t('notification.error.title'),
            });
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

    const { mutate: deleteProfile, isPending: isDeleting } = useMutation({
        mutationFn: async () => {
            const response = await fetch('/api/v1/user', {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Could not delete profile');
            }
        },
        onError: () => {
            showErrorNotification({
                message: t('notification.error.message'),
                title: t('notification.error.title'),
            });
        },
        onSuccess: async () => {
            showSuccessNotification({
                message: t('notification.success.message'),
                title: t('notification.success.title'),
            });

            queryClient.clear();

            await signOut();

            router.push('/');
            router.refresh();
        },
    });

    return {
        deleteProfile,
        isDeleting,
        isFetching: isLoading || isFetching,
        profile,
        updateProfile,
        user,
    };
};
