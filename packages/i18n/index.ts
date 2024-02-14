"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { useTranslation as useTranslationOrg } from "next-i18next";

type TranslationNamespace =
  | "guest-app"
  | "landing-page"
  | "landing-signup"
  | "mobile-portal"
  | "portal";

export const fallbackLng = "en";
export const defaultNS: TranslationNamespace = "guest-app";
export const cookieName = "i18next";

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    fallbackNS: defaultNS,
    defaultNS,
    ns,
  };
}

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(
    resourcesToBackend(
      (language, namespace) => import(`translations/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    initImmediate: false,
    detection: {
      order: ["htmlTag"],
    },
  });

export function useTranslation({ ns }: { ns: TranslationNamespace; }) {
  return useTranslationOrg(ns, {
    i18n: i18next,
  });
}
