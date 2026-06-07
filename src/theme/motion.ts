import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export const motionDurations = {
  screenTransition: 200,
  buttonPress: 100,
  cardInteraction: 160,
  smallFade: 150,
  rewardReveal: 520,
  introCinematic: 560,
  devPanel: 180,
  reduced: 1,
} as const;

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setReducedMotion(enabled);
      }
    });

    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReducedMotion);

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reducedMotion;
}
