import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchActivitiesProps = {
    startDate: string;
    endDate: string;
    supabase: SupabaseClient<Database>;
};

export const fetchActivities = async ({
    startDate,
    endDate,
    supabase,
}: FetchActivitiesProps) => {
    const result = await supabase
        .from('activities')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate);

    return result;
};
