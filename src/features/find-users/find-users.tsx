import {
    ActionIcon,
    Autocomplete,
    type AutocompleteProps,
    Button,
    Group,
    Stack,
    Text,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { AddUser, Cancel, ProfileCircle } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import { type MouseEventHandler, useCallback, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import { useProfile } from '~hooks/use-profile';
import { type User } from '~types/user';
import {
    showErrorNotification,
    showSuccessNotification,
} from '~util/notification';

export const FindUsers = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUserFullname, setSelectedUserFullname] = useState('');
    const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 350);
    const { profile } = useProfile();
    const queryClient = useQueryClient();

    const { data: users = [] } = useQuery(
        ['users', debouncedSearchQuery],
        async () => {
            const response = await fetch(
                `/api/v1/user?type=search&fullName=${debouncedSearchQuery}`,
            );

            const { data } = (await response.json()) as { data?: string[] };

            return data ?? [];
        },
        {
            enabled: Boolean(debouncedSearchQuery),
        },
    );

    const { data: selectedUser, isFetching: isFetchingSelectedUser } = useQuery(
        ['connection', selectedUserFullname],
        async () => {
            const response = await fetch(
                `/api/v1/user?type=profile&fullName=${selectedUserFullname}`,
            );

            const { data } = (await response.json()) as { data?: User[] };

            return data;
        },
        {
            enabled: Boolean(selectedUserFullname),
        },
    );

    const selectedUserId = selectedUser?.[0]?.id;

    const {
        data: hasAlreadySentRequest,
        isFetching: isFetchingHasAlreadySentRequest,
    } = useQuery(
        ['connection_request', selectedUserId],
        async () => {
            if (!selectedUserId || !profile) {
                return null;
            }

            const response = await fetch(
                `/api/v1/notification?requestUserId=${profile.id}&targetUserId=${selectedUserId}`,
            );

            const { data: hasAlreadySentRequest } = (await response.json()) as {
                data?: boolean;
            };

            return hasAlreadySentRequest;
        },
        {
            enabled: Boolean(selectedUserId),
        },
    );

    const handleUserSelect = useCallback<
        NonNullable<AutocompleteProps['onOptionSubmit']>
    >((value) => {
        setSelectedUserFullname(value);
    }, []);

    const handleClearInput = useCallback(() => {
        setSearchQuery('');
        setSelectedUserFullname('');
    }, []);

    const handleConnectionRequest = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(async () => {
        if (!profile || !selectedUser) {
            return;
        }

        const response = await fetch('/api/v1/notification', {
            body: JSON.stringify({
                targetUserId: selectedUser[0]?.id,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        });

        if (!response.ok) {
            showErrorNotification({
                message: t('connections.request.error'),
                title: t('notification.error.title'),
            });
        } else {
            showSuccessNotification({
                message: t('connections.request.success'),
                title: t('notification.success.title'),
            });

            await queryClient.invalidateQueries([
                'connection_request',
                selectedUserId,
            ]);
        }
    }, [profile, selectedUser, selectedUserId, t, queryClient]);

    const shouldShowConnectionInfo =
        selectedUser && !isFetchingHasAlreadySentRequest;

    return (
        <Stack gap="md">
            <Autocomplete
                data={users}
                disabled={isFetchingSelectedUser}
                label={t('connections.search.label')}
                leftSection={<ProfileCircle />}
                onChange={setSearchQuery}
                onOptionSubmit={handleUserSelect}
                placeholder={t('connections.search.placeholder')}
                rightSection={
                    <ActionIcon onClick={handleClearInput} variant="subtle">
                        <Cancel />
                    </ActionIcon>
                }
                value={searchQuery}
            />
            {shouldShowConnectionInfo &&
                (hasAlreadySentRequest ? (
                    <Text c="green.8" fw={600}>
                        {t('connections.request.already_sent', {
                            fullName: selectedUser[0]?.full_name,
                        })}
                    </Text>
                ) : (
                    <Group justify="space-between">
                        <div>
                            <Text span>{t('connections.request.add')} </Text>
                            <Text span fw={600}>
                                {selectedUser[0]?.full_name}
                            </Text>
                            <Text span>
                                {' '}
                                {t('connections.request.to_connections')}?
                            </Text>
                        </div>
                        <Button
                            onClick={handleConnectionRequest}
                            rightSection={<AddUser />}
                            size="xs"
                        >
                            {t('connections.request.send')}
                        </Button>
                    </Group>
                ))}
        </Stack>
    );
};
