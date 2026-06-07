import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { ImageBackground, ImageSourcePropType, StyleSheet, ViewStyle } from 'react-native';

type MysteryImageBackgroundProps = PropsWithChildren<{
  source: ImageSourcePropType;
  style: ViewStyle;
  contentStyle: ViewStyle;
  overlay: 'dark' | 'strong' | 'none';
  resizeMode: 'cover' | 'contain' | 'stretch';
}>;

export function MysteryImageBackground({
  source,
  children,
  style,
  contentStyle,
  overlay = 'dark',
  resizeMode = 'cover',
}: MysteryImageBackgroundProps) {
  return (
    <ImageBackground source={source} resizeMode={resizeMode} style={[styles.image, style]} imageStyle={styles.imageRadius}>
      {overlay !== 'none' && (
        <LinearGradient
          colors={
            overlay === 'strong'
              ? ['rgba(7, 16, 20, 0.42)', 'rgba(7, 16, 20, 0.78)', 'rgba(7, 16, 20, 0.96)']
              : ['rgba(7, 16, 20, 0.18)', 'rgba(7, 16, 20, 0.48)', 'rgba(7, 16, 20, 0.78)']
          }
          style={StyleSheet.absoluteFill}
        />
      )}
      <>{children}</>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
  imageRadius: {
    borderRadius: 0,
  },
});
