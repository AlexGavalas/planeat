import { type SupabaseClient } from '@supabase/supabase-js';

import { type Database } from '~types/supabase';

type FetchUserProps = {
    supabase: SupabaseClient<Database>;
    email: string;
};

export const fetchUser = async ({ supabase, email }: FetchUserProps) => {
    const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    return profile;
};
