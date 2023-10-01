import {
    ActionIcon,
    type ActionIconVariant,
    CopyButton as MantineCopyButton,
    type MantineSize,
    Tooltip,
    type TooltipProps,
} from '@mantine/core';
import { Check, Copy } from 'iconoir-react';
import { useTranslation } from 'next-i18next';

type CopyButtonProps = {
    value: string;
    variant?: ActionIconVariant;
    size?: MantineSize;
    tooltipPosition?: TooltipProps['position'];
};

export const CopyButton = ({
    value,
    variant = 'light',
    size = 'lg',
    tooltipPosition,
}: CopyButtonProps) => {
    const { t } = useTranslation();

    return (
        <MantineCopyButton timeout={2000} value={value}>
            {({ copied, copy: handleCopy }) => (
                <Tooltip
                    withArrow
                    label={copied ? t('util.copied') : t('util.copy')}
                    position={tooltipPosition}
                >
                    <ActionIcon
                        onClick={handleCopy}
                        size={size}
                        variant={variant}
                    >
                        {copied ? <Check /> : <Copy />}
                    </ActionIcon>
                </Tooltip>
            )}
        </MantineCopyButton>
    );
};
