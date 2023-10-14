import { useCallback, useState } from 'react';

type UseHistoryReturn<ItemType> = {
    canRedo: boolean;
    canUndo: boolean;
    currentState: ItemType | null;
    redo: () => void;
    set: (item: ItemType) => void;
    undo: () => void;
};

export const useHistory = <ItemType>({
    initialState,
}: {
    initialState: ItemType;
}): UseHistoryReturn<ItemType> => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [history, setHistory] = useState<ItemType[]>([initialState]);

    const set = useCallback(
        (item: ItemType) => {
            setHistory((prev) => {
                return prev.slice(0, currentIndex + 1).concat(item);
            });

            setCurrentIndex((prev) => prev + 1);
        },
        [currentIndex],
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
        currentState: history[currentIndex] ?? null,
        redo,
        set,
        undo,
    };
};
