import { en } from "./en";
import { ptBR } from "./ptBR";

export type Locale = "en" | "pt-BR";

export function getInitialLocale(): Locale {
  if (typeof window === "undefined") return "en";

  const browserLang = navigator.language;

  if (browserLang.startsWith("pt")) {
    return "pt-BR";
  }

  return "en";
}

export const translations = {
  en,
  "pt-BR": ptBR,
};

export type TranslationKey = keyof typeof en;

export function t(key: TranslationKey, locale: Locale): string {
  return translations[locale][key] ?? translations["en"][key] ?? key;
}
