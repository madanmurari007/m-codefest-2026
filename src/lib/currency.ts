/**
 * Country → ISO-4217 currency helpers for AI-generated hotel cards.
 *
 * The chat LLM is asked to return the local currency for each property, but
 * we defend with a server-side lookup so the UI always renders the right
 * symbol even if the model omits or hallucinates a currency code.
 */

/** Set of ISO 4217 codes we consider safe to surface in the UI. */
export const SUPPORTED_CURRENCIES = new Set([
  "USD", "EUR", "GBP", "JPY", "AUD", "NZD", "CAD", "CHF", "SEK", "NOK",
  "DKK", "ISK", "PLN", "CZK", "HUF", "RON", "BGN", "HRK",
  "MXN", "BRL", "ARS", "CLP", "COP", "PEN",
  "ZAR", "EGP", "MAD", "KES", "TZS", "NGN",
  "CNY", "HKD", "TWD", "SGD", "THB", "MYR", "IDR", "PHP", "VND", "INR",
  "AED", "SAR", "QAR", "ILS", "TRY",
  "RUB",
  "MUR", "MVR", "SCR", "BDT", "LKR", "KRW",
]);

/**
 * Best-effort mapping from country name (English) to ISO currency code.
 * Names align with what we ask the LLM to return ("Italy", "Japan", etc.).
 */
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  // North America
  "United States": "USD",
  "USA": "USD",
  "US": "USD",
  "Canada": "CAD",
  "Mexico": "MXN",
  // Caribbean / Central America
  "Bahamas": "USD",
  "Barbados": "USD",
  "Bermuda": "USD",
  "Cuba": "USD",
  "Dominican Republic": "USD",
  "Jamaica": "USD",
  "Saint Lucia": "USD",
  "Turks and Caicos": "USD",
  "British Virgin Islands": "USD",
  "Curacao": "USD",
  "Aruba": "USD",
  "Belize": "USD",
  "Costa Rica": "USD",
  "Panama": "USD",
  // South America
  "Brazil": "BRL",
  "Argentina": "ARS",
  "Chile": "CLP",
  "Colombia": "COP",
  "Peru": "PEN",
  "Ecuador": "USD",
  "Uruguay": "USD",
  // Europe — Eurozone
  "Austria": "EUR",
  "Belgium": "EUR",
  "Croatia": "EUR",
  "Cyprus": "EUR",
  "Estonia": "EUR",
  "Finland": "EUR",
  "France": "EUR",
  "Germany": "EUR",
  "Greece": "EUR",
  "Ireland": "EUR",
  "Italy": "EUR",
  "Latvia": "EUR",
  "Lithuania": "EUR",
  "Luxembourg": "EUR",
  "Malta": "EUR",
  "Monaco": "EUR",
  "Montenegro": "EUR",
  "Netherlands": "EUR",
  "Portugal": "EUR",
  "Slovakia": "EUR",
  "Slovenia": "EUR",
  "Spain": "EUR",
  "Vatican City": "EUR",
  // Europe — non-Euro
  "United Kingdom": "GBP",
  "UK": "GBP",
  "Scotland": "GBP",
  "England": "GBP",
  "Switzerland": "CHF",
  "Liechtenstein": "CHF",
  "Norway": "NOK",
  "Sweden": "SEK",
  "Denmark": "DKK",
  "Iceland": "ISK",
  "Poland": "PLN",
  "Czech Republic": "CZK",
  "Czechia": "CZK",
  "Hungary": "HUF",
  "Romania": "RON",
  "Bulgaria": "BGN",
  "Turkey": "TRY",
  "Russia": "RUB",
  // Middle East / Africa
  "United Arab Emirates": "AED",
  "UAE": "AED",
  "Saudi Arabia": "SAR",
  "Qatar": "QAR",
  "Oman": "USD",
  "Israel": "ILS",
  "Jordan": "USD",
  "Egypt": "EGP",
  "Morocco": "MAD",
  "Tunisia": "USD",
  "Kenya": "KES",
  "Tanzania": "TZS",
  "Botswana": "USD",
  "Namibia": "USD",
  "South Africa": "ZAR",
  "Nigeria": "NGN",
  // Indian Ocean
  "Maldives": "MVR",
  "Seychelles": "SCR",
  "Mauritius": "MUR",
  "Sri Lanka": "LKR",
  // Asia
  "China": "CNY",
  "Hong Kong": "HKD",
  "Taiwan": "TWD",
  "Singapore": "SGD",
  "Thailand": "THB",
  "Malaysia": "MYR",
  "Indonesia": "IDR",
  "Philippines": "PHP",
  "Vietnam": "VND",
  "Cambodia": "USD",
  "Laos": "USD",
  "India": "INR",
  "Nepal": "INR",
  "Bhutan": "INR",
  "Bangladesh": "BDT",
  "Japan": "JPY",
  "South Korea": "KRW",
  "Korea": "KRW",
  // Oceania
  "Australia": "AUD",
  "New Zealand": "NZD",
  "Fiji": "USD",
  "French Polynesia": "EUR",
  "Tahiti": "EUR",
  "Bora Bora": "EUR",
  "Samoa": "USD",
  "Cook Islands": "NZD",
};

/** Resolve a country (any casing) to an ISO 4217 currency code. */
export function currencyForCountry(country: string | undefined): string {
  if (!country) return "USD";
  const trimmed = country.trim();
  if (!trimmed) return "USD";
  // Exact match first.
  if (COUNTRY_TO_CURRENCY[trimmed]) return COUNTRY_TO_CURRENCY[trimmed];
  // Case-insensitive lookup.
  const ci = Object.keys(COUNTRY_TO_CURRENCY).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase(),
  );
  return ci ? COUNTRY_TO_CURRENCY[ci] : "USD";
}

/**
 * Returns the safest currency to render for a card. Prefers an LLM-supplied
 * code (when supported), otherwise derives one from the country.
 */
export function resolveCurrency(
  llmCurrency: string | undefined,
  country: string | undefined,
): string {
  const cleaned = (llmCurrency ?? "").trim().toUpperCase();
  if (cleaned && SUPPORTED_CURRENCIES.has(cleaned)) return cleaned;
  return currencyForCountry(country);
}
