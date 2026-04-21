"use client";

import { useEffect, useMemo, useState } from "react";
import {
  API_BASE,
  ALL_COUNTRIES_FIELDS,
  buildEndpointUrl,
  filterDisplayedCountries,
  sortCountriesByPopulation,
  type Country,
  type EndpointType,
} from "@/src/lib/country-utils";

import { AppHeader } from "@/components/common/AppHeader";
import { EndpointSearch } from "@/components/common/Endpointsearch";
import { QuickFilters } from "@/components/common/Quickfilters";
import { CountryCard } from "@/components/common/CountryCard";
import { CountryDialog } from "@/components/common/Countrydialog";
import { LoginForm } from "@/components/login-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { isAuthenticated, logout } from "@/src/lib/auth";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const countriesByCode = useMemo(() => {
    return new Map(countries.map((country) => [country.cca3, country]));
  }, [countries]);

  const selectedCountry = useMemo(() => {
    if (!selectedCountryCode) return null;
    return countriesByCode.get(selectedCountryCode) ?? null;
  }, [countriesByCode, selectedCountryCode]);

  const regionOptions = useMemo(() => {
    return [
      "all",
      ...new Set(countries.map((country) => country.region).filter(Boolean) as string[]),
    ];
  }, [countries]);

  const displayedCountries = useMemo(() => {
    if (!isUserAuthenticated) {
      return countries;
    }

    const filtered = filterDisplayedCountries(
      countries,
      nameSearch,
      languageSearch,
      regionFilter,
    );

    return sortCountriesByPopulation(filtered, sortOrder);
  }, [countries, languageSearch, nameSearch, regionFilter, sortOrder]);

  useEffect(() => {
    const saved = window.localStorage.getItem("geoexplore-theme");
    const nextMode = saved === "dark";
    setIsDarkMode(nextMode);
    document.documentElement.classList.toggle("dark", nextMode);

    const currentAuth = isAuthenticated();
    setIsUserAuthenticated(currentAuth);
  }, []);

  const requireAuth = () => {
    const authState = isAuthenticated();

    if (!authState) {
      setIsUserAuthenticated(false);
      setIsLoginDialogOpen(true);
      setError("Please log in to access GeoExplore features.");
      return false;
    }

    return true;
  };

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
    if (!requireAuth()) return;

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

  const openCountryDialog = (code: string) => {
    if (!requireAuth()) return;

    setSelectedCountryCode(code);
    setIsDialogOpen(true);
  };

  const handleLogout = () => {
    logout();
    setIsUserAuthenticated(false);
    setNameSearch("");
    setLanguageSearch("");
    setRegionFilter("all");
    setSortOrder("none");
    setEndpointType("all");
    setEndpointQuery("");
    setIndependentStatus(true);
    setSelectedCountryCode(null);
    setIsLoginDialogOpen(true);
    void fetchCountries(`${API_BASE}/all?fields=${ALL_COUNTRIES_FIELDS}`);
  };

  const handleLoginSuccess = () => {
    setIsUserAuthenticated(true);
    setError(null);
    setIsLoginDialogOpen(false);
  };

  return (
    <>
      <div className="geo-bg" aria-hidden="true" />

      <div className="min-h-screen text-foreground" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-7 px-4 py-8 md:px-8">
          <AppHeader
            isDarkMode={isDarkMode}
            isAuthenticated={isUserAuthenticated}
            onToggleTheme={toggleTheme}
            onLoginClick={() => setIsLoginDialogOpen(true)}
            onLogout={handleLogout}
          />

          <EndpointSearch
            endpointType={endpointType}
            endpointQuery={endpointQuery}
            independentStatus={independentStatus}
            disabled={!isUserAuthenticated}
            onEndpointTypeChange={setEndpointType}
            onEndpointQueryChange={setEndpointQuery}
            onIndependentStatusChange={setIndependentStatus}
            onRunSearch={() => void runEndpointSearch()}
            onReset={() => {
              if (!requireAuth()) return;
              void fetchCountries(`${API_BASE}/all?fields=${ALL_COUNTRIES_FIELDS}`);
            }}
          />

          <QuickFilters
            nameSearch={nameSearch}
            languageSearch={languageSearch}
            regionFilter={regionFilter}
            sortOrder={sortOrder}
            regionOptions={regionOptions}
            disabled={!isUserAuthenticated}
            onNameSearchChange={setNameSearch}
            onLanguageSearchChange={setLanguageSearch}
            onRegionFilterChange={setRegionFilter}
            onSortOrderChange={setSortOrder}
          />

          {isLoading ? (
            <div className="geo-panel flex items-center gap-3 p-5">
              <div className="geo-spinner" />
              <p style={{ fontSize: "0.875rem", color: "var(--geo-muted)" }}>
                Loading country data…
              </p>
            </div>
          ) : null}

          {error ? (
            <div
              className="geo-error p-5"
              style={{ display: "flex", alignItems: "center", gap: "10px", borderRadius: "14px" }}
            >
              <span style={{ fontSize: "1.1rem" }}>⚠️</span>
              <p style={{ fontSize: "0.875rem" }}>{error}</p>
            </div>
          ) : null}

          {!isLoading && displayedCountries.length > 0 && (
            <div>
              <div className="geo-section-bar">
                <span
                  className="geo-card-title"
                  style={{ fontSize: "1.05rem", color: "var(--geo-text)" }}
                >
                  Countries
                </span>
                <span className="geo-count-badge">{displayedCountries.length}</span>
              </div>

              <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {displayedCountries.map((country, i) => (
                  <CountryCard
                    key={country.cca3}
                    country={country}
                    animationIndex={i}
                    onViewDetails={openCountryDialog}
                  />
                ))}
              </section>
            </div>
          )}

          <CountryDialog
            isOpen={isDialogOpen}
            selectedCountry={selectedCountry}
            countriesByCode={countriesByCode}
            onOpenChange={setIsDialogOpen}
            onSelectBorderCountry={setSelectedCountryCode}
          />

          <Dialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Sign in to continue</DialogTitle>
                <DialogDescription>
                  Enter your token to access search, filters, and country details.
                </DialogDescription>
              </DialogHeader>
              <LoginForm onSuccess={handleLoginSuccess} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}