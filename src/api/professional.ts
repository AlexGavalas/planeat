import { and, count, desc, eq, ilike, ne, or, sql } from 'drizzle-orm';
import 'server-only';

import {
    MAX_PROFESSIONAL_CLIENTS,
    PROFESSIONAL_CLIENTS_PAGE_SIZE,
} from '~constants/professional';
import { getDb } from '~db';
import { professionalClients, userRoles, users } from '~db/schema';
import type {
    PaginatedProfessionalClients,
    ProfessionalClientSummary,
    ProfessionalInvitation,
    ProfessionalSummary,
} from '~types/professional';

export type ProfessionalErrorCode =
    | 'active_clients'
    | 'already_managed'
    | 'capacity_reached'
    | 'forbidden'
    | 'invalid_relationship'
    | 'not_professional';

export class ProfessionalError extends Error {
    constructor(readonly code: ProfessionalErrorCode) {
        super(code);
        this.name = 'ProfessionalError';
    }
}

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
        .select({
            email: users.email,
            fullName: users.full_name,
            id: users.id,
        })
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

export const inviteProfessional = async ({
    clientUserId,
    professionalUserId,
}: {
    clientUserId: number;
    professionalUserId: number;
}): Promise<void> => {
    if (clientUserId === professionalUserId) {
        throw new ProfessionalError('invalid_relationship');
    }

    const db = getDb();
    const [professional] = await db
        .select({ id: users.id })
        .from(userRoles)
        .innerJoin(users, eq(users.id, userRoles.user_id))
        .where(
            and(
                eq(userRoles.user_id, professionalUserId),
                eq(userRoles.role, 'professional'),
                eq(userRoles.is_discoverable, true),
            ),
        )
        .limit(1);

    if (!professional) {
        throw new ProfessionalError('not_professional');
    }

    const [activeRelationship] = await db
        .select({ id: professionalClients.id })
        .from(professionalClients)
        .where(
            and(
                eq(professionalClients.client_user_id, clientUserId),
                eq(professionalClients.status, 'active'),
            ),
        )
        .limit(1);

    if (activeRelationship) {
        throw new ProfessionalError('already_managed');
    }

    await db
        .insert(professionalClients)
        .values({
            client_user_id: clientUserId,
            professional_user_id: professionalUserId,
        })
        .onConflictDoNothing();
};

export const acceptProfessionalInvitation = async ({
    professionalUserId,
    relationshipId,
}: {
    professionalUserId: number;
    relationshipId: string;
}): Promise<void> => {
    await getDb().transaction(async (tx) => {
        await tx.execute(
            sql`SELECT pg_advisory_xact_lock(${professionalUserId})`,
        );

        const [role] = await tx
            .select({ userId: userRoles.user_id })
            .from(userRoles)
            .where(
                and(
                    eq(userRoles.user_id, professionalUserId),
                    eq(userRoles.role, 'professional'),
                ),
            )
            .limit(1);

        if (!role) {
            throw new ProfessionalError('not_professional');
        }

        const [invitation] = await tx
            .select({ clientUserId: professionalClients.client_user_id })
            .from(professionalClients)
            .where(
                and(
                    eq(professionalClients.id, relationshipId),
                    eq(
                        professionalClients.professional_user_id,
                        professionalUserId,
                    ),
                    eq(professionalClients.status, 'pending'),
                ),
            )
            .limit(1);

        if (!invitation) {
            throw new ProfessionalError('invalid_relationship');
        }

        const [{ value: activeClientCount } = { value: 0 }] = await tx
            .select({ value: count() })
            .from(professionalClients)
            .where(
                and(
                    eq(
                        professionalClients.professional_user_id,
                        professionalUserId,
                    ),
                    eq(professionalClients.status, 'active'),
                ),
            );

        if (activeClientCount >= MAX_PROFESSIONAL_CLIENTS) {
            throw new ProfessionalError('capacity_reached');
        }

        const [clientRelationship] = await tx
            .select({ id: professionalClients.id })
            .from(professionalClients)
            .where(
                and(
                    eq(
                        professionalClients.client_user_id,
                        invitation.clientUserId,
                    ),
                    eq(professionalClients.status, 'active'),
                ),
            )
            .limit(1);

        if (clientRelationship) {
            throw new ProfessionalError('already_managed');
        }

        await tx
            .update(professionalClients)
            .set({ accepted_at: new Date().toISOString(), status: 'active' })
            .where(eq(professionalClients.id, relationshipId));

        await tx
            .delete(professionalClients)
            .where(
                and(
                    eq(
                        professionalClients.client_user_id,
                        invitation.clientUserId,
                    ),
                    eq(professionalClients.status, 'pending'),
                    ne(professionalClients.id, relationshipId),
                ),
            );
    });
};

export const removeProfessionalRelationship = async ({
    relationshipId,
    userId,
}: {
    relationshipId: string;
    userId: number;
}): Promise<void> => {
    const [removed] = await getDb()
        .delete(professionalClients)
        .where(
            and(
                eq(professionalClients.id, relationshipId),
                or(
                    eq(professionalClients.client_user_id, userId),
                    eq(professionalClients.professional_user_id, userId),
                ),
            ),
        )
        .returning({ id: professionalClients.id });

    if (!removed) {
        throw new ProfessionalError('invalid_relationship');
    }
};

