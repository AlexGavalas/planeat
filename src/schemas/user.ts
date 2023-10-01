import { z } from 'zod';

import { type EditedUser } from '~types/user';

type UserSchema = z.ZodType<EditedUser>;

export const userSchema: UserSchema = z.object({
    created_at: z.string().optional(),
    email: z.string().optional(),
    food_preferences_negative: z.string().nullable().optional(),
    food_preferences_positive: z.string().nullable().optional(),
    full_name: z.string().optional(),
    has_completed_onboarding: z.boolean().nullable().optional(),
    height: z.number().nullable().optional(),
    id: z.number().optional(),
    is_discoverable: z.boolean().optional(),
    language: z.string().optional(),
    target_weight: z.number().nullable().optional(),
});

export const patchRequestSchema = z.object({
    height: z.number().nullable().optional(),
    isDiscoverable: z.boolean().optional(),
    language: z.string().optional(),
    targetWeight: z.number().nullable().optional(),
    hasCompletedOnboarding: z.boolean().nullable().optional(),
});
