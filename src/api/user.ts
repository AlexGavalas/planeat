import { and, eq, ilike, ne } from 'drizzle-orm';

import { getDb } from '~db';
import { users } from '~db/schema';
import { type User } from '~types/user';

const MAX_QUERY_RESULTS = 5;

export const fetchUser = async ({
    email,
}: {
    email: string;
}): Promise<User | null> =>
    (
        await getDb()
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1)
    )[0] ?? null;

export const updateFoodPreferences = async ({
    negative,
    positive,
    userId,
}: {
    negative: string | null;
    positive: string | null;
    userId: number;
}) => {
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
}) => ({
    data: await getDb()
        .select({ full_name: users.full_name })
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

export const fetchUserByFullname = async ({
    fullName,
}: {
    fullName: string;
}) => ({
    data: await getDb()
        .select({ id: users.id, full_name: users.full_name })
        .from(users)
        .where(eq(users.full_name, fullName)),
});

export const updateProfile = async ({
    hasCompletedOnboarding,
    height,
    isDiscoverable,
    language,
    targetWeight,
    userId,
}: {
    hasCompletedOnboarding?: boolean | null;
    height?: number | null;
    isDiscoverable?: boolean;
    language?: string;
    targetWeight?: number | null;
    userId: number;
}) => {
    await getDb()
        .update(users)
        .set({
            has_completed_onboarding: hasCompletedOnboarding,
            height,
            is_discoverable: isDiscoverable,
            language,
            target_weight: targetWeight,
        })
        .where(eq(users.id, userId));
    return { error: null };
};

export const deleteProfile = async ({ userId }: { userId: number }) => {
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
}) => {
    await getDb()
        .insert(users)
        .values({ email, full_name: fullName, language })
        .onConflictDoUpdate({
            target: users.email,
            set: { full_name: fullName, language },
        });
};
