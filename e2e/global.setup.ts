import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { resolve } from 'path';
import postgres from 'postgres';

import { userCredentials, users } from '../src/db/schema';
import { hashPassword } from '../src/util/password';
import { E2E_USER } from './support/auth';
import {
    assertE2eDatabaseUrl,
    loadE2eEnvironment,
} from './support/environment';

const globalSetup = async (): Promise<void> => {
    const { databaseUrl, mode } = loadE2eEnvironment();

    if (mode === 'preview') {
        return;
    }

    if (!databaseUrl) {
        throw new Error('Missing local e2e database URL');
    }

    assertE2eDatabaseUrl(databaseUrl);

    const sql = postgres(databaseUrl, { max: 1, prepare: false });
    const db = drizzle(sql);

    try {
        await migrate(db, {
            migrationsFolder: resolve(process.cwd(), 'drizzle'),
        });

        await sql`TRUNCATE TABLE ${sql('users')} RESTART IDENTITY CASCADE`;

        const passwordHash = await hashPassword(E2E_USER.PASSWORD);

        const [user] = await db
            .insert(users)
            .values({
                email: E2E_USER.EMAIL,
                full_name: E2E_USER.FULL_NAME,
                has_completed_onboarding: true,
                height: 180,
                language: 'en',
                target_weight: 75,
            })
            .returning({ id: users.id });

        if (!user) {
            throw new Error('Could not seed the e2e user');
        }

        await db.insert(userCredentials).values({
            password_hash: passwordHash,
            user_id: user.id,
        });
    } finally {
        await sql.end();
    }
};

export default globalSetup;
