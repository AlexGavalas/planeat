import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Joyride from 'react-joyride';

import { BRAND_COLORS } from '~constants/colors';
import { useProfile } from '~hooks/use-profile';

import { useSteps } from './helpers';

const outlineColor = BRAND_COLORS[7];

export const Onboarding = () => {
    const { t } = useTranslation();
    const router = useRouter();
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
    }, [isBrowser, hasTourEnded, router.pathname]);

    if (!isBrowser || profile?.has_completed_onboarding) {
        return null;
    }

    return (
        <div style={{ position: 'fixed' }}>
            <Joyride
                continuous
                disableScrolling
                hideBackButton
                showProgress
                showSkipButton
                callback={({ type, step, action }) => {
                    if (type === 'step:after' && action === 'next') {
                        setStepIndex((p) => p + 1);
                    }

                    if (
                        type === 'step:after' &&
                        action === 'next' &&
                        step.target === '#weight-container'
                    ) {
                        setShouldRun(false);
                        router.push('/meal-plan').catch(console.error);
                    } else if (
                        type === 'step:after' &&
                        action === 'next' &&
                        step.target === '#meal-plan-container'
                    ) {
                        setShouldRun(false);
                        router.push('/settings').catch(console.error);
                    } else if (type === 'tour:end') {
                        setShouldRun(false);
                        setHasTourEnded(true);

                        updateProfile({
                            hasCompletedOnboarding: true,
                            silent: true,
                        });
                    }
                }}
                locale={{
                    back: t('onboarding.labels.back'),
                    close: t('onboarding.labels.close'),
                    last: t('onboarding.labels.last'),
                    next: t('onboarding.labels.next'),
                    open: t('onboarding.labels.open'),
                    skip: t('onboarding.labels.skip'),
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
                    buttonNext: {
                        outlineColor,
                    },
                    buttonSkip: {
                        outlineColor,
                    },
                    options: {
                        primaryColor: BRAND_COLORS[5],
                    },
                }}
            />
        </div>
    );
};
