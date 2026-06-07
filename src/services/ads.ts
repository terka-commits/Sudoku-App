import type React from 'react';

export type AdsModule = {
  AdEventType: {
    CLOSED: string;
    ERROR: string;
    LOADED: string;
  };
  BannerAd: React.ComponentType<any>;
  BannerAdSize: {
    ANCHORED_ADAPTIVE_BANNER: string;
    BANNER: string;
  };
  InterstitialAd: {
    createForAdRequest: (adUnitId: string, requestOptions: Record<string, unknown>) => {
      addAdEventListener: (type: string, listener: () => void) => () => void;
      load: () => void;
      show: () => Promise<void>;
    };
  };
  TestIds: {
    BANNER: string;
    INTERSTITIAL: string;
  };
};

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
