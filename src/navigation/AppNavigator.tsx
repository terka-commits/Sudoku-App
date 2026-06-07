import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { colors, motionDurations, mysteryColors, useReducedMotion } from '../theme';
import { ChapterDetailScreen } from '../screens/ChapterDetailScreen';
import { ChapterRevealScreen } from '../screens/ChapterRevealScreen';
import { EvidenceScreen } from '../screens/EvidenceScreen';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { FinalScreen } from '../screens/FinalScreen';
import { HotelMapScreen } from '../screens/HotelMapScreen';
import { IntroScreen } from '../screens/IntroScreen';
import { IntroStoryScreen } from '../screens/IntroStoryScreen';
import { RewardScreen } from '../screens/RewardScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { SudokuScreen } from '../screens/SudokuScreen';
import { RootStackParamList } from './types';
import { canUseDevTools } from '../config/build';

declare const require: (moduleName: string) => any;

const Stack = createNativeStackNavigator<RootStackParamList>();
const DevAdminScreen = __DEV__ ? require('../screens/DevAdminScreen').DevAdminScreen : undefined;

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: mysteryColors.midnight,
    card: mysteryColors.midnight,
    text: colors.textPrimary,
    border: colors.border,
  },
};

export function AppNavigator() {
  const reducedMotion = useReducedMotion();

  return (
    <View style={styles.root}>
      <NavigationContainer theme={theme}>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: reducedMotion ? 'none' : 'simple_push',
            animationDuration: reducedMotion ? motionDurations.reduced : motionDurations.screenTransition,
            animationTypeForReplace: 'push',
            contentStyle: {
              backgroundColor: mysteryColors.midnight,
            },
            navigationBarColor: mysteryColors.midnight,
            statusBarBackgroundColor: mysteryColors.midnight,
            statusBarStyle: 'light',
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Intro" component={IntroScreen} />
          <Stack.Screen name="IntroStory" component={IntroStoryScreen} />
          <Stack.Screen name="HotelMap" component={HotelMapScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="ChapterDetail" component={ChapterDetailScreen} />
          <Stack.Screen name="Sudoku" component={SudokuScreen} />
          <Stack.Screen name="Reward" component={RewardScreen} />
          <Stack.Screen name="ChapterReveal" component={ChapterRevealScreen} />
          <Stack.Screen name="Evidence" component={EvidenceScreen} />
          <Stack.Screen name="Final" component={FinalScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          {canUseDevTools && DevAdminScreen ? <Stack.Screen name="DevAdmin" component={DevAdminScreen} /> : null}
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: mysteryColors.midnight,
  },
});
