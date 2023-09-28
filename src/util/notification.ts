import {
    type NotificationData,
    showNotification,
} from '@mantine/notifications';

export const showSuccessNotification = (
    props: Omit<NotificationData, 'color'>,
) => {
    showNotification({
        ...props,
    });
};

export const showErrorNotification = (
    props: Omit<NotificationData, 'color'>,
) => {
    showNotification({
        ...props,
        color: 'red',
    });
};
