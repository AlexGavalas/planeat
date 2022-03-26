type Row = 'Morning' | 'Snack 1' | 'Lunch' | 'Snack 2' | 'Dinner';

interface CellProps {
    id: string;
    meal?: Meal | EditedMeal;
    timestamp: Date;
    isEdited: boolean;
    isRow: boolean;
}
