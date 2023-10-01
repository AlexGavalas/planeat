import { z } from 'zod';

import { type EditedConnection } from '~types/connection';

type ConnectionSchema = z.ZodType<EditedConnection>;

export const connectionSchema: ConnectionSchema = z.object({
    connection_user_id: z.number(),
    id: z.string().optional(),
    user_id: z.number(),
});

export const deleteRequestSchema = z.object({
    connectionId: z.string(),
    connectionUserId: z.number(),
});

export const postRequestSchema = z.object({
    connectionUserId: z.number(),
});
