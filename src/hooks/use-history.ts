import { useState } from 'react';

type UseHistoryReturn<ItemType> = {
    canRedo: boolean;
    canUndo: boolean;
    clear: () => void;
    currentState: ItemType | null;
    redo: () => void;
    set: (item: ItemType) => void;
    undo: () => void;
};

export const useHistory = <ItemType>({
    initialState,
}: { initialState?: ItemType } = {}): UseHistoryReturn<ItemType> => {
    const [currentIndex, setCurrentIndex] = useState(
        initialState !== undefined ? 0 : -1,
    );

    const [history, setHistory] = useState<ItemType[]>(() =>
        initialState !== undefined ? [initialState] : [],
    );

    const clear: UseHistoryReturn<ItemType>['clear'] = () => {
        setHistory(initialState !== undefined ? [initialState] : []);
        setCurrentIndex(initialState !== undefined ? 0 : -1);
    };

    const set: UseHistoryReturn<ItemType>['set'] = (item) => {
        const newHistory = [...history.slice(0, currentIndex + 1), item];

        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    };

    const undo: UseHistoryReturn<ItemType>['undo'] = () => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    };

    const redo: UseHistoryReturn<ItemType>['redo'] = () => {
        setCurrentIndex((prev) => Math.min(prev + 1, history.length - 1));
    };

    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    return {
        canRedo,
        canUndo,
        clear,
        currentState: history[currentIndex] ?? null,
        redo,
        set,
        undo,
    };
};
