import { Table, Text, UnstyledButton } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { type ProfessionalClientSummary } from '~types/professional';

import styles from './professional-dashboard.module.css';

type ClientListProps = Readonly<{
    clients: ProfessionalClientSummary[];
    onSelectClient: (clientId: number) => void;
    selectedClientId?: number;
}>;

export const ClientList = ({
    clients,
    onSelectClient,
    selectedClientId,
}: ClientListProps) => {
    const { t } = useTranslation();
    if (!clients.length) {
        return <Text>{t('professional.dashboard.no_clients')}</Text>;
    }

    return (
        <Table highlightOnHover>
            <Table.Thead>
                <Table.Tr>
                    <Table.Th>{t('professional.dashboard.client')}</Table.Th>
                    <Table.Th>{t('login.email')}</Table.Th>
                </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
                {clients.map((client) => {
                    const handleSelectClient = () => {
                        onSelectClient(client.id);
                    };
                    return (
                        <Table.Tr key={client.id}>
                            <Table.Td>
                                <UnstyledButton
                                    className={styles.rowButton}
                                    fw={
                                        selectedClientId === client.id
                                            ? 'var(--mantine-font-weight-bold)'
                                            : undefined
                                    }
                                    onClick={handleSelectClient}
                                >
                                    {client.fullName}
                                </UnstyledButton>
                            </Table.Td>
                            <Table.Td>{client.email}</Table.Td>
                        </Table.Tr>
                    );
                })}
            </Table.Tbody>
        </Table>
    );
};
