import * as Localization from 'expo-localization';

export function getLocaleCurrency(): { currency: string; locale: string } {
  const region = Localization.getLocales()[0]?.regionCode ?? 'US';

  const CHF_REGIONS = ['CH', 'LI'];
  const EUR_REGIONS = ['DE', 'AT', 'FR', 'IT', 'ES', 'PT', 'NL', 'BE', 'LU', 'FI', 'IE', 'GR', 'SK', 'SI', 'EE', 'LV', 'LT', 'CY', 'MT'];

  if (CHF_REGIONS.includes(region)) {
    return { currency: 'CHF', locale: 'de-CH' };
  } else if (EUR_REGIONS.includes(region)) {
    return { currency: 'EUR', locale: 'de-DE' };
  } else {
    return { currency: 'USD', locale: 'en-US' };
  }
}

export function formatCurrency(amount: number): string {
  const { locale } = getLocaleCurrency();
  return amount.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export function getCurrencySymbol(): string {
  const { currency } = getLocaleCurrency();
  return currency;
}
