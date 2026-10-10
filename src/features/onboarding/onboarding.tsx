import { Tour } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocalizedPath } from '~hooks/use-localized-path';
import { useProfile } from '~hooks/use-profile';
import { BRAND_COLORS } from '~theme';

import { useSteps } from './helpers';

export const Onboarding = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const localize = useLocalizedPath();
    const { profile, updateProfile } = useProfile();
    const [shouldRun, setShouldRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [hasTourEnded, setHasTourEnded] = useState(false);
    const [isBrowser, setIsBrowser] = useState(false);

    const steps = useSteps();

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const currentTarget = steps[stepIndex]?.target;

    useEffect(() => {
        if (!isBrowser || hasTourEnded || typeof currentTarget !== 'string') {
            return;
        }

        const startWhenTargetIsReady = () => {
            if (!document.querySelector(currentTarget)) {
                return false;
            }

            setShouldRun(true);

            return true;
        };

        if (startWhenTargetIsReady()) {
            return;
        }

        setShouldRun(false);

        const observer = new MutationObserver(() => {
            if (startWhenTargetIsReady()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
        };
    }, [currentTarget, hasTourEnded, isBrowser]);

    const handleStepChange = (nextStepIndex: number) => {
        const currentStep = steps[stepIndex];
        const nextStep = steps[nextStepIndex];

        setStepIndex(nextStepIndex);

        if (currentStep && nextStep && currentStep.route !== nextStep.route) {
            setShouldRun(false);
            router.push(localize(nextStep.route));
        }
    };

    const handleTourClose = () => {
        setShouldRun(false);
        setHasTourEnded(true);

        updateProfile({
            hasCompletedOnboarding: true,
            silent: true,
        });
    };

    if (!isBrowser || profile?.has_completed_onboarding) {
        return null;
    }

    return (
        <Tour
            active={shouldRun}
            attributes={{
                closeButton: {
                    'aria-label': t('generic.actions.close'),
                },
            }}
            color={BRAND_COLORS[5]}
            labels={{
                back: t('generic.misc.back'),
                close: t('generic.misc.done'),
                next: t('generic.misc.next'),
                skip: t('generic.misc.skip'),
            }}
            onClose={handleTourClose}
            onStepChange={handleStepChange}
            step={stepIndex}
            styles={{
                body: {
                    paddingInlineEnd:
                        'calc(var(--mantine-spacing-lg) + var(--mantine-spacing-xs))',
                },
            }}
            withScrollIntoView
        >
            {steps.map(({ route: _route, ...step }) => (
                <Tour.Step key={step.target} {...step} />
            ))}
        </Tour>
    );
};
