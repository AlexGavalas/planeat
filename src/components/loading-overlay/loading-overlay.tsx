import {
    type LoadingOverlayProps,
    LoadingOverlay as MantineLoadingOverlay,
} from '@mantine/core';
import type { ReactElement } from 'react';

export const LoadingOverlay = (props: LoadingOverlayProps): ReactElement => {
    return <MantineLoadingOverlay {...props} />;
};
