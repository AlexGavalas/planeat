import { and, count, eq, ilike, ne, or, sql } from 'drizzle-orm';
import 'server-only';

import { getDb } from '~db';
import { professionalClients, userRoles, users } from '~db/schema';
import { type ProfessionalSummary } from '~types/professional';

import { ProfessionalError } from './errors';

export const hasProfessionalRole = async (userId: number): Promise<boolean> =>
    Boolean(
        (
            await getDb()
                .select({ userId: userRoles.user_id })
                .from(userRoles)
                .where(
                    and(
                        eq(userRoles.user_id, userId),
                        eq(userRoles.role, 'professional'),
                    ),
                )
                .limit(1)
        )[0],
    );

export const requireProfessional = async (userId: number): Promise<void> => {
    if (!(await hasProfessionalRole(userId))) {
        throw new ProfessionalError('not_professional');
    }
};

export const setProfessionalRole = async ({
    enabled,
    userId,
}: {
    enabled: boolean;
    userId: number;
}): Promise<void> => {
    const db = getDb();
    if (enabled) {
        await db
            .insert(userRoles)
            .values({ role: 'professional', user_id: userId })
            .onConflictDoNothing();
        return;
    }
    await db.transaction(async (tx) => {
        await tx.execute(sql`SELECT pg_advisory_xact_lock(${userId})`);
        const [{ value: activeClientCount } = { value: 0 }] = await tx
            .select({ value: count() })
            .from(professionalClients)
            .where(
                and(
                    eq(professionalClients.professional_user_id, userId),
                    eq(professionalClients.status, 'active'),
                ),
            );
        if (activeClientCount > 0) {
            throw new ProfessionalError('active_clients');
        }
        await tx
            .delete(professionalClients)
            .where(
                and(
                    eq(professionalClients.professional_user_id, userId),
                    eq(professionalClients.status, 'pending'),
                ),
            );
        await tx
            .delete(userRoles)
            .where(
                and(
                    eq(userRoles.user_id, userId),
                    eq(userRoles.role, 'professional'),
                ),
            );
    });
};

export const setProfessionalDiscoverable = async ({
    discoverable,
    userId,
}: {
    discoverable: boolean;
    userId: number;
}): Promise<void> => {
    const [updated] = await getDb()
        .update(userRoles)
        .set({ is_discoverable: discoverable })
        .where(
            and(
                eq(userRoles.user_id, userId),
                eq(userRoles.role, 'professional'),
            ),
        )
        .returning({ userId: userRoles.user_id });
    if (!updated) {
        throw new ProfessionalError('not_professional');
    }
};

export const findDiscoverableProfessionals = async ({
    query,
    userId,
}: {
    query: string;
    userId: number;
}): Promise<ProfessionalSummary[]> => {
    if (!query.trim()) {
        return [];
    }
    return getDb()
        .select({ email: users.email, fullName: users.full_name, id: users.id })
        .from(userRoles)
        .innerJoin(users, eq(users.id, userRoles.user_id))
        .where(
            and(
                eq(userRoles.role, 'professional'),
                eq(userRoles.is_discoverable, true),
                ne(users.id, userId),
                or(
                    ilike(users.full_name, `%${query.trim()}%`),
                    ilike(users.email, `%${query.trim()}%`),
                ),
            ),
        )
        .orderBy(users.full_name)
        .limit(10);
};
