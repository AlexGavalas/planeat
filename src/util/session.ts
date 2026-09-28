import { revalidatePath } from 'next/cache';
import { type NextRequest } from 'next/server';
import 'server-only';
import { ZodError } from 'zod';

import { getCurrentUser } from '~api/session';
import { type User } from '~types/user';

export type RouteHandlerWithUser = (params: {
    request: NextRequest;
    user: User;
}) => Promise<Response>;

export const withUser =
    (handler: RouteHandlerWithUser) =>
    async (request: NextRequest): Promise<Response> => {
        try {
            const user = await getCurrentUser();

            if (!user) {
                return Response.json(
                    { message: 'Unauthorized' },
                    { status: 401 },
                );
            }

            const response = await handler({ request, user });

            response.headers.set('Cache-Control', 'private, no-store');

            if (
                response.ok &&
                !['GET', 'HEAD', 'OPTIONS'].includes(request.method)
            ) {
                const resource = request.nextUrl.pathname.split('/')[3];

                if (resource === 'user') {
                    revalidatePath('/', 'layout');
                } else if (
                    resource === 'connection' ||
                    resource === 'notification'
                ) {
                    revalidatePath('/connections');
                } else if (
                    resource === 'meal' ||
                    resource === 'activity' ||
                    resource === 'measurement'
                ) {
                    for (const path of ['/home', '/meal-plan', '/settings']) {
                        revalidatePath(path);
                    }
                }
            }

            return response;
        } catch (error) {
            if (error instanceof ZodError || error instanceof SyntaxError) {
                return Response.json(
                    { message: 'Bad Request' },
                    { status: 400 },
                );
            }

            console.error(error);

            return Response.json(
                { message: 'Internal Server Error' },
                { status: 500 },
            );
        }
    };
