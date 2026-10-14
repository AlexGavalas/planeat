'use client';

import {
    ActionIcon,
    Alert,
    Button,
    Drawer,
    Group,
    Paper,
    ScrollArea,
    Select,
    Stack,
    Text,
    TextInput,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { format } from 'date-fns';
import { Trash } from 'iconoir-react';
import { useTranslation } from 'react-i18next';

import { type Meal } from '~types/meal';
import { type WeeklyMealZone } from '~types/meal-zone';

import styles from './schedule-editor.module.css';
import { useScheduleEditor } from './use-schedule-editor';

type Props = Readonly<{
    isSaving: boolean;
    initialDay: string;
    meals: Meal[];
    onClose: () => void;
    onSave: (zones: WeeklyMealZone[]) => Promise<void>;
    opened: boolean;
    weekStart: string;
    zones: WeeklyMealZone[];
}>;

export const ScheduleEditor = (props: Props) => {
    const { t } = useTranslation();
    const editor = useScheduleEditor(props);
    const dayOptions = editor.days.map(({ label, timestamp }) => ({
        label,
        value: format(timestamp, 'yyyy-MM-dd'),
    }));
    const copyOptions = dayOptions.filter(
        ({ value }) => value !== editor.selectedDay,
    );
    const handleDayChange = (value: string | null) => {
        if (value) {
            editor.setSelectedDay(value);
        }
    };
    const handleCopySourceChange = (value: string | null) => {
        editor.setCopySource(value);
    };

    return (
        <Drawer
            closeButtonProps={{ 'aria-label': t('generic.actions.close') }}
            onClose={props.onClose}
            opened={props.opened}
            position="right"
            scrollAreaComponent={ScrollArea.Autosize}
            size="md"
            title={t('meal_plan.schedule.title')}
        >
            <Stack gap="lg">
                <Text c="dimmed" size="sm">
                    {t('meal_plan.schedule.description')}
                </Text>
                <Select
                    allowDeselect={false}
                    data={dayOptions}
                    label={t('meal_plan.schedule.day')}
                    onChange={handleDayChange}
                    value={editor.selectedDay}
                />
                <Group justify="space-between">
                    <Text fw={600}>{t('meal_plan.schedule.meal_slots')}</Text>
                    <Text c="dimmed" size="sm">
                        {editor.dayZones.length} / 10
                    </Text>
                </Group>
                <Stack gap="sm">
                    {editor.dayZones.map((zone, index) => (
                        <Paper key={zone.zoneKey} p="sm" withBorder>
                            <div className={styles.zoneRow}>
                                <TextInput
                                    aria-label={t(
                                        'meal_plan.schedule.name_label',
                                        { number: index + 1 },
                                    )}
                                    error={
                                        zone.label.trim()
                                            ? undefined
                                            : t('meal_plan.schedule.name_error')
                                    }
                                    label={t('meal_plan.schedule.name')}
                                    maxLength={40}
                                    onChange={editor.handleZoneChange(
                                        zone.zoneKey,
                                        'label',
                                    )}
                                    value={zone.label}
                                />
                                <TimeInput
                                    error={
                                        editor.duplicateTimes.has(zone.time)
                                            ? t('meal_plan.schedule.time_error')
                                            : undefined
                                    }
                                    label={t('meal_plan.schedule.time')}
                                    onChange={editor.handleZoneChange(
                                        zone.zoneKey,
                                        'time',
                                    )}
                                    value={zone.time}
                                />
                                <ActionIcon
                                    aria-label={t(
                                        'meal_plan.schedule.remove_slot',
                                        { name: zone.label },
                                    )}
                                    color="danger"
                                    disabled={editor.dayZones.length === 1}
                                    onClick={editor.handleRemove.bind(
                                        undefined,
                                        zone.zoneKey,
                                    )}
                                    variant="subtle"
                                >
                                    <Trash />
                                </ActionIcon>
                            </div>
                        </Paper>
                    ))}
                </Stack>
                <Button
                    disabled={editor.dayZones.length >= 10}
                    onClick={editor.handleAdd}
                    variant="outline"
                >
                    {t('meal_plan.schedule.add_slot')}
                </Button>
                <Paper p="sm" withBorder>
                    <Stack gap="sm">
                        <Select
                            clearable
                            data={copyOptions}
                            label={t('meal_plan.schedule.copy_from')}
                            onChange={handleCopySourceChange}
                            value={editor.copySource}
                        />
                        <Button
                            disabled={!editor.copySource}
                            onClick={editor.handleCopy}
                            variant="default"
                        >
                            {t('meal_plan.schedule.copy')}
                        </Button>
                    </Stack>
                </Paper>
                {editor.removedMealCount > 0 && (
                    <Alert
                        color="warning"
                        title={t('meal_plan.schedule.warning_title')}
                    >
                        {t('meal_plan.schedule.removed_meals_warning', {
                            count: editor.removedMealCount,
                        })}
                    </Alert>
                )}
                <Group className={styles.actions} justify="flex-end">
                    <Button onClick={props.onClose} variant="default">
                        {t('generic.actions.cancel')}
                    </Button>
                    <Button
                        disabled={editor.hasErrors}
                        loading={props.isSaving}
                        onClick={editor.handleSave}
                    >
                        {t('meal_plan.schedule.save')}
                    </Button>
                </Group>
            </Stack>
        </Drawer>
    );
};
