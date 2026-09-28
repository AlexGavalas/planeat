import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type EventHandler, Joyride } from 'react-joyride';

import { BRAND_COLORS } from '~constants/colors';
import { useLocalizedPath } from '~hooks/use-localized-path';
import { useProfile } from '~hooks/use-profile';

import { useSteps } from './helpers';

const outlineColor = BRAND_COLORS[7];

export const Onboarding = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const localize = useLocalizedPath();
    const pathname = usePathname();
    const { profile, updateProfile } = useProfile();
    const [shouldRun, setShouldRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [hasTourEnded, setHasTourEnded] = useState(false);
    const [isBrowser, setIsBrowser] = useState(false);

    const steps = useSteps();

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    useEffect(() => {
        if (isBrowser && !hasTourEnded) {
            setShouldRun(true);
        }
    }, [isBrowser, hasTourEnded, pathname]);

    const handleJoyrideEvent = useCallback<EventHandler>(
        ({ type, step, action }) => {
            if (type === 'step:after' && action === 'next') {
                setStepIndex((p) => p + 1);
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
        },
        [router, updateProfile, localize],
    );

    if (!isBrowser || profile?.has_completed_onboarding) {
        return null;
    }

    return (
        <div style={{ position: 'fixed' }}>
            <Joyride
                continuous
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
                    showProgress: true,
                    skipScroll: true,
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
