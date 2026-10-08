import { createCredentialsUser, fetchUser } from '~api/user';
import { registrationSchema } from '~schemas/auth';
import { hashPassword } from '~util/password';

export async function POST(request: Request): Promise<Response> {
    const parsed = registrationSchema.safeParse(
        await request.json().catch(() => null),
    );

    if (!parsed.success) {
        return Response.json(
            { message: 'Invalid registration details' },
            { status: 400 },
        );
    }

    const {
        email,
        fullName,
        password,
        professional: isProfessional,
    } = parsed.data;

    if (await fetchUser({ email })) {
        return Response.json(
            { message: 'An account already exists' },
            { status: 409 },
        );
    }

    const passwordHash = await hashPassword(password);

    try {
        await createCredentialsUser({
            email,
            fullName,
            passwordHash,
            professional: isProfessional,
        });
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
        ) {
            return Response.json(
                { message: 'An account already exists' },
                { status: 409 },
            );
        }

        throw error;
    }

    return Response.json({ message: 'Account created' }, { status: 201 });
}
