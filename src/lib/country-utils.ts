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

type EndpointConfig = {
  path: (query: string, status: boolean) => string;
  fields?: string;
};

const endpointConfigMap: Record<EndpointType, EndpointConfig> = {
  all: {
    path: () => "/all",
    fields: ALL_COUNTRIES_FIELDS,
  },
  name: {
    path: (query) => `/name/${query}`,
    fields: COUNTRY_FIELDS,
  },
  "full-name": {
    path: (query) => `/name/${query}?fullText=true`,
    fields: COUNTRY_FIELDS,
  },
  code: {
    path: (query) => `/alpha/${query}`,
    fields: COUNTRY_FIELDS,
  },
  codes: {
    path: (query) => `/alpha?codes=${query}`,
    fields: COUNTRY_FIELDS,
  },
  currency: {
    path: (query) => `/currency/${query}`,
    fields: COUNTRY_FIELDS,
  },
  language: {
    path: (query) => `/lang/${query}`,
    fields: COUNTRY_FIELDS,
  },
  capital: {
    path: (query) => `/capital/${query}`,
    fields: COUNTRY_FIELDS,
  },
  region: {
    path: (query) => `/region/${query}`,
    fields: COUNTRY_FIELDS,
  },
  subregion: {
    path: (query) => `/subregion/${query}`,
    fields: COUNTRY_FIELDS,
  },
  demonym: {
    path: (query) => `/demonym/${query}`,
    fields: COUNTRY_FIELDS,
  },
  translation: {
    path: (query) => `/translation/${query}`,
    fields: COUNTRY_FIELDS,
  },
  independent: {
    path: (_, status) => `/independent?status=${status}`,
    fields: COUNTRY_FIELDS,
  },
};

export function buildEndpointUrl(
  endpoint: EndpointType,
  query: string,
  status: boolean,
) {
  const config = endpointConfigMap[endpoint] ?? endpointConfigMap.all;
  const encoded = encodeURIComponent(query.trim());
  const basePath = config.path(encoded, status);
  const fieldSeparator = basePath.includes("?") ? "&" : "?";
  const fields = config.fields ? `${fieldSeparator}fields=${config.fields}` : "";

  return `${API_BASE}${basePath}${fields}`;
}

export function formatNumber(value?: number) {
  return value == null ? "N/A" : new Intl.NumberFormat().format(value);
}

export function firstCapital(country: Country) {
  return country.capital?.[0] ?? "N/A";
}

function normalize(text: string) {
  return text.trim().toLowerCase();
}

export function filterDisplayedCountries(
  countries: Country[],
  nameSearch: string,
  languageSearch: string,
  regionFilter: string,
) {
  const name = normalize(nameSearch);
  const language = normalize(languageSearch);
  const region = normalize(regionFilter);

  return countries.filter((country) => {
    const countryName = country.name.common.toLowerCase();

    const matchesName = name.length === 0 || countryName.includes(name);

    const matchesLanguage =
      language.length === 0 ||
      Object.values(country.languages ?? {}).some((countryLanguage) =>
        countryLanguage.toLowerCase().includes(language),
      );

    const matchesRegion =
      region === "all" || country.region?.toLowerCase() === region;

    return matchesName && matchesLanguage && matchesRegion;
  });
}

export type SortableCountryField = "population" | "area";
export type SortOrder = "asc" | "desc";

export function sortCountries(
  countries: Country[],
  key: SortableCountryField,
  order: SortOrder,
) {
  return [...countries].sort((a, b) => {
    const valueA = a[key] ?? 0;
    const valueB = b[key] ?? 0;

    return order === "asc" ? valueA - valueB : valueB - valueA;
  });
}

export function sortCountriesByPopulation(
  countries: Country[],
  sortOrder: string,
) {
  if (sortOrder === "population-desc") {
    return sortCountries(countries, "population", "desc");
  }

  if (sortOrder === "population-asc") {
    return sortCountries(countries, "population", "asc");
  }

  return countries;
}