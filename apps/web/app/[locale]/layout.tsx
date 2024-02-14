import "./global.css";
import 'react-toastify/dist/ReactToastify.css';

import { ToastContainer } from 'react-toastify';
import { i18nConfig } from "@/i18nConfig";
import { dir } from "i18next";
import TranslationsProvider from "@/components/TranslationsProvider";
import initTranslations from "../i18n";

export function generateStaticParams() {
  return i18nConfig.locales.map(locale => ({ locale }));
}

export const metadata = {
  title: {
    template: '%s | Elgiz Global',
    default: 'Elgiz Global', // a default is required when creating a template
  },
  description:
    'Elgiz Global Hospitality Project',
  theme_color: "#261A56",
};

const i18nNamespaces = ["landing-page", "landing-signup"];

export default async function RootLayout({
  children,
  params: { locale }
}) {
  const { t, resources } = await initTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} dir={dir(locale)}>
      <body>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={locale}
          resources={resources}
        >
          {children}
        </TranslationsProvider>
        <ToastContainer />
      </body>
    </html>
  );
}
