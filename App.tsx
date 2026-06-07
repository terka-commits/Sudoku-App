import * as ScreenOrientation from 'expo-screen-orientation';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GameProgressProvider } from './src/hooks/useGameProgress';
import { LanguageProvider } from './src/i18n/LanguageProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { mysteryColors } from './src/theme';

export default function App() {
  const { width, height } = useWindowDimensions();
  const tablet = Math.min(width, height) >= 600;

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const lockOrientation = async () => {
      try {
        if (tablet) {
          await ScreenOrientation.unlockAsync();
          return;
        }

        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch (error) {
        console.warn('Failed to configure screen orientation.', error);
      }
    };

    void lockOrientation();
  }, [tablet]);

  return (
    <View style={styles.root}>
      <LanguageProvider>
        <GameProgressProvider>
          <StatusBar style="light" backgroundColor={mysteryColors.midnight} />
          <AppNavigator />
        </GameProgressProvider>
      </LanguageProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: mysteryColors.midnight,
  },
});
