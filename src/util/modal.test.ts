import { renderHook } from '@testing-library/react';

import { useOpenContextModal } from './modal';

const mockOpenModal = jest.fn().mockReturnValue('modal-id');

jest.mock('@mantine/modals', () => ({
    useModals: jest.fn(() => ({
        openContextModal: mockOpenModal,
    })),
}));

describe('useOpenContextModal', () => {
    it('opens the selected modal with its typed options and returns its id', () => {
        const { result } = renderHook(() => useOpenContextModal('meal'));
        const options = {
            innerProps: {
                initialMeal: 'Porridge',
                onDelete: jest.fn(),
                onSave: jest.fn(),
            },
        };

        expect(result.current(options)).toBe('modal-id');
        expect(mockOpenModal).toHaveBeenCalledWith('meal', options);
    });
});
