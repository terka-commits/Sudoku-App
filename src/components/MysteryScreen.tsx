import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren, ReactNode } from 'react';
import { ImageBackground, ImageSourcePropType, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { mysteryColors, mysterySpacing } from '../theme';

type MysteryScreenProps = PropsWithChildren<{
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  cinematic?: boolean;
  backgroundSource?: ImageSourcePropType;
  fixedFooter?: ReactNode;
}>;

export function MysteryScreen({ children, scroll = true, contentStyle, cinematic, backgroundSource, fixedFooter }: MysteryScreenProps) {
  const content = <View style={[styles.content, cinematic && styles.cinematic, contentStyle]}>{children}</View>;
  const contentFrame = (
    <View style={styles.frame}>
      <SafeAreaView edges={fixedFooter ? ['top', 'left', 'right'] : undefined} style={styles.safe}>
        {scroll ? (
          <ScrollView style={styles.scroller} contentContainerStyle={styles.scroll}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
      {fixedFooter ? <View style={styles.fixedFooter}>{fixedFooter}</View> : null}
    </View>
  );
  const gradientScreenContent = (
    <>
      <View style={styles.lampGlow} />
      <View style={styles.blueGlow} />
      {contentFrame}
    </>
  );

  if (backgroundSource) {
    return (
      <ImageBackground source={backgroundSource} resizeMode="cover" style={styles.root} imageStyle={styles.backgroundImage}>
        <LinearGradient
          colors={['rgba(2, 6, 8, 0.72)', 'rgba(7, 16, 20, 0.62)', 'rgba(2, 6, 8, 0.88)']}
          locations={[0, 0.48, 1]}
          style={StyleSheet.absoluteFill}
        />
        {contentFrame}
      </ImageBackground>
    );
  }

  return (
    <LinearGradient
      colors={[mysteryColors.midnight, mysteryColors.night, mysteryColors.tealDark, mysteryColors.midnight]}
      locations={[0, 0.35, 0.72, 1]}
      style={styles.root}
    >
      {gradientScreenContent}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.96,
  },
  frame: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroller: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  fixedFooter: {
    width: '100%',
  },
  content: {
    width: '100%',
    maxWidth: 880,
    alignSelf: 'center',
    padding: mysterySpacing.lg,
    gap: mysterySpacing.lg,
  },
  cinematic: {
    minHeight: '100%',
  },
  lampGlow: {
    position: 'absolute',
    top: -70,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(226, 194, 117, 0.16)',
  },
  blueGlow: {
    position: 'absolute',
    left: -120,
    bottom: 120,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(29, 70, 74, 0.34)',
  },
});
