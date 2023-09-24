import {
    ActionIcon,
    type ActionIconVariant,
    CopyButton as MantineCopyButton,
    type MantineSize,
    Tooltip,
} from '@mantine/core';
import { Check, Copy } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

type CopyButtonProps = {
    value: string;
    variant?: ActionIconVariant;
    size?: MantineSize;
};

export const CopyButton = ({
    value,
    variant = 'light',
    size = 'lg',
}: CopyButtonProps) => {
    const { t } = useTranslation();

    return (
        <MantineCopyButton value={value} timeout={2000}>
            {({ copied, copy }) => (
                <Tooltip
                    label={copied ? t('util.copied') : t('util.copy')}
                    withArrow
                >
                    <ActionIcon variant={variant} onClick={copy} size={size}>
                        {copied ? <Check /> : <Copy />}
                    </ActionIcon>
                </Tooltip>
            )}
        </MantineCopyButton>
    );
};
