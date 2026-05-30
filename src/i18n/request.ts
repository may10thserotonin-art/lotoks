import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  const supportedLocales = ['en', 'fr', 'ar', 'yo', 'sw'];
  const resolvedLocale = supportedLocales.includes(locale || '') ? locale : 'en';

  return {
    locale: resolvedLocale!,
    messages: (await import(`./messages/${resolvedLocale}.json`)).default,
  };
});
