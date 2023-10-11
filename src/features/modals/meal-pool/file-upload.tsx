import {
    ActionIcon,
    Alert,
    Box,
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

import { useCreateMealPool } from './hooks/use-create-meal-pool';
import { useUpload } from './hooks/use-upload';

const formatSizeInMB = (size: number) => +(size / 1024 / 1024).toFixed(2);

export const FileUploadTab = () => {
    const { t } = useTranslation();
    const [file, setFile] = useState<File | null>(null);
    const [parsedMeals, setParsedMeals] = useState<string[]>();
    const resetRef = useRef<() => void>(null);

    const { mutate, isLoading, isSuccess } = useUpload({
        onSuccess: (data) => {
            setParsedMeals(data.data);
        },
    });

    const { mutate: createMealPool, isLoading: isCreating } = useCreateMealPool(
        {
            onSuccess: () => {
                // TODO
            },
        },
    );

    const handleClear = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        setFile(null);
        resetRef.current?.();
    }, []);

    const handleUpload = useCallback<
        MouseEventHandler<HTMLButtonElement>
    >(() => {
        mutate({ file });
    }, [file, mutate]);

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
            <Alert icon={<InfoEmpty />}>
                We currently accept only .docx files. More coming soon!
            </Alert>
            {/* eslint-disable-next-line react/jsx-handler-names */}
            <FileButton accept=".docx" onChange={setFile} resetRef={resetRef}>
                {(props) => <Button {...props}>Select file</Button>}
            </FileButton>
            {file ? (
                <Group gap="sm">
                    <Box>
                        <Text span>Upload file </Text>
                        <Text span fw={700}>
                            {file.name}{' '}
                        </Text>
                        <Text span>(size {formatSizeInMB(file.size)} MB)?</Text>
                    </Box>
                    <Button
                        loading={isLoading}
                        onClick={handleUpload}
                        size="compact-sm"
                    >
                        {t('confirmation.yes')}
                    </Button>
                    <Button
                        color="red"
                        onClick={handleClear}
                        size="compact-sm"
                        variant="subtle"
                    >
                        {t('generic.actions.clear')}
                    </Button>
                </Group>
            ) : (
                <Text>No file selected.</Text>
            )}
            {isSuccess && (
                <form onSubmit={handleSubmit}>
                    <Stack gap="sm">
                        <Text>
                            We managed to extract the following from you file.
                            Review and create all the meals below in one action!
                        </Text>
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
