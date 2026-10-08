import { and, eq } from 'drizzle-orm';
import 'server-only';

import { getDb } from '~db';
import { professionalClients, userRoles } from '~db/schema';

import { ProfessionalError } from './errors';

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
