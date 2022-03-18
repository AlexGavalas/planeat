namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
}

interface StoreI {
    currentWeek: Date;
    content: Record<string, Record<string, Content>>;
    editCell: (key: string, value: string) => void;
    swapDays: (props: { destinationId: string; originId: string }) => void;
    nextWeek: () => void;
    previousWeek: () => void;
    copyToNextWeek: () => void;
}
