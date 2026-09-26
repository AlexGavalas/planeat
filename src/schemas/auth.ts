import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .email()
        .transform((email) => email.toLowerCase()),
    password: z.string().min(8).max(128),
});

export const registrationSchema = loginSchema.extend({
    fullName: z.string().trim().min(2).max(100),
});
