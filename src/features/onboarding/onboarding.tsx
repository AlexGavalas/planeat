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
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);
    const [tourEnded, setTourEnded] = useState(false);
    const [isBrowser, setIsBrowser] = useState(false);

    const steps = useSteps();

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    useEffect(() => {
        if (isBrowser && !tourEnded) {
            setRun(true);
        }
    }, [isBrowser, tourEnded, router.pathname]);

    if (!isBrowser || profile?.has_completed_onboarding) {
        return null;
    }

    return (
        <div style={{ position: 'fixed' }}>
            <Joyride
                run={run}
                stepIndex={stepIndex}
                callback={({ type, step, action }) => {
                    if (type === 'step:after' && action === 'next') {
                        setStepIndex((p) => p + 1);
                    }

                    if (
                        type === 'step:after' &&
                        action === 'next' &&
                        step.target === '#weight-container'
                    ) {
                        setRun(false);
                        router.push('/meal-plan');
                    } else if (
                        type === 'step:after' &&
                        action === 'next' &&
                        step.target === '#meal-plan-container'
                    ) {
                        setRun(false);
                        router.push('/settings');
                    } else if (type === 'tour:end') {
                        setRun(false);
                        setTourEnded(true);

                        updateProfile({
                            hasCompletedOnboarding: true,
                            silent: true,
                        });
                    }
                }}
                continuous
                disableScrolling
                hideBackButton
                locale={{
                    close: t('onboarding.labels.close'),
                    next: t('onboarding.labels.next'),
                    open: t('onboarding.labels.open'),
                    skip: t('onboarding.labels.skip'),
                    back: t('onboarding.labels.back'),
                    last: t('onboarding.labels.last'),
                }}
                showSkipButton
                showProgress
                steps={steps}
                styles={{
                    options: {
                        primaryColor: BRAND_COLORS[5],
                    },
                    buttonNext: {
                        outlineColor,
                    },
                    buttonBack: {
                        outlineColor,
                    },
                    buttonSkip: {
                        outlineColor,
                    },
                    buttonClose: {
                        outlineColor,
                    },
                }}
            />
        </div>
    );
};
