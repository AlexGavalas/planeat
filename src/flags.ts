import { vercelAdapter } from '@flags-sdk/vercel';
import type { Adapter } from 'flags';
import { dedupe, flag } from 'flags/next';

import { getCurrentUser } from '~api/session';

type Entities = {
    user?: {
        email: string;
        id: string;
    };
};

const identify = dedupe(async (): Promise<Entities> => {
    const user = await getCurrentUser();

    return {
        user: user
            ? {
                  email: user.email.toLocaleLowerCase('en-US'),
                  id: String(user.id),
              }
            : undefined,
    };
});

const localE2eAdapter: Adapter<boolean, Entities> = {
    decide: () => false,
};

export const foodDatabaseSearch = flag<boolean, Entities>({
    adapter:
        process.env.E2E_MODE === 'local' ? localE2eAdapter : vercelAdapter(),
    defaultValue: process.env.NODE_ENV === 'development',
    description: 'Show BLS and Open Food Facts search in meal modals',
    identify,
    key: 'food-database-search',
    options: [
        { label: 'Hidden', value: false },
        { label: 'Visible', value: true },
    ],
});
