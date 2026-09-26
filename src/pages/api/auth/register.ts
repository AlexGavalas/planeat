import { type NextApiHandler } from 'next';

import { createCredentialsUser, fetchUser } from '~api/user';
import { registrationSchema } from '~schemas/auth';
import { hashPassword } from '~util/password';

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== 'POST') {
        res.status(405).json({ message: 'Method Not Allowed' });
        return;
    }

    const parsed = registrationSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ message: 'Invalid registration details' });
        return;
    }

    const { email, fullName, password } = parsed.data;
    const existingUser = await fetchUser({ email });

    if (existingUser) {
        res.status(409).json({ message: 'An account already exists' });
        return;
    }

    const passwordHash = await hashPassword(password);

    try {
        await createCredentialsUser({ email, fullName, passwordHash });
    } catch (error) {
        // A concurrent request may have registered the same email.
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
        ) {
            res.status(409).json({ message: 'An account already exists' });
            return;
        }

        throw error;
    }

    res.status(201).json({ message: 'Account created' });
};

export default handler;
