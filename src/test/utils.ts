import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

type RenderParameters = Parameters<typeof render>;

export const renderWithUser = (...renderParams: RenderParameters) => {
    return {
        user: userEvent.setup(),
        ...render(...renderParams),
    };
};
