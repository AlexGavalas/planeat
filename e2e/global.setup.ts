import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { resolve } from 'path';
import postgres from 'postgres';

import {
    measurements,
    userCredentials,
    userRoles,
    users,
} from '../src/db/schema';
import { hashPassword } from '../src/util/password';
import {
    E2E_USER,
    PROFESSIONAL_E2E_USER,
    VISUAL_E2E_USER,
} from './support/auth';
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

        const [passwordHash, visualPasswordHash, professionalPasswordHash] =
            await Promise.all([
                hashPassword(E2E_USER.PASSWORD),
                hashPassword(VISUAL_E2E_USER.PASSWORD),
                hashPassword(PROFESSIONAL_E2E_USER.PASSWORD),
            ]);

        const seededUsers = await db
            .insert(users)
            .values(
                [E2E_USER, VISUAL_E2E_USER, PROFESSIONAL_E2E_USER].map(
                    (user) => ({
                        email: user.EMAIL,
                        full_name: user.FULL_NAME,
                        has_completed_onboarding: true,
                        height: 180,
                        is_discoverable: user.EMAIL === E2E_USER.EMAIL,
                        language: 'en',
                        target_weight: 75,
                    }),
                ),
            )
            .returning({ email: users.email, id: users.id });

        if (seededUsers.length !== 3) {
            throw new Error('Could not seed the e2e users');
        }

        await db.insert(userCredentials).values(
            seededUsers.map((user) => ({
                password_hash:
                    user.email === VISUAL_E2E_USER.EMAIL
                        ? visualPasswordHash
                        : user.email === PROFESSIONAL_E2E_USER.EMAIL
                          ? professionalPasswordHash
                          : passwordHash,
                user_id: user.id,
            })),
        );

        const visualUser = seededUsers.find(
            ({ email }) => email === VISUAL_E2E_USER.EMAIL,
        );

        if (!visualUser) {
            throw new Error('Could not find the visual e2e user');
        }

        const clientUser = seededUsers.find(
            ({ email }) => email === E2E_USER.EMAIL,
        );
        const professionalUser = seededUsers.find(
            ({ email }) => email === PROFESSIONAL_E2E_USER.EMAIL,
        );

        if (!clientUser || !professionalUser) {
            throw new Error('Could not find the professional e2e users');
        }

        await db.insert(userRoles).values({
            is_discoverable: true,
            role: 'professional',
            user_id: professionalUser.id,
        });
        await db.insert(measurements).values([
            {
                date: '2026-01-05',
                fat_percentage: 21,
                user_id: visualUser.id,
                weight: 82,
            },
            {
                date: '2026-01-08',
                fat_percentage: 20,
                user_id: visualUser.id,
                weight: 80,
            },
            {
                date: '2026-01-12',
                fat_percentage: 19,
                user_id: visualUser.id,
                weight: 78,
            },
        ]);
    } finally {
        await sql.end();
    }
};

export default globalSetup;
