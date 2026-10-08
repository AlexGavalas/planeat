'use client';

import {
    Badge,
    Button,
    Container,
    Group,
    Modal,
    Pagination,
    Stack,
    Table,
    Text,
    TextInput,
    Title,
    UnstyledButton,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import {
    type FormEventHandler,
    type ReactNode,
    useEffect,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Card } from '~components/card';
import { MAX_PROFESSIONAL_CLIENTS } from '~constants/professional';
import { useLocalizedPath } from '~hooks/use-localized-path';
import { useMeals, useUnsavedChanges } from '~store/hooks';
import type {
    PaginatedProfessionalClients,
    ProfessionalClientSummary,
} from '~types/professional';

import { removeProfessionalRelationship } from '../../app/actions';
import styles from './professional-dashboard.module.css';

type ProfessionalDashboardProps = Readonly<{
    clients: PaginatedProfessionalClients;
    detail: ReactNode;
    query: string;
    selectedClient: ProfessionalClientSummary | null;
}>;

export const ProfessionalDashboard = ({
    clients,
    detail,
    query,
    selectedClient,
}: ProfessionalDashboardProps) => {
    const { t } = useTranslation();
    const router = useRouter();
    const localize = useLocalizedPath();
    const [search, setSearch] = useState(query);
    const [pendingUrl, setPendingUrl] = useState<string | null>(null);
    const [shouldStopAfterPrompt, setShouldStopAfterPrompt] = useState(false);
    const [isPromptOpen, setIsPromptOpen] = useState(false);
    const ownerUserId = selectedClient?.id ?? -1;
    const { hasUnsavedChanges, removeChanges } = useUnsavedChanges(ownerUserId);
    const { savePlan } = useMeals(ownerUserId);

    useEffect(() => {
        if (!hasUnsavedChanges) {
            return;
        }

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [hasUnsavedChanges]);

    useEffect(() => {
        if (!hasUnsavedChanges) {
            return;
        }

        const handleDocumentClick = (event: MouseEvent) => {
            if (
                event.defaultPrevented ||
                event.button !== 0 ||
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey
            ) {
                return;
            }

            const target = event.target;
            const anchor =
                target instanceof Element ? target.closest('a[href]') : null;
            if (!(anchor instanceof HTMLAnchorElement)) {
                return;
            }

            const url = new URL(anchor.href);
            if (url.origin !== window.location.origin) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();
            setPendingUrl(`${url.pathname}${url.search}${url.hash}`);
            setIsPromptOpen(true);
        };

        document.addEventListener('click', handleDocumentClick, true);
        return () => {
            document.removeEventListener('click', handleDocumentClick, true);
        };
    }, [hasUnsavedChanges]);

    const destination = ({
        client,
        page = clients.page,
        q = query,
    }: {
        client?: number;
        page?: number;
        q?: string;
    }) => {
        const params = new URLSearchParams();
        if (q) {
            params.set('q', q);
        }
        if (page > 1) {
            params.set('page', String(page));
        }
        if (client) {
            params.set('client', String(client));
        }
        const value = params.toString();
        return `${localize('/professional')}${value ? `?${value}` : ''}`;
    };

    const navigate = (url: string) => {
        if (hasUnsavedChanges) {
            setPendingUrl(url);
            setIsPromptOpen(true);
            return;
        }
        router.push(url);
    };

    const handleSearch: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        navigate(destination({ page: 1, q: search.trim() }));
    };

    const continueNavigation = async () => {
        const url = pendingUrl;
        if (shouldStopAfterPrompt && selectedClient) {
            const result = await removeProfessionalRelationship({
                relationshipId: selectedClient.relationshipId,
            });
            if (!result.ok) {
                return;
            }
        }
        setPendingUrl(null);
        setShouldStopAfterPrompt(false);
        setIsPromptOpen(false);
        if (url) {
            router.push(url);
            router.refresh();
        }
    };

    const discardAndContinue = () => {
        removeChanges();
        void continueNavigation();
    };

    const cancelNavigation = () => {
        setPendingUrl(null);
        setShouldStopAfterPrompt(false);
        setIsPromptOpen(false);
    };

    const saveAndContinue = async () => {
        if (await savePlan()) {
            await continueNavigation();
        }
    };

    const stopManaging = async () => {
        if (!selectedClient) {
            return;
        }
        if (hasUnsavedChanges) {
            setPendingUrl(destination({}));
            setShouldStopAfterPrompt(true);
            setIsPromptOpen(true);
            return;
        }
        const result = await removeProfessionalRelationship({
            relationshipId: selectedClient.relationshipId,
        });
        if (result.ok) {
            router.push(destination({}));
            router.refresh();
        }
    };

    return (
        <Container fluid>
            <Stack gap="lg">
                <Group justify="space-between">
                    <Title order={2}>{t('professional.dashboard.title')}</Title>
                    <Badge size="lg" variant="light">
                        {t('professional.dashboard.capacity', {
                            count: clients.total,
                            limit: MAX_PROFESSIONAL_CLIENTS,
                        })}
                    </Badge>
                </Group>
                <div className={styles.layout}>
                    <Card>
                        <Stack gap="md">
                            <form onSubmit={handleSearch}>
                                <Group align="end" wrap="nowrap">
                                    <TextInput
                                        label={t(
                                            'professional.dashboard.search_label',
                                        )}
                                        onChange={(event) => {
                                            setSearch(event.target.value);
                                        }}
                                        placeholder={t(
                                            'professional.dashboard.search_placeholder',
                                        )}
                                        value={search}
                                        w="100%"
                                    />
                                    <Button type="submit">
                                        {t('generic.search.label')}
                                    </Button>
                                </Group>
                            </form>
                            {clients.clients.length ? (
                                <Table highlightOnHover>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>
                                                {t(
                                                    'professional.dashboard.client',
                                                )}
                                            </Table.Th>
                                            <Table.Th>
                                                {t('login.email')}
                                            </Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {clients.clients.map((client) => (
                                            <Table.Tr key={client.id}>
                                                <Table.Td>
                                                    <UnstyledButton
                                                        className={
                                                            styles.rowButton
                                                        }
                                                        fw={
                                                            selectedClient?.id ===
                                                            client.id
                                                                ? 'var(--mantine-font-weight-bold)'
                                                                : undefined
                                                        }
                                                        onClick={() => {
                                                            navigate(
                                                                destination({
                                                                    client: client.id,
                                                                }),
                                                            );
                                                        }}
                                                    >
                                                        {client.fullName}
                                                    </UnstyledButton>
                                                </Table.Td>
                                                <Table.Td>
                                                    {client.email}
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <Text>
                                    {t('professional.dashboard.no_clients')}
                                </Text>
                            )}
                            {clients.pageCount > 1 && (
                                <Pagination
                                    onChange={(page) => {
                                        navigate(destination({ page }));
                                    }}
                                    total={clients.pageCount}
                                    value={clients.page}
                                />
                            )}
                        </Stack>
                    </Card>
                    <Card>
                        {selectedClient ? (
                            <Stack gap="lg">
                                <Group justify="space-between">
                                    <div>
                                        <Title order={3}>
                                            {selectedClient.fullName}
                                        </Title>
                                        <Text c="dimmed">
                                            {selectedClient.email}
                                        </Text>
                                    </div>
                                    <Button
                                        color="danger"
                                        onClick={() => void stopManaging()}
                                        variant="outline"
                                    >
                                        {t(
                                            'professional.dashboard.stop_managing',
                                        )}
                                    </Button>
                                </Group>
                                {detail}
                            </Stack>
                        ) : (
                            <Text>
                                {t('professional.dashboard.select_client')}
                            </Text>
                        )}
                    </Card>
                </div>
            </Stack>
            <Modal
                centered
                onClose={cancelNavigation}
                opened={isPromptOpen}
                title={t('professional.unsaved.title')}
            >
                <Stack>
                    <Text>{t('professional.unsaved.description')}</Text>
                    <Group justify="end">
                        <Button onClick={cancelNavigation} variant="default">
                            {t('generic.actions.cancel')}
                        </Button>
                        <Button
                            color="danger"
                            onClick={discardAndContinue}
                            variant="outline"
                        >
                            {t('professional.unsaved.discard')}
                        </Button>
                        <Button onClick={() => void saveAndContinue()}>
                            {t('professional.unsaved.save')}
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
};
