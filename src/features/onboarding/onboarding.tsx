import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type EventHandler, Joyride } from 'react-joyride';

import { useLocalizedPath } from '~hooks/use-localized-path';
import { useProfile } from '~hooks/use-profile';
import { BRAND_COLORS } from '~theme';

import { useSteps } from './helpers';

const outlineColor = BRAND_COLORS[7];

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

    const handleJoyrideEvent = (({ type, step, action, index }) => {
        if (type === 'step:after' && action === 'next') {
            setStepIndex(index + 1);
        }

        if (
            type === 'step:after' &&
            action === 'next' &&
            step.target === '#weight-container'
        ) {
            setShouldRun(false);
            router.push(localize('/meal-plan'));
        } else if (
            type === 'step:after' &&
            action === 'next' &&
            step.target === '#meal-plan-container'
        ) {
            setShouldRun(false);
            router.push(localize('/settings'));
        } else if (type === 'tour:end') {
            setShouldRun(false);
            setHasTourEnded(true);

            updateProfile({
                hasCompletedOnboarding: true,
                silent: true,
            });
        }
    }) satisfies EventHandler;

    if (!isBrowser || profile?.has_completed_onboarding) {
        return null;
    }

    return (
        <div style={{ position: 'fixed' }}>
            <Joyride
                continuous
                scrollToFirstStep
                floatingOptions={{
                    shiftOptions: { padding: 16 },
                }}
                locale={{
                    back: t('generic.misc.back'),
                    close: t('generic.actions.close'),
                    last: t('generic.misc.done'),
                    next: t('generic.misc.next'),
                    open: t('generic.actions.open'),
                    skip: t('generic.misc.skip'),
                }}
                onEvent={handleJoyrideEvent}
                options={{
                    buttons: ['close', 'primary', 'skip'],
                    closeButtonAction: 'skip',
                    primaryColor: BRAND_COLORS[5],
                    scrollOffset: 24,
                    showProgress: true,
                }}
                run={shouldRun}
                stepIndex={stepIndex}
                steps={steps}
                styles={{
                    buttonBack: {
                        outlineColor,
                    },
                    buttonClose: {
                        outlineColor,
                    },
                    buttonPrimary: {
                        outlineColor,
                    },
                    buttonSkip: {
                        outlineColor,
                    },
                }}
            />
        </div>
    );
};
