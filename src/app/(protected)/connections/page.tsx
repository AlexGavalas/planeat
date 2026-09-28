import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { fetchUserConnections } from '~api/connection';
import { fetchConnectionRequestNotifications } from '~api/notification';
import { requireUser } from '~api/session';
import { Connections } from '~features/screens/connections';
import { createQueryClient } from '~util/query-client';

export default async function Page() {
    const profile = await requireUser();

    const [connections, requests] = await Promise.all([
        fetchUserConnections({ userId: profile.id }),
        fetchConnectionRequestNotifications({ userId: profile.id }),
    ]);

    const client = createQueryClient();

    client.setQueryData(['connections'], connections.data);
    client.setQueryData(['connection-requests', profile.id], requests.data);

    return (
        <HydrationBoundary state={dehydrate(client)}>
            <Connections />
        </HydrationBoundary>
    );
}
