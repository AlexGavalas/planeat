import {
    deleteProfile,
    fetchUserById,
    findUsersByName,
    updateProfile,
} from '~api/user';
import { patchRequestSchema } from '~schemas/user';
import { withUser } from '~util/session';

export const GET = withUser(async ({ request, user }) => {
    const query: Partial<Record<string, string>> = Object.fromEntries(
        request.nextUrl.searchParams,
    );

    if (query.type === 'search') {
        const { data } = await findUsersByName({
            fullName: String(query.fullName),
            userId: user.id,
        });

        return Response.json({
            data: data.map(({ full_name, id }) => ({
                label: full_name,
                value: String(id),
            })),
        });
    } else if (query.type === 'profile') {
        const { data } = await fetchUserById({
            id: Number(query.id),
        });

        return Response.json({ data });
    }

    return Response.json({ data: user });
});

export const PATCH = withUser(async ({ request, user }) => {
    const {
        height,
        isDiscoverable,
        language,
        targetWeight,
        hasCompletedOnboarding,
        foodPreferencesNegative,
        foodPreferencesPositive,
    } = patchRequestSchema.parse(await request.json());

    await updateProfile({
        foodPreferencesNegative,
        foodPreferencesPositive,
        hasCompletedOnboarding,
        height,
        isDiscoverable,
        language,
        targetWeight,
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});

export const DELETE = withUser(async ({ user }) => {
    await deleteProfile({
        userId: user.id,
    });

    return Response.json({ message: 'OK' }, { status: 200 });
});
