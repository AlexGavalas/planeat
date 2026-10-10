import {
    ActionIcon,
    Alert,
    Button,
    FileButton,
    Group,
    Stack,
    Text,
    Textarea,
} from '@mantine/core';
import { InfoCircle, Redo, Trash, Undo } from 'iconoir-react';
import {
    type MouseEventHandler,
    type SubmitEventHandler,
    useRef,
    useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { useHistory } from '~hooks/use-history';

import { FileActions } from './file-actions';
import { useCreateMealPool } from './hooks/use-create-meal-pool';
import { useUpload } from './hooks/use-upload';

const formSchema = z.array(z.string());

export const FileUploadTab = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const resetRef = useRef<() => void>(null);
    const {
        canRedo,
        canUndo,
        clear: clearHistory,
        currentState,
        redo: handleRedo,
        set,
        undo: handleUndo,
    } = useHistory<string[]>();

    const {
        mutate,
        isPending: isUploading,
        isSuccess,
        reset: resetUpload,
    } = useUpload({
        onSuccess: (data) => {
            set(data.data);
        },
    });

    const { mutate: createMealPool, isPending: isCreating } =
        useCreateMealPool();

    const handleClear = () => {
        setFile(null);
        clearHistory();
        resetRef.current?.();
    };

    const handleUpload = (() => {
        mutate({ file });
    }) satisfies MouseEventHandler;

    const handleReset = () => {
        resetUpload();
        setFile(null);
    };

    const handleSubmit = ((e) => {
        e.preventDefault();

        const formData = Array.from(new FormData(e.currentTarget));

        const content = formSchema.parse(formData);

        createMealPool({
            templates: content.map((item) => ({ content: item, items: [] })),
        });
    }) satisfies SubmitEventHandler<HTMLFormElement>;

    const handleRemoveItem = ((e) => {
        const itemIndex = e.currentTarget.dataset.itemIndex;

        if (itemIndex && currentState) {
            set(currentState.filter((_, idx) => idx !== +itemIndex));
        }
    }) satisfies MouseEventHandler<HTMLButtonElement>;

    return (
        <Stack gap="md">
            <Alert icon={<InfoCircle />} variant="outline">
                {t('file_types_info')}
            </Alert>
            {!isSuccess && (
                <FileButton
                    accept=".docx"
                    onChange={setFile}
                    // oxlint-disable-next-line react/jsx-handler-names
                    resetRef={resetRef}
                >
                    {(props) => <Button {...props}>{t('upload.label')}</Button>}
                </FileButton>
            )}
            <FileActions
                file={file}
                isSuccess={isSuccess}
                isUploading={isUploading}
                onClear={handleClear}
                onReset={handleReset}
                onUpload={handleUpload}
            />

            {isSuccess && (
                <>
                    <Group gap="md">
                        <Alert icon={<InfoCircle />} variant="outline">
                            {t('upload.helper')}
                        </Alert>
                        <Button
                            disabled={!canUndo}
                            leftSection={<Undo />}
                            onClick={handleUndo}
                            variant="outline"
                        >
                            {t('generic.actions.undo')}
                        </Button>
                        <Button
                            disabled={!canRedo}
                            leftSection={<Redo />}
                            onClick={handleRedo}
                            variant="outline"
                        >
                            {t('generic.actions.redo')}
                        </Button>
                    </Group>
                    <form onSubmit={handleSubmit}>
                        <Stack gap="sm">
                            <Text fw="var(--mantine-font-weight-medium)">
                                {t('import_success')}
                            </Text>
                            {currentState?.map((result, idx) => (
                                <Group key={result + idx} gap="sm">
                                    <Textarea
                                        autosize
                                        defaultValue={result}
                                        minRows={1}
                                        name="meal"
                                        style={{ flexGrow: 1 }}
                                    />

                                    <ActionIcon
                                        color="danger"
                                        data-item-index={idx}
                                        onClick={handleRemoveItem}
                                        variant="outline"
                                    >
                                        <Trash />
                                    </ActionIcon>
                                </Group>
                            ))}
                            <Button loading={isCreating} type="submit">
                                {t('create')}
                            </Button>
                        </Stack>
                    </form>
                </>
            )}
        </Stack>
    );
};
