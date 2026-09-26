import { and, eq } from 'drizzle-orm';

import { getDb } from '~db';
import { connections, users } from '~db/schema';
import type { Connection } from '~types/connection';

export const fetchUserConnections = async ({
    userId,
}: {
    userId: number;
}): Promise<{ data: Connection[] }> => ({
    data: await getDb()
        .select({
            connection_user_id: connections.connection_user_id,
            id: connections.id,
            user_id: connections.user_id,
            users: { full_name: users.full_name },
        })
        .from(connections)
        .innerJoin(users, eq(connections.connection_user_id, users.id))
        .where(eq(connections.user_id, userId)),
});

export const deleteConnection = async ({
    connectionId,
    connectionUserId,
    userId,
}: {
    connectionId: string;
    connectionUserId: number;
    userId: number;
}): Promise<{ error: null }> => {
    const db = getDb();
    await db.transaction(async (tx) => {
        await tx
            .delete(connections)
            .where(
                and(
                    eq(connections.id, connectionId),
                    eq(connections.user_id, userId),
                ),
            );
        await tx
            .delete(connections)
            .where(
                and(
                    eq(connections.connection_user_id, userId),
                    eq(connections.user_id, connectionUserId),
                ),
            );
    });
    return { error: null };
};

export const createConnection = async ({
    connectionUserId,
    userId,
}: {
    connectionUserId: number;
    userId: number;
}): Promise<{ error: null }> => {
    await getDb()
        .insert(connections)
        .values([
            { connection_user_id: connectionUserId, user_id: userId },
            { connection_user_id: userId, user_id: connectionUserId },
        ]);
    return { error: null };
};
