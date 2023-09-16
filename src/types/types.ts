export type Measurement = {
    id: string;
    user_id: number;
    date: string;
    weight: number;
    fat_percentage: number | null;
};

export type Section = {
    key: string;
    percent: number;
    bg: string;
};
