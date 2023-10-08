import { type MantineModalsOverride, useModals } from '@mantine/modals';
import curry from 'lodash/fp/curry';

type Modals = keyof MantineModalsOverride['modals'];

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useOpenContextModal = (modalName: Modals) => {
    const modals = useModals();

    switch (modalName) {
        case 'activity':
            return curry(modals.openContextModal<'activity'>)('activity');
        case 'meal':
            return curry(modals.openContextModal<'meal'>)('meal');
        case 'delete-account':
            return curry(modals.openContextModal<'delete-account'>)(
                'delete-account',
            );
        case 'meal-note':
            return curry(modals.openContextModal<'meal-note'>)('meal-note');
        case 'meal-pool':
            return curry(modals.openContextModal<'meal-pool'>)('meal-pool');
        case 'meal-rating':
            return curry(modals.openContextModal<'meal-rating'>)('meal-rating');
        case 'measurement':
            return curry(modals.openContextModal<'measurement'>)('measurement');
        case 'week-overview':
            return curry(modals.openContextModal<'week-overview'>)(
                'week-overview',
            );
        default:
            throw new Error(`No modal with that name exists`);
    }
};
