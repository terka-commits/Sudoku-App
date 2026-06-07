import { StyleSheet, View } from 'react-native';
import { getAdsModule, getBannerAdUnitId } from '../services/ads';
import { mysterySpacing } from '../theme';

export function AdBanner() {
  const ads = getAdsModule();
  const unitId = getBannerAdUnitId();

  if (!ads || !unitId) {
    return null;
  }

  const BannerAd = ads.BannerAd;

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={unitId}
        size={ads.BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    paddingTop: mysterySpacing.xs,
    width: '100%',
  },
});
