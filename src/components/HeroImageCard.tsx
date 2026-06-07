import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { mysteryColors, mysteryRadii, mysteryShadows, mysterySpacing, mysteryTypography } from '../theme';

type HeroImageCardProps = {
  source: ImageSourcePropType;
  title: string;
  subtitle: string;
  height: number;
  cinematic: boolean;
};

export function HeroImageCard({ source, title, subtitle, height = 190, cinematic }: HeroImageCardProps) {
  return (
    <ImageBackground source={source} resizeMode="cover" style={[styles.wrap, cinematic && styles.cinematic, { minHeight: height }]} imageStyle={styles.image}>
      <LinearGradient colors={['rgba(7,16,20,0.02)', 'rgba(7,16,20,0.34)', 'rgba(7,16,20,0.92)']} style={StyleSheet.absoluteFill} />
      <View style={[styles.copy, cinematic && styles.cinematicCopy]}>
        <Text style={[styles.title, cinematic && styles.cinematicTitle]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, cinematic && styles.cinematicSubtitle]}>{subtitle}</Text> : null}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: mysteryRadii.lg,
    overflow: 'hidden',
    borderWidth: 0.6,
    borderColor: 'rgba(226, 194, 117, 0.38)',
    justifyContent: 'flex-end',
    ...mysteryShadows.panel,
  },
  cinematic: {
    borderRadius: mysteryRadii.xl,
  },
  image: {
    borderRadius: mysteryRadii.lg,
  },
  copy: {
    padding: mysterySpacing.lg,
  },
  cinematicCopy: {
    padding: mysterySpacing.xl,
  },
  title: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontSize: mysteryTypography.h1,
    fontWeight: '900',
  },
  cinematicTitle: {
    fontSize: 34,
    lineHeight: 38,
  },
  subtitle: {
    color: mysteryColors.muted,
    marginTop: mysterySpacing.xs,
    lineHeight: 20,
  },
  cinematicSubtitle: {
    color: mysteryColors.cream,
    maxWidth: 320,
  },
});
