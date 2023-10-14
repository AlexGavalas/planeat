import { act, renderHook } from '~test/utils';

import { useHistory } from './use-history';

const performActions = (actions: (() => void)[]): void => {
    actions.forEach((action) => {
        act(action);
    });
};

describe('useHistory', () => {
    it('returns an object', () => {
        const { result } = renderHook(useHistory, {
            initialProps: { initialState: 0 },
        });

        expect(result.current).toStrictEqual({
            canRedo: false,
            canUndo: false,
            clear: expect.any(Function),
            currentState: 0,
            redo: expect.any(Function),
            set: expect.any(Function),
            undo: expect.any(Function),
        });
    });

    describe('set', () => {
        it('adds an item to the history', () => {
            const { result } = renderHook(useHistory, {
                initialProps: { initialState: 0 },
            });

            performActions([
                (): void => {
                    result.current.set(1);
                },
            ]);

            expect(result.current.currentState).toBe(1);
        });

        describe('when an undo has been performed', () => {
            it('adds an item to the history', () => {
                const { result } = renderHook(useHistory, {
                    initialProps: { initialState: 0 },
                });

                performActions([
                    (): void => {
                        result.current.set(1);
                    },
                    (): void => {
                        result.current.undo();
                    },
                    (): void => {
                        result.current.set(2);
                    },
                ]);

                expect(result.current.currentState).toBe(2);
            });
        });
    });

    describe('undo', () => {
        it('removes the last item from the history', () => {
            const { result } = renderHook(useHistory, {
                initialProps: { initialState: 0 },
            });

            performActions([
                (): void => {
                    result.current.set(1);
                },
                (): void => {
                    result.current.set(2);
                },
                (): void => {
                    result.current.set(3);
                },
            ]);

            expect(result.current.currentState).toBe(3);

            performActions([
                (): void => {
                    result.current.undo();
                },
            ]);

            expect(result.current.currentState).toBe(2);
        });

        describe('when there are no items to remove', () => {
            it('returns the initial item', () => {
                const { result } = renderHook(useHistory, {
                    initialProps: { initialState: 0 },
                });

                performActions([
                    (): void => {
                        result.current.undo();
                    },
                    (): void => {
                        result.current.undo();
                    },
                    (): void => {
                        result.current.undo();
                    },
                ]);

                expect(result.current.currentState).toBe(0);
            });
        });
    });

    describe('redo', () => {
        describe('when there is a next item', () => {
            it('returns the next item', () => {
                const { result } = renderHook(useHistory, {
                    initialProps: { initialState: 0 },
                });

                performActions([
                    (): void => {
                        result.current.set(1);
                    },
                    (): void => {
                        result.current.set(2);
                    },
                    (): void => {
                        result.current.set(3);
                    },
                    (): void => {
                        result.current.undo();
                    },
                    (): void => {
                        result.current.undo();
                    },
                    (): void => {
                        result.current.redo();
                    },
                ]);

                expect(result.current.currentState).toBe(2);
            });
        });

        describe('when there is not a next item', () => {
            it('returns the current item', () => {
                const { result } = renderHook(useHistory, {
                    initialProps: { initialState: 0 },
                });

                performActions([
                    (): void => {
                        result.current.set(1);
                    },
                    (): void => {
                        result.current.set(2);
                    },
                    (): void => {
                        result.current.redo();
                    },
                ]);

                expect(result.current.currentState).toBe(2);
            });
        });
    });
});
