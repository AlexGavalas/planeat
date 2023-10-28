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
import { InfoEmpty, Redo, Trash, Undo } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import {
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useRef,
    useState,
} from 'react';

import { useHistory } from '~hooks/use-history';

import { FileActions } from './file-actions';
import { useCreateMealPool } from './hooks/use-create-meal-pool';
import { useUpload } from './hooks/use-upload';

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

    const handleClear = useCallback(() => {
        setFile(null);
        clearHistory();
        resetRef.current?.();
    }, [clearHistory]);

    const handleUpload = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        mutate({ file });
    }, [file, mutate]);

    const handleReset = useCallback(() => {
        resetUpload();
        setFile(null);
    }, [resetUpload]);

    const handleSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
        (e) => {
            e.preventDefault();

            const content = new FormData(e.currentTarget)
                .getAll('meal')
                .map((meal) => meal.toString());

            createMealPool({ content });
        },
        [createMealPool],
    );

    const handleRemoveItem = useCallback<MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            const itemIndex = e.currentTarget.dataset.itemIndex;

            if (itemIndex && currentState) {
                set(currentState.filter((_, idx) => idx !== +itemIndex));
            }
        },
        [currentState, set],
    );

    return (
        <Stack gap="md">
            <Alert icon={<InfoEmpty />}>{t('file_types_info')}</Alert>
            {!isSuccess && (
                <FileButton
                    accept=".docx"
                    onChange={setFile}
                    // eslint-disable-next-line react/jsx-handler-names
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
                        <Alert icon={<InfoEmpty />}>{t('upload.helper')}</Alert>
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
                            <Text fw={500}>{t('import_success')}</Text>
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
                                        color="red"
                                        data-item-index={idx}
                                        onClick={handleRemoveItem}
                                        variant="subtle"
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
