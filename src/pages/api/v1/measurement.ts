import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import {
    deleteMeasurement,
    fetchMeasurementsCount,
    fetchMeasurementsPaginated,
    updateMeasurement,
} from '~api/measurement';
import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { patchRequestSchema } from '~schemas/measurement';
import { assertSession, assertUserEmail } from '~util/session';

const handler: NextApiHandler = async (req, res) => {
    try {
        const session = await getServerSession({ req, res });

        assertSession(session);
        assertUserEmail(session.user?.email);

        const supabase = createPagesServerClient({ req, res });

        const user = await fetchUser({ email: session.user.email, supabase });

        invariant(user, 'User must exist');

        if (req.method === 'GET') {
            if (req.query.count === 'true') {
                const count = await fetchMeasurementsCount({
                    supabase,
                    userId: user.id,
                });

                res.json({ count });
            } else {
                const end = Number(req.query.end);
                const start = Number(req.query.start);

                const data = await fetchMeasurementsPaginated({
                    end,
                    start,
                    supabase,
                    userId: user.id,
                });

                res.json({ data });
            }
        } else if (req.method === 'DELETE') {
            const { error } = await deleteMeasurement({
                measurementId: String(req.query.id),
                supabase,
                userId: user.id,
            });

            if (error) {
                throw new Error(error.message);
            }

            res.status(200).json({ message: 'OK' });
        } else if (req.method === 'PATCH' || req.method === 'POST') {
            const { date, fatPercent, weight } = patchRequestSchema.parse(
                req.body,
            );

            const { error } = await updateMeasurement({
                date,
                fatPercent,
                measurementId: req.query.id ? String(req.query.id) : undefined,
                supabase,
                userId: user.id,
                weight,
            });

            if (error) {
                throw new Error(error.message);
            }

            res.status(200).json({ message: 'OK' });
        } else {
            res.status(405).json({ message: 'Method Not Allowed' });
        }
    } catch (e) {
        console.error(e);

        if (e instanceof ZodError) {
            res.status(400).json({ message: 'Bad Request' });
        } else {
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

export default handler;
