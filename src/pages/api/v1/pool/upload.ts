import * as cheerio from 'cheerio';
import { IncomingForm } from 'formidable';
import mammoth from 'mammoth';

import { type NextApiHandlerWithUser, withUser } from '~util/session';

export const config = {
    api: {
        bodyParser: false,
    },
};

const handler: NextApiHandlerWithUser = async ({ req, res }) => {
    if (req.method === 'POST') {
        const form = new IncomingForm({
            maxFileSize: 1024 * 1024 * 10,
        });

        await new Promise<void>((resolve, reject) => {
            form.parse(req, (err, _fields, files) => {
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
                                        const mealText = $(cell).text().trim();

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
};

export default withUser(handler);
