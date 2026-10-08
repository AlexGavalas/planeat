import type { InferSelectModel } from 'drizzle-orm';

import type { professionalClients } from '~db/schema';

export type ProfessionalClientRelationship = InferSelectModel<
    typeof professionalClients
>;

export type ProfessionalSummary = {
    email: string;
    fullName: string;
    id: number;
};

export type ProfessionalClientSummary = ProfessionalSummary & {
    relationshipId: string;
};

export type ProfessionalInvitation = ProfessionalSummary & {
    createdAt: string;
    relationshipId: string;
};

export type PaginatedProfessionalClients = {
    clients: ProfessionalClientSummary[];
    page: number;
    pageCount: number;
    total: number;
};
