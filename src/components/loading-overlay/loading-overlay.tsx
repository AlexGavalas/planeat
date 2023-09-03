import {
    type LoadingOverlayProps,
    LoadingOverlay as MantineLoadingOverlay,
} from '@mantine/core';

export const LoadingOverlay = (props: LoadingOverlayProps) => {
    return <MantineLoadingOverlay {...props} />;
};
