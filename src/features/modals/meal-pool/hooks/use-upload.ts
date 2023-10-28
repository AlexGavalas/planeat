import { type UseMutationResult, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';

import { showErrorNotification } from '~util/notification';

type UseUploadProps = {
    file: File | null;
};

type UseUploadResponse = {
    data: string[];
};

type UseUpload = (params: {
    onSuccess: (data: UseUploadResponse) => void;
}) => UseMutationResult<UseUploadResponse | undefined, unknown, UseUploadProps>;

export const useUpload: UseUpload = ({ onSuccess }) => {
    const { t } = useTranslation();

    return useMutation({
        mutationFn: async ({ file }) => {
            if (!file) {
                throw new Error(t('errors.no_file'));
            }

            const body = new FormData();
            body.append('file', file);

            const response = await fetch('/api/v1/pool/upload', {
                body,
                method: 'POST',
            });

            if (response.ok) {
                const data = (await response.json()) as { data: string[] };

                onSuccess(data);

                return data;
            } else {
                showErrorNotification({
                    message: t('notification.error.message'),
                    title: t('notification.error.title'),
                });
            }
        },
    });
};
