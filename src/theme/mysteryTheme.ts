import { Platform } from 'react-native';

export const mysteryColors = {
  midnight: '#071014',
  night: '#0B141A',
  ink: '#101820',
  tealDark: '#10272A',
  teal: '#143337',
  tealSoft: '#1D464A',
  gold: '#C9A75C',
  goldDeep: '#B89045',
  goldLight: '#E2C275',
  cream: '#F3E7CC',
  muted: '#B8AA90',
  paper: '#EFE3C8',
  paperDeep: '#E8D7B5',
  paperInk: '#2B2117',
  wine: '#8A3E3E',
  success: '#2E6B61',
  shadow: '#020608',
  line: 'rgba(201, 167, 92, 0.34)',
  lineStrong: 'rgba(226, 194, 117, 0.72)',
};

export const mysterySpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 44,
};

export const mysteryRadii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  round: 999,
};

export const mysteryTypography = {
  display: 42,
  title: 32,
  h1: 28,
  h2: 22,
  h3: 18,
  body: 16,
  small: 13,
  tiny: 11,
  serif: Platform.select({
    ios: 'Georgia',
    android: 'serif',
    web: 'Georgia, Times New Roman, serif',
    default: 'serif',
  }),
  sans: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
    default: 'sans-serif',
  }),
};

export const mysteryShadows = {
  panel:
    Platform.OS === 'web'
      ? { elevation: 12 }
      : {
          shadowColor: mysteryColors.shadow,
          shadowOffset: { width: 0, height: 18 },
          shadowOpacity: 0.42,
          shadowRadius: 24,
          elevation: 12,
        },
  glow:
    Platform.OS === 'web'
      ? { elevation: 8 }
      : {
          shadowColor: mysteryColors.gold,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.36,
          shadowRadius: 18,
          elevation: 8,
        },
};
