import type { AdsModule } from './ads';

export function getAdsModule(): AdsModule | null {
  return null;
}

export function getBannerAdUnitId(): string | null {
  return null;
}

export async function showInterstitialAd(): Promise<void> {
  return undefined;
}

export async function showHintAd(): Promise<void> {
  return showInterstitialAd();
}
