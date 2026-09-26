import { and, eq, ilike, ne } from 'drizzle-orm';

import { getDb } from '~db';
import { userCredentials, users } from '~db/schema';
import { type User } from '~types/user';

const MAX_QUERY_RESULTS = 5;

type CredentialsUser = {
    email: string;
    fullName: string;
    id: number;
    language: string;
    passwordHash: string;
};

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

export const fetchUserCredentials = async ({
    email,
}: {
    email: string;
}): Promise<CredentialsUser | null> =>
    (
        await getDb()
            .select({
                email: users.email,
                fullName: users.full_name,
                id: users.id,
                language: users.language,
                passwordHash: userCredentials.password_hash,
            })
            .from(users)
            .innerJoin(userCredentials, eq(userCredentials.user_id, users.id))
            .where(eq(users.email, email))
            .limit(1)
    )[0] ?? null;

export const createCredentialsUser = async ({
    email,
    fullName,
    passwordHash,
}: {
    email: string;
    fullName: string;
    passwordHash: string;
}): Promise<{ id: number }> =>
    getDb().transaction(async (transaction) => {
        const [user] = await transaction
            .insert(users)
            .values({ email, full_name: fullName, language: 'en' })
            .returning({ id: users.id });

        if (!user) {
            throw new Error('Could not create user');
        }

        await transaction.insert(userCredentials).values({
            password_hash: passwordHash,
            user_id: user.id,
        });

        return user;
    });

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
}): Promise<{ data: Pick<User, 'full_name'>[] }> => ({
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
}): Promise<{ data: Pick<User, 'full_name' | 'id'>[] }> => ({
    data: await getDb()
        .select({ full_name: users.full_name, id: users.id })
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
}): Promise<{ error: null }> => {
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
