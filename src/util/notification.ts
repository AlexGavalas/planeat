import {
    type NotificationData,
    showNotification,
} from '@mantine/notifications';

export const showSuccessNotification = (
    props: Omit<NotificationData, 'color'>,
): void => {
    showNotification({
        ...props,
    });
};

export const showErrorNotification = (
    props: Omit<NotificationData, 'color'>,
): void => {
    showNotification({
        ...props,
        color: 'red',
    });
};
