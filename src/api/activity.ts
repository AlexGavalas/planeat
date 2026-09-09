import { and, count, desc, eq, gte, lte } from 'drizzle-orm';

import { getDb } from '~db';
import { activities } from '~db/schema';
import { type Activity } from '~types/activity';

export const fetchActivities = async ({
    endDate,
    startDate,
    userId,
}: {
    endDate: string;
    startDate: string;
    userId: number;
}): Promise<Activity[]> =>
    getDb()
        .select()
        .from(activities)
        .where(
            and(
                eq(activities.user_id, userId),
                gte(activities.date, startDate),
                lte(activities.date, endDate),
            ),
        );

export const fetchActivitiesCount = async ({ userId }: { userId: number }) =>
    (
        await getDb()
            .select({ count: count() })
            .from(activities)
            .where(eq(activities.user_id, userId))
    )[0]?.count ?? 0;

export const fetchActivitiesPaginated = async ({
    end,
    start,
    userId,
}: {
    end: number;
    start: number;
    userId: number;
}): Promise<Activity[]> =>
    getDb()
        .select()
        .from(activities)
        .where(eq(activities.user_id, userId))
        .orderBy(desc(activities.date))
        .limit(end - start + 1)
        .offset(start);

export const deleteActivity = async ({
    activityId,
    userId,
}: {
    activityId: string;
    userId: number;
}) => {
    await getDb()
        .delete(activities)
        .where(
            and(eq(activities.id, activityId), eq(activities.user_id, userId)),
        );
    return { error: null };
};

export const updateActivity = async ({
    activity,
    activityId,
    date,
    userId,
}: {
    activity: string;
    activityId?: string;
    date: string;
    userId: number;
}) => {
    const values = { activity, date, user_id: userId };
    const db = getDb();
    if (activityId) {
        await db
            .update(activities)
            .set(values)
            .where(
                and(
                    eq(activities.id, activityId),
                    eq(activities.user_id, userId),
                ),
            );
    } else {
        await db.insert(activities).values(values);
    }
    return { error: null };
};
