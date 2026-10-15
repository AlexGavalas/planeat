'use client';

import type { ReactElement } from 'react';

const ErrorPage = ({
    reset: handleReset,
}: Readonly<{ reset: () => void }>): ReactElement => {
    return (
        <div role="alert">
            <p>Something went wrong.</p>
            <button onClick={handleReset} type="button">
                Try again
            </button>
        </div>
    );
};

export default ErrorPage;
