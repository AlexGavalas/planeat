import { and, eq, ilike, ne } from 'drizzle-orm';
import 'server-only';

import { getDb } from '~db';
import { userRoles, users } from '~db/schema';
import { type User, type UserProfile, type UserRole } from '~types/user';

const MAX_QUERY_RESULTS = 5;

export {
    createCredentialsUser,
    fetchUserCredentials,
} from './user-credentials';

export const fetchUser = async ({
    email,
}: {
    email: string;
}): Promise<UserProfile | null> => {
    const db = getDb();
    const user =
        (
            await db.select().from(users).where(eq(users.email, email)).limit(1)
        )[0] ?? null;

    if (!user) {
        return null;
    }

    const roles = await db
        .select({
            isDiscoverable: userRoles.is_discoverable,
            role: userRoles.role,
        })
        .from(userRoles)
        .where(eq(userRoles.user_id, user.id));

    const professionalRole = roles.find(({ role }) => role === 'professional');

    return {
        ...user,
        professional_is_discoverable: professionalRole?.isDiscoverable ?? false,
        roles: roles.map(({ role }) => role as UserRole),
    };
};

export const updateFoodPreferences = async ({
    negative,
    positive,
    userId,
}: {
    negative: string | null;
    positive: string | null;
    userId: number;
}): Promise<{ error: null }> => {
    await getDb()
        .update(users)
        .set({
            food_preferences_negative: negative,
            food_preferences_positive: positive,
        })
        .where(eq(users.id, userId));

    return { error: null };
};

export const findUsersByName = async ({
    fullName,
    userId,
}: {
    fullName: string;
    userId: number;
}): Promise<{ data: Pick<User, 'full_name' | 'id'>[] }> => ({
    data: await getDb()
        .select({ full_name: users.full_name, id: users.id })
        .from(users)
        .where(
            and(
                ilike(users.full_name, `%${fullName}%`),
                eq(users.is_discoverable, true),
                ne(users.id, userId),
            ),
        )
        .limit(MAX_QUERY_RESULTS),
});

export const fetchUserById = async ({
    id,
}: {
    id: number;
}): Promise<{ data: Pick<User, 'full_name' | 'id'>[] }> => ({
    data: await getDb()
        .select({ full_name: users.full_name, id: users.id })
        .from(users)
        .where(eq(users.id, id))
        .limit(1),
});

export const updateProfile = async ({
    foodPreferencesNegative,
    foodPreferencesPositive,
    hasCompletedOnboarding,
    height,
    isDiscoverable,
    language,
    targetWeight,
    userId,
}: {
    foodPreferencesNegative?: string | null;
    foodPreferencesPositive?: string | null;
    hasCompletedOnboarding?: boolean | null;
    height?: number | null;
    isDiscoverable?: boolean;
    language?: string;
    targetWeight?: number | null;
    userId: number;
}): Promise<{ error: null }> => {
    await getDb()
        .update(users)
        .set({
            food_preferences_negative: foodPreferencesNegative,
            food_preferences_positive: foodPreferencesPositive,
            has_completed_onboarding: hasCompletedOnboarding,
            height,
            is_discoverable: isDiscoverable,
            language,
            target_weight: targetWeight,
        })
        .where(eq(users.id, userId));

    return { error: null };
};

export const deleteProfile = async ({
    userId,
}: {
    userId: number;
}): Promise<{ error: null }> => {
    await getDb().delete(users).where(eq(users.id, userId));

    return { error: null };
};

export const createUser = async ({
    email,
    fullName,
    language,
}: {
    email: string;
    fullName: string;
    language: string;
}): Promise<void> => {
    await getDb()
        .insert(users)
        .values({ email, full_name: fullName, language })
        .onConflictDoUpdate({
            set: { full_name: fullName, language },
            target: users.email,
        });
};
