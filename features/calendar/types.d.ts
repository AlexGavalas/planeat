type Row = 'Morning' | 'Snack 1' | 'Lunch' | 'Snack 2' | 'Dinner';

type Content = {
    content: string;
};

interface CellProps {
    id: string;
    meal?: Meal;
    timestamp: Date;
}
