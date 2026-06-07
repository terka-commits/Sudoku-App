import type { AdsModule } from './ads';

declare const require: (moduleName: string) => any;

let cachedAdsModule: AdsModule | null | undefined;

export function getAdsModule(): AdsModule | null {
  if (cachedAdsModule !== undefined) {
    return cachedAdsModule;
  }

  try {
    cachedAdsModule = require('react-native-google-mobile-ads');
  } catch {
    cachedAdsModule = null;
  }

  return cachedAdsModule ?? null;
}

export function getBannerAdUnitId(): string | null {
  return getAdsModule()?.TestIds.BANNER ?? null;
}

export async function showInterstitialAd(): Promise<void> {
  const ads = getAdsModule();

  if (!ads) {
    return;
  }

  const interstitial = ads.InterstitialAd.createForAdRequest(ads.TestIds.INTERSTITIAL, {
    requestNonPersonalizedAdsOnly: true,
  });

  await new Promise<void>((resolve) => {
    let settled = false;
    const unsubscribers: Array<() => void> = [];

    const finish = () => {
      if (settled) {
        return;
      }

      settled = true;
      clearTimeout(timeout);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      resolve();
    };

    const timeout = setTimeout(finish, 6000);

    unsubscribers.push(
      interstitial.addAdEventListener(ads.AdEventType.LOADED, () => {
        interstitial.show().catch(finish);
      }),
      interstitial.addAdEventListener(ads.AdEventType.CLOSED, finish),
      interstitial.addAdEventListener(ads.AdEventType.ERROR, finish),
    );

    interstitial.load();
  });
}

export async function showHintAd(): Promise<void> {
  return showInterstitialAd();
}
