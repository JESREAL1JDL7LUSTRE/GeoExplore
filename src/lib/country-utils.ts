export type Country = {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  capital?: string[];
  population?: number;
  area?: number;
  region?: string;
  subregion?: string;
  borders?: string[];
  maps?: {
    googleMaps?: string;
  };
  flags?: {
    svg?: string;
    png?: string;
    alt?: string;
  };
  languages?: Record<string, string>;
};

export type EndpointType =
  | "all"
  | "name"
  | "full-name"
  | "code"
  | "codes"
  | "currency"
  | "language"
  | "capital"
  | "region"
  | "subregion"
  | "demonym"
  | "translation"
  | "independent";

export const API_BASE = "https://restcountries.com/v3.1";

export const COUNTRY_FIELDS =
  "name,capital,population,area,region,subregion,flags,borders,maps,languages,cca3";

export const ALL_COUNTRIES_FIELDS =
  "name,capital,population,area,region,flags,borders,maps,languages,cca3";

export function buildEndpointUrl(
  endpoint: EndpointType,
  query: string,
  status: boolean,
) {
  const encoded = encodeURIComponent(query.trim());

  switch (endpoint) {
    case "all":
      return `${API_BASE}/all?fields=${ALL_COUNTRIES_FIELDS}`;
    case "name":
      return `${API_BASE}/name/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "full-name":
      return `${API_BASE}/name/${encoded}?fullText=true&fields=${COUNTRY_FIELDS}`;
    case "code":
      return `${API_BASE}/alpha/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "codes":
      return `${API_BASE}/alpha?codes=${encoded}&fields=${COUNTRY_FIELDS}`;
    case "currency":
      return `${API_BASE}/currency/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "language":
      return `${API_BASE}/lang/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "capital":
      return `${API_BASE}/capital/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "region":
      return `${API_BASE}/region/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "subregion":
      return `${API_BASE}/subregion/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "demonym":
      return `${API_BASE}/demonym/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "translation":
      return `${API_BASE}/translation/${encoded}?fields=${COUNTRY_FIELDS}`;
    case "independent":
      return `${API_BASE}/independent?status=${status}&fields=${COUNTRY_FIELDS}`;
    default:
      return `${API_BASE}/all?fields=${COUNTRY_FIELDS}`;
  }
}

export function formatNumber(value?: number) {
  if (value === undefined) return "N/A";
  return new Intl.NumberFormat().format(value);
}

export function firstCapital(country: Country) {
  return country.capital?.[0] ?? "N/A";
}

export function filterDisplayedCountries(
  countries: Country[],
  nameSearch: string,
  languageSearch: string,
  regionFilter: string,
) {
  const normalizedName = nameSearch.trim().toLowerCase();
  const normalizedLanguage = languageSearch.trim().toLowerCase();

  return countries.filter((country) => {
    const matchesName =
      normalizedName.length === 0 ||
      country.name.common.toLowerCase().includes(normalizedName) ||
      country.name.official.toLowerCase().includes(normalizedName);

    const matchesLanguage =
      normalizedLanguage.length === 0 ||
      Object.values(country.languages ?? {}).some((language) =>
        language.toLowerCase().includes(normalizedLanguage),
      );

    const matchesRegion =
      regionFilter === "all" ||
      country.region?.toLowerCase() === regionFilter.toLowerCase();

    return matchesName && matchesLanguage && matchesRegion;
  });
}

export function sortCountriesByPopulation(
  countries: Country[],
  sortOrder: string,
) {
  if (sortOrder === "population-desc") {
    return [...countries].sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
  }

  if (sortOrder === "population-asc") {
    return [...countries].sort((a, b) => (a.population ?? 0) - (b.population ?? 0));
  }

  return countries;
}