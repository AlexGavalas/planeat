import { useModals } from '@mantine/modals';
import { useTranslation } from 'next-i18next';
import {
    type UseMutationResult,
    useMutation,
    useQueryClient,
} from 'react-query';

import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

type CreateMealPoolProps = {
    content: string;
};

export const useCreateMealPool = (): UseMutationResult<
    unknown,
    unknown,
    CreateMealPoolProps
> => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { closeAll } = useModals();

    return useMutation(async ({ content }) => {
        if (!content) {
            throw new Error(t('errors.preview_empty'));
        }

        const response = await fetch('/api/v1/pool/meal', {
            body: JSON.stringify({ content }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (response.ok) {
            closeAll();

            await queryClient.invalidateQueries(['pool-meal']);

            showSuccessNotification({
                message: t('notification.success.message'),
                title: t('notification.success.title'),
            });
        } else {
            showErrorNotification({
                message: t('notification.error.message'),
                title: t('notification.error.title'),
            });
        }
    });
};
