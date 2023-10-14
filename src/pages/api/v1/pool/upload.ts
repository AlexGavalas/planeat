import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import * as cheerio from 'cheerio';
import { IncomingForm } from 'formidable';
import mammoth from 'mammoth';
import type { NextApiHandler } from 'next';
import invariant from 'tiny-invariant';
import { ZodError } from 'zod';

import { getServerSession } from '~api/session';
import { fetchUser } from '~api/user';
import { assertSession, assertUserEmail } from '~util/session';

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler: NextApiHandler = async (req, res) => {
    try {
        const session = await getServerSession({ req, res });

        assertSession(session);
        assertUserEmail(session.user?.email);

        const supabase = createPagesServerClient({ req, res });

        const user = await fetchUser({ email: session.user.email, supabase });

        invariant(user, 'User must exist');

        if (req.method === 'POST') {
            const form = new IncomingForm({
                maxFileSize: 1024 * 1024 * 10,
            });

            await new Promise<void>((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const fileObject = files.file?.[0];

                    if (!fileObject) {
                        res.status(400).json({ message: 'Bad Request' });
                        resolve();
                        return;
                    }

                    mammoth
                        .convertToHtml({
                            path: fileObject.filepath,
                        })
                        .then((result) => {
                            const $ = cheerio.load(result.value);

                            const meals: string[] = [];

                            $('tr')
                                .not(':first')
                                .each((_, row) => {
                                    $('th', row)
                                        .not(':first')
                                        .each((_, cell) => {
                                            const mealText = $(cell)
                                                .text()
                                                .trim();

                                            if (mealText.length > 10) {
                                                meals.push(mealText);
                                            }
                                        });
                                });

                            res.json({
                                data: [...new Set(meals)],
                            });

                            resolve();
                        })
                        .catch(reject);
                });
            });
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
