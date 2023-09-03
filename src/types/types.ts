export type Measurement = {
    id: string;
    user_id: number;
    date: string;
    weight: number;
    fat_percentage: number | null;
};

export type FatMeasurement = {
    id: string;
    fat_percent: number;
    date: string;
    user_id: number;
};

export type Profile = {
    id: string;
    is_nutritionist: boolean;
    full_name: string;
    language: string;
    height: number;
};

export type Section = {
    key: string;
    percent: number;
    bg: string;
};
