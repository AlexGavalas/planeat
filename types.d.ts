namespace NodeJS {
    interface ProcessEnv {
        NEXT_PUBLIC_SUPABASE_URL: string;
        NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    }
}

type Meal = {
    id: string;
    meal: string;
    user_id: string;
    section_key: string;
    day: string;
};

type EditedMeal = Omit<Meal, 'id'> & { id?: string };

type MealsMap = Record<string, Meal | EditedMeal>;

type WeightMeasurement = {
    id: string;
    weight: number;
    date: string;
    user_id: string;
};

type WeightData = {
    id: string;
    date: string;
    weight: number;
    user_id: string;
};

type Profile = {
    id: string;
    is_nutritionist: boolean;
    full_name: string;
    language: string;
    height: number;
};

type Section = {
    key: string;
    label: string;
    percent: number;
    bg: string;
};
