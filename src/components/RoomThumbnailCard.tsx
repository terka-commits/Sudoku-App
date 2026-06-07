import { LinearGradient } from 'expo-linear-gradient';
import { ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { mysteryColors, mysteryRadii, mysterySpacing, mysteryTypography } from '../theme';

type RoomThumbnailCardProps = {
  source: ImageSourcePropType;
  title?: string;
  locked?: boolean;
};

export function RoomThumbnailCard({ source, title, locked }: RoomThumbnailCardProps) {
  return (
    <ImageBackground source={source} resizeMode="contain" style={styles.wrap} imageStyle={styles.image}>
      <LinearGradient
        colors={locked ? ['rgba(7,16,20,0.5)', 'rgba(7,16,20,0.88)'] : ['rgba(7,16,20,0.08)', 'rgba(7,16,20,0.52)']}
        style={StyleSheet.absoluteFill}
      />
      {locked ? <View style={styles.lockSheen} /> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(2, 6, 8, 0.58)',
    justifyContent: 'flex-end',
    borderRadius: mysteryRadii.md,
    borderWidth: 0,
    flex: 1,
    height: '100%',
    overflow: 'hidden',
    width: '100%',
  },
  image: {
    borderRadius: mysteryRadii.md,
  },
  lockSheen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderColor: 'rgba(184, 170, 144, 0.16)',
    borderWidth: 1,
  },
  title: {
    color: mysteryColors.cream,
    fontFamily: mysteryTypography.serif,
    fontWeight: '900',
    padding: mysterySpacing.sm,
  },
});
