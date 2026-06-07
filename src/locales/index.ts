import { cs } from './cs';
import { en } from './en';

export const locales = {
  cs,
  en,
} as const;

export type SupportedLanguage = keyof typeof locales;
export type LocaleResources = typeof cs;

export const supportedLanguages = Object.keys(locales) as SupportedLanguage[];
export const defaultLanguage: SupportedLanguage = 'cs';

export function isSupportedLanguage(language: string | null | undefined): language is SupportedLanguage {
  return supportedLanguages.includes(language as SupportedLanguage);
}
