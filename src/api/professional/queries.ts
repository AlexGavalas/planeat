import { and, count, desc, eq, ilike, or } from 'drizzle-orm';
import 'server-only';

import { PROFESSIONAL_CLIENTS_PAGE_SIZE } from '~constants/professional';
import { getDb } from '~db';
import { professionalClients, users } from '~db/schema';
import type {
    PaginatedProfessionalClients,
    ProfessionalClientSummary,
    ProfessionalInvitation,
} from '~types/professional';

import { requireProfessional } from './roles';

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
    return { clients, page: currentPage, pageCount, total };
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
