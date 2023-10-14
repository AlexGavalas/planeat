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
import { InfoEmpty, Trash } from 'iconoir-react';
import { useTranslation } from 'next-i18next';
import {
    type FormEventHandler,
    type MouseEventHandler,
    useCallback,
    useRef,
    useState,
} from 'react';

import { FileActions } from './file-actions';
import { useCreateMealPool } from './hooks/use-create-meal-pool';
import { useUpload } from './hooks/use-upload';

export const FileUploadTab = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [parsedMeals, setParsedMeals] = useState<string[]>();
    const resetRef = useRef<() => void>(null);

    const {
        mutate,
        isLoading: isUploading,
        isSuccess,
        reset: resetUpload,
    } = useUpload({
        onSuccess: (data) => {
            setParsedMeals(data.data);
        },
    });

    const { mutate: createMealPool, isLoading: isCreating } =
        useCreateMealPool();

    const handleClear = useCallback(() => {
        setFile(null);
        resetRef.current?.();
    }, []);

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

            if (itemIndex) {
                setParsedMeals(
                    (meals) => meals?.filter((_, idx) => idx !== +itemIndex),
                );
            }
        },
        [],
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
                <form onSubmit={handleSubmit}>
                    <Stack gap="sm">
                        <Text>{t('import_success')}</Text>
                        {parsedMeals?.map((result, idx) => (
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
            )}
        </Stack>
    );
};
