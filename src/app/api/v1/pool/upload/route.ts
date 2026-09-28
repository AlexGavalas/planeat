import * as cheerio from 'cheerio';
import mammoth from 'mammoth';

import { withUser } from '~util/session';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const POST = withUser(async ({ request }) => {
    // Bound the body before formData() buffers it, including requests without Content-Length.
    const reader = request.body?.getReader();

    if (!reader) {
        return Response.json({ message: 'Bad Request' }, { status: 400 });
    }

    const chunks: Uint8Array[] = [];
    let size = 0;

    while (true) {
        const { done: isDone, value } = await reader.read();

        if (isDone) {
            break;
        }

        size += value.byteLength;

        if (size > MAX_FILE_SIZE + 64 * 1024) {
            await reader.cancel();

            return Response.json(
                { message: 'File too large' },
                { status: 413 },
            );
        }

        chunks.push(value);
    }

    const form = await new Response(Buffer.concat(chunks), {
        headers: request.headers,
    }).formData();

    const file = form.get('file');

    if (!file || typeof file === 'string') {
        return Response.json({ message: 'Bad Request' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
        return Response.json({ message: 'File too large' }, { status: 413 });
    }

    const result = await mammoth.convertToHtml({
        buffer: Buffer.from(await file.arrayBuffer()),
    });

    const $ = cheerio.load(result.value);
    const meals: string[] = [];

    $('tr')
        .not(':first')
        .each((_, row) => {
            $('td', row)
                .not(':first')
                .each((_, cell) => {
                    const meal = $(cell).text().trim();

                    if (meal.length > 10) {
                        meals.push(meal);
                    }
                });
        });

    return Response.json({ data: [...new Set(meals)] });
});
