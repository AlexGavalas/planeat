import { QueryClient } from '@tanstack/react-query';

// The browser client belongs to one account: Providers is keyed by user ID.
// Server renders always create a new client; private data is never process-cached.
export const createQueryClient = (): QueryClient =>
    new QueryClient({
        defaultOptions: {
            queries: { refetchOnWindowFocus: false, staleTime: 60_000 },
        },
    });