export const fetchProfessionalConnectionState = async (
    userId: number,
): Promise<{
    currentProfessional: ProfessionalClientSummary | null;
    incomingInvitations: ProfessionalInvitation[];
    outgoingInvitations: ProfessionalInvitation[];
}> => {
    const db = getDb();
    const [current, incoming, outgoing] = await Promise.all([
        db
            .select({
                email: users.email,
                fullName: users.full_name,
                id: users.id,
                relationshipId: professionalClients.id,
            })
            .from(professionalClients)
            .innerJoin(
                users,
                eq(users.id, professionalClients.professional_user_id),
            )
            .where(
                and(
                    eq(professionalClients.client_user_id, userId),
                    eq(professionalClients.status, 'active'),
                ),
            )
            .limit(1),
        db
            .select({
                createdAt: professionalClients.created_at,
                email: users.email,
                fullName: users.full_name,
                id: users.id,
                relationshipId: professionalClients.id,
            })
            .from(professionalClients)
            .innerJoin(users, eq(users.id, professionalClients.client_user_id))
            .where(
                and(
                    eq(professionalClients.professional_user_id, userId),
                    eq(professionalClients.status, 'pending'),
                ),
            )
            .orderBy(desc(professionalClients.created_at)),
        db
            .select({
                createdAt: professionalClients.created_at,
                email: users.email,
                fullName: users.full_name,
                id: users.id,
                relationshipId: professionalClients.id,
            })
            .from(professionalClients)
            .innerJoin(
                users,
                eq(users.id, professionalClients.professional_user_id),
            )
            .where(
                and(
                    eq(professionalClients.client_user_id, userId),
                    eq(professionalClients.status, 'pending'),
                ),
            )
            .orderBy(desc(professionalClients.created_at)),
    ]);

    return {
        currentProfessional: current[0] ?? null,
        incomingInvitations: incoming,
        outgoingInvitations: outgoing,
    };
};

export const fetchProfessionalClients = async ({
    page,
    professionalUserId,
    query,
}: {
    page: number;
    professionalUserId: number;
    query: string;
}): Promise<PaginatedProfessionalClients> => {
    await requireProfessional(professionalUserId);

    const normalizedPage = Math.max(1, page);
    const search = query.trim();
    const where = and(
        eq(professionalClients.professional_user_id, professionalUserId),
        eq(professionalClients.status, 'active'),
        search
            ? or(
                  ilike(users.full_name, `%${search}%`),
                  ilike(users.email, `%${search}%`),
              )
            : undefined,
    );
    const db = getDb();
    const [{ value: total } = { value: 0 }] = await db
        .select({ value: count() })
        .from(professionalClients)
        .innerJoin(users, eq(users.id, professionalClients.client_user_id))
        .where(where);

    const pageCount = Math.max(
        1,
        Math.ceil(total / PROFESSIONAL_CLIENTS_PAGE_SIZE),
    );
    const currentPage = Math.min(normalizedPage, pageCount);
    const clients = await db
        .select({
            email: users.email,
            fullName: users.full_name,
            id: users.id,
            relationshipId: professionalClients.id,
        })
        .from(professionalClients)
        .innerJoin(users, eq(users.id, professionalClients.client_user_id))
        .where(where)
        .orderBy(users.full_name, users.id)
        .limit(PROFESSIONAL_CLIENTS_PAGE_SIZE)
        .offset((currentPage - 1) * PROFESSIONAL_CLIENTS_PAGE_SIZE);

    return {
        clients,
        page: currentPage,
        pageCount,
        total,
    };
};

export const fetchProfessionalClient = async ({
    clientUserId,
    professionalUserId,
}: {
    clientUserId: number;
    professionalUserId: number;
}): Promise<ProfessionalClientSummary | null> =>
    (
        await getDb()
            .select({
                email: users.email,
                fullName: users.full_name,
                id: users.id,
                relationshipId: professionalClients.id,
            })
            .from(professionalClients)
            .innerJoin(users, eq(users.id, professionalClients.client_user_id))
            .where(
                and(
                    eq(
                        professionalClients.professional_user_id,
                        professionalUserId,
                    ),
                    eq(professionalClients.client_user_id, clientUserId),
                    eq(professionalClients.status, 'active'),
                ),
            )
            .limit(1)
    )[0] ?? null;

export const canAccessMealPlan = async ({
    actorUserId,
    ownerUserId,
}: {
    actorUserId: number;
    ownerUserId: number;
}): Promise<boolean> => {
    if (actorUserId === ownerUserId) {
        return true;
    }

    return Boolean(
        (
            await getDb()
                .select({ id: professionalClients.id })
                .from(professionalClients)
                .innerJoin(
                    userRoles,
                    and(
                        eq(userRoles.user_id, actorUserId),
                        eq(userRoles.role, 'professional'),
                    ),
                )
                .where(
                    and(
                        eq(
                            professionalClients.professional_user_id,
                            actorUserId,
                        ),
                        eq(professionalClients.client_user_id, ownerUserId),
                        eq(professionalClients.status, 'active'),
                    ),
                )
                .limit(1)
        )[0],
    );
};

export const requireMealPlanAccess = async ({
    actorUserId,
    ownerUserId,
}: {
    actorUserId: number;
    ownerUserId: number;
}): Promise<void> => {
    if (!(await canAccessMealPlan({ actorUserId, ownerUserId }))) {
        throw new ProfessionalError('forbidden');
    }
};
