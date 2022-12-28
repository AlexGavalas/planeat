type RowKey = 'morning' | 'snack1' | 'lunch' | 'snack2' | 'dinner';

type RowItem = {
    label: string;
    key: RowKey;
};

interface CellProps {
    id: string;
    meal?: Meal | EditedMeal;
    timestamp: Date;
    isEdited: boolean;
    isRow: boolean;
}
