import {
    type MantineModal,
    type MantineModals,
    type OpenContextModal,
    useModals,
} from '@mantine/modals';

type ModalOptions<Modal extends MantineModal> = OpenContextModal<
    Parameters<MantineModals[Modal]>[0]['innerProps']
>;

export const useOpenContextModal = <Modal extends MantineModal>(
    modalName: Modal,
): ((options: ModalOptions<Modal>) => string) => {
    const modals = useModals();

    return (options: ModalOptions<Modal>) =>
        modals.openContextModal(modalName, options);
};
