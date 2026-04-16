"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SimpleCard } from "@/app/components/SimpleCard";

const API_BASE = "https://restcountries.com/v3.1";

type Country = {
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

type EndpointType =
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

const COUNTRY_FIELDS =
  "name,capital,population,area,region,subregion,flags,borders,maps,languages,cca3";
const ALL_COUNTRIES_FIELDS = "name,capital,population,area,region,flags,borders,maps,languages,cca3";

function buildEndpointUrl(endpoint: EndpointType, query: string, status: boolean) {
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

function formatNumber(value?: number) {
  if (value === undefined) {
    return "N/A";
  }

  return new Intl.NumberFormat().format(value);
}

function firstCapital(country: Country) {
  return country.capital?.[0] ?? "N/A";
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nameSearch, setNameSearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");

  const [endpointType, setEndpointType] = useState<EndpointType>("all");
  const [endpointQuery, setEndpointQuery] = useState("");
  const [independentStatus, setIndependentStatus] = useState(true);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const countriesByCode = useMemo(() => {
    return new Map(countries.map((country) => [country.cca3, country]));
  }, [countries]);

  const selectedCountry = useMemo(() => {
    if (!selectedCountryCode) {
      return null;
    }

    return countriesByCode.get(selectedCountryCode) ?? null;
  }, [countriesByCode, selectedCountryCode]);

  const regionOptions = useMemo(() => {
    return [
      "all",
      ...new Set(countries.map((country) => country.region).filter(Boolean) as string[]),
    ];
  }, [countries]);

  const displayedCountries = useMemo(() => {
    const normalizedName = nameSearch.trim().toLowerCase();
    const normalizedLanguage = languageSearch.trim().toLowerCase();

    let items = countries.filter((country) => {
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
        regionFilter === "all" || country.region?.toLowerCase() === regionFilter.toLowerCase();

      return matchesName && matchesLanguage && matchesRegion;
    });

    if (sortOrder === "population-desc") {
      items = [...items].sort((a, b) => (b.population ?? 0) - (a.population ?? 0));
    }

    if (sortOrder === "population-asc") {
      items = [...items].sort((a, b) => (a.population ?? 0) - (b.population ?? 0));
    }

    return items;
  }, [countries, languageSearch, nameSearch, regionFilter, sortOrder]);

  useEffect(() => {
    const saved = window.localStorage.getItem("geoexplore-theme");
    const nextMode = saved === "dark";
    setIsDarkMode(nextMode);
    document.documentElement.classList.toggle("dark", nextMode);
  }, []);

  const fetchCountries = async (url: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("No countries found for this query.");
      }

      const payload = (await response.json()) as Country | Country[];
      const result = Array.isArray(payload) ? payload : [payload];

      setCountries(result);
      setSelectedCountryCode(result[0]?.cca3 ?? null);
    } catch {
      setCountries([]);
      setSelectedCountryCode(null);
      setError("No country data found. Try another search.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchCountries(`${API_BASE}/all?fields=${ALL_COUNTRIES_FIELDS}`);
  }, []);

  const runEndpointSearch = async () => {
    const requiresQuery = endpointType !== "all" && endpointType !== "independent";

    if (requiresQuery && endpointQuery.trim().length === 0) {
      setError("This endpoint needs a query value.");
      return;
    }

    const url = buildEndpointUrl(endpointType, endpointQuery, independentStatus);
    await fetchCountries(url);
  };

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("geoexplore-theme", next ? "dark" : "light");
  };

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-6 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-zinc-900 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">GeoExplore</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Explore countries using REST Countries API endpoints.
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/20 dark:hover:bg-zinc-800"
          >
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </header>

        <SimpleCard title="Endpoint Search">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm">
              Endpoint
              <select
                value={endpointType}
                onChange={(event) => setEndpointType(event.target.value as EndpointType)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/20 dark:bg-zinc-800"
              >
                <option value="all">All Countries</option>
                <option value="name">By Name</option>
                <option value="full-name">Full Name</option>
                <option value="code">By Code</option>
                <option value="codes">List of Codes</option>
                <option value="currency">By Currency</option>
                <option value="language">By Language</option>
                <option value="capital">By Capital</option>
                <option value="region">By Region</option>
                <option value="subregion">By Subregion</option>
                <option value="demonym">By Demonym</option>
                <option value="translation">By Translation</option>
                <option value="independent">Independent</option>
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm md:col-span-2">
              Query
              <input
                value={endpointQuery}
                onChange={(event) => setEndpointQuery(event.target.value)}
                placeholder="e.g. peru, co, spanish, europe"
                disabled={endpointType === "all" || endpointType === "independent"}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-white/20 dark:bg-zinc-800 dark:disabled:bg-zinc-700"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Independent Status
              <select
                value={independentStatus ? "true" : "false"}
                onChange={(event) => setIndependentStatus(event.target.value === "true")}
                disabled={endpointType !== "independent"}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:border-white/20 dark:bg-zinc-800 dark:disabled:bg-zinc-700"
              >
                <option value="true">true</option>
                <option value="false">false</option>
              </select>
            </label>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={() => void runEndpointSearch()}
              className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
            >
              Run Endpoint
            </button>
            <button
              onClick={() => void fetchCountries(`${API_BASE}/all?fields=${ALL_COUNTRIES_FIELDS}`)}
              className="rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-zinc-100 dark:border-white/20 dark:hover:bg-zinc-800"
            >
              Reset to All Countries
            </button>
          </div>
        </SimpleCard>

        <SimpleCard title="Quick Filters">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="flex flex-col gap-1 text-sm">
              Search Country Name
              <input
                value={nameSearch}
                onChange={(event) => setNameSearch(event.target.value)}
                placeholder="Type a country name"
                className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/20 dark:bg-zinc-800"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Search Language
              <input
                value={languageSearch}
                onChange={(event) => setLanguageSearch(event.target.value)}
                placeholder="e.g. Spanish"
                className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/20 dark:bg-zinc-800"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Filter by Region
              <select
                value={regionFilter}
                onChange={(event) => setRegionFilter(event.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/20 dark:bg-zinc-800"
              >
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region === "all" ? "All Regions" : region}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm">
              Sort by Population
              <select
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 dark:border-white/20 dark:bg-zinc-800"
              >
                <option value="none">No Sorting</option>
                <option value="population-desc">High to Low</option>
                <option value="population-asc">Low to High</option>
              </select>
            </label>
          </div>
        </SimpleCard>

        {isLoading ? (
          <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white p-4 dark:border-white/15 dark:bg-zinc-900">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-800 dark:border-zinc-600 dark:border-t-zinc-200" />
            <p className="text-sm">Loading country data...</p>
          </div>
        ) : null}

        {error ? (
          <p className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {displayedCountries.map((country) => {
              const selected = selectedCountryCode === country.cca3;

              return (
                <button
                  key={country.cca3}
                  type="button"
                  onClick={() => setSelectedCountryCode(country.cca3)}
                  className="text-left"
                >
                  <SimpleCard
                    className={`h-full transition ${selected ? "ring-2 ring-zinc-800 dark:ring-zinc-200" : "hover:shadow-md"}`}
                    title={country.name.common}
                  >
                    {country.flags?.png ? (
                      <Image
                        src={country.flags.png}
                        alt={country.flags.alt ?? `${country.name.common} flag`}
                        className="mb-3 h-28 w-full rounded-md object-cover"
                        width={320}
                        height={180}
                        unoptimized
                      />
                    ) : null}
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      Capital: <span className="font-medium">{firstCapital(country)}</span>
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      Population: <span className="font-medium">{formatNumber(country.population)}</span>
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">
                      Area: <span className="font-medium">{formatNumber(country.area)} km2</span>
                    </p>
                  </SimpleCard>
                </button>
              );
            })}
          </div>

          <SimpleCard title={selectedCountry?.name.common ?? "Country Details"}>
            {selectedCountry ? (
              <div className="space-y-3">
                {selectedCountry.flags?.svg ? (
                  <Image
                    src={selectedCountry.flags.svg}
                    alt={selectedCountry.flags.alt ?? `${selectedCountry.name.common} flag`}
                    className="h-auto w-full rounded-md border border-black/10 dark:border-white/15"
                    width={640}
                    height={400}
                    unoptimized
                  />
                ) : null}

                <p className="text-sm">
                  <span className="font-semibold">Official:</span> {selectedCountry.name.official}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Capital:</span> {firstCapital(selectedCountry)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Population:</span> {formatNumber(selectedCountry.population)}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Area:</span> {formatNumber(selectedCountry.area)} km2
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Region:</span> {selectedCountry.region ?? "N/A"}
                </p>

                <div>
                  <h4 className="mb-2 text-sm font-semibold">Border Countries</h4>
                  {selectedCountry.borders && selectedCountry.borders.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedCountry.borders.map((borderCode) => {
                        const borderCountry = countriesByCode.get(borderCode);

                        return (
                          <button
                            key={borderCode}
                            onClick={() => setSelectedCountryCode(borderCode)}
                            className="rounded-full border border-black/10 px-3 py-1 text-xs font-medium hover:bg-zinc-100 dark:border-white/20 dark:hover:bg-zinc-800"
                          >
                            {borderCountry?.name.common ?? borderCode}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-600 dark:text-zinc-300">No bordering countries.</p>
                  )}
                </div>

                <a
                  href={selectedCountry.maps?.googleMaps ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                >
                  View on Map
                </a>
              </div>
            ) : (
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Select a country card to view details.
              </p>
            )}
          </SimpleCard>
        </section>
      </div>
    </div>
  );
}
