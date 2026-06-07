import { LinearGradient } from 'expo-linear-gradient';
import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

type ScreenProps = PropsWithChildren<{
  scroll: boolean;
  contentStyle: ViewStyle;
}>;

export function Screen({ children, scroll = true, contentStyle }: ScreenProps) {
  const content = <View style={[styles.content, contentStyle]}>{children}</View>;

  return (
    <LinearGradient colors={[colors.background, colors.backgroundSoft, colors.background]} style={styles.root}>
      <SafeAreaView style={styles.safe}>
        {scroll ? <ScrollView contentContainerStyle={styles.scroll}>{content}</ScrollView> : content}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  content: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    padding: spacing.lg,
    gap: spacing.lg,
  },
});
