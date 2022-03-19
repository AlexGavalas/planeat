namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
}

interface StoreI {
    currentWeek: Date;
    content: Record<string, Record<string, Content>>;
    unsavedChanges: Record<string, EditedMeal>;
    nextWeek: () => void;
    previousWeek: () => void;
    copyToNextWeek: () => void;
    addChange: (meal: EditedMeal) => void;
    removeChange: (key: string) => void;
    removeChanges: () => void;
}

type Meal = {
    id: string;
    meal: string;
    user_id: string;
    section_key: string;
    day: string;
};

type EditedMeal = Omit<Meal, 'id'> & { id?: string };

type MealsMap = Record<string, Meal>;
