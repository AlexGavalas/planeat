import { useCallback, useState } from 'react';

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
}: {
    initialState?: ItemType;
} = {}): UseHistoryReturn<ItemType> => {
    const [currentIndex, setCurrentIndex] = useState(
        initialState !== undefined ? 0 : -1,
    );

    const [history, setHistory] = useState<ItemType[]>(
        initialState !== undefined ? [initialState] : [],
    );

    const clear = useCallback(() => {
        setHistory(initialState !== undefined ? [initialState] : []);
        setCurrentIndex(initialState !== undefined ? 0 : -1);
    }, [initialState]);

    const set = useCallback(
        (item: ItemType) => {
            const newHistory = [...history.slice(0, currentIndex + 1), item];

            setHistory(newHistory);
            setCurrentIndex(newHistory.length - 1);
        },
        [currentIndex, history.length],
    );

    const undo = useCallback(() => {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, []);

    const redo = useCallback(() => {
        setCurrentIndex((prev) => Math.min(prev + 1, history.length - 1));
    }, [history.length]);

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
