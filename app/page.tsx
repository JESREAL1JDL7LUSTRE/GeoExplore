"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  API_BASE,
  ALL_COUNTRIES_FIELDS,
  buildEndpointUrl,
  filterDisplayedCountries,
  firstCapital,
  formatNumber,
  sortCountriesByPopulation,
  type Country,
  type EndpointType,
} from "@/src/lib/country-utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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

  const openCountryDialog = (code: string) => {
    setSelectedCountryCode(code);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8">
        <header className="flex flex-col gap-4 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">GeoExplore</h1>
            <p className="text-sm text-muted-foreground">
              Explore countries using REST Countries API endpoints.
            </p>
          </div>

          <Button variant="outline" onClick={toggleTheme}>
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </header>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Endpoint Search</CardTitle>
            <CardDescription>
              Query REST Countries endpoints directly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Endpoint</label>
                <Select
                  value={endpointType}
                  onValueChange={(value) => setEndpointType(value as EndpointType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select endpoint" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="name">By Name</SelectItem>
                    <SelectItem value="full-name">Full Name</SelectItem>
                    <SelectItem value="code">By Code</SelectItem>
                    <SelectItem value="codes">List of Codes</SelectItem>
                    <SelectItem value="currency">By Currency</SelectItem>
                    <SelectItem value="language">By Language</SelectItem>
                    <SelectItem value="capital">By Capital</SelectItem>
                    <SelectItem value="region">By Region</SelectItem>
                    <SelectItem value="subregion">By Subregion</SelectItem>
                    <SelectItem value="demonym">By Demonym</SelectItem>
                    <SelectItem value="translation">By Translation</SelectItem>
                    <SelectItem value="independent">Independent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Query</label>
                <Input
                  value={endpointQuery}
                  onChange={(event) => setEndpointQuery(event.target.value)}
                  placeholder="e.g. peru, co, spanish, europe"
                  disabled={endpointType === "all" || endpointType === "independent"}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Independent Status</label>
                <Select
                  value={independentStatus ? "true" : "false"}
                  onValueChange={(value) => setIndependentStatus(value === "true")}
                  disabled={endpointType !== "independent"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">true</SelectItem>
                    <SelectItem value="false">false</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => void runEndpointSearch()}>Run Endpoint</Button>
              <Button
                variant="outline"
                onClick={() => void fetchCountries(`${API_BASE}/all?fields=${ALL_COUNTRIES_FIELDS}`)}
              >
                Reset to All Countries
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Quick Filters</CardTitle>
            <CardDescription>
              Filter and sort the displayed countries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Country Name</label>
                <Input
                  value={nameSearch}
                  onChange={(event) => setNameSearch(event.target.value)}
                  placeholder="Type a country name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Search Language</label>
                <Input
                  value={languageSearch}
                  onChange={(event) => setLanguageSearch(event.target.value)}
                  placeholder="e.g. Spanish"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Region</label>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regionOptions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region === "all" ? "All Regions" : region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort by Population</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose sort order" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Sorting</SelectItem>
                    <SelectItem value="population-desc">High to Low</SelectItem>
                    <SelectItem value="population-asc">Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <Card className="rounded-2xl">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
              <p className="text-sm">Loading country data...</p>
            </CardContent>
          </Card>
        ) : null}

        {error ? (
          <Card className="rounded-2xl border-destructive/40 bg-destructive/5">
            <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {displayedCountries.map((country) => (
            <Card
              key={country.cca3}
              className="overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <CardTitle className="line-clamp-1 text-lg">{country.name.common}</CardTitle>
                <CardDescription>{country.region ?? "Unknown Region"}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {country.flags?.png ? (
                  <Image
                    src={country.flags.png}
                    alt={country.flags.alt ?? `${country.name.common} flag`}
                    className="h-40 w-full rounded-xl object-cover"
                    width={320}
                    height={180}
                    unoptimized
                  />
                ) : null}

                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    Capital: <span className="font-medium text-foreground">{firstCapital(country)}</span>
                  </p>
                  <p>
                    Population:{" "}
                    <span className="font-medium text-foreground">
                      {formatNumber(country.population)}
                    </span>
                  </p>
                  <p>
                    Area:{" "}
                    <span className="font-medium text-foreground">
                      {formatNumber(country.area)} km²
                    </span>
                  </p>
                </div>

                <Button className="w-full" onClick={() => openCountryDialog(country.cca3)}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
            {selectedCountry ? (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedCountry.name.common}</DialogTitle>
                  <DialogDescription>
                    Detailed country information
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  {selectedCountry.flags?.svg ? (
                    <Image
                      src={selectedCountry.flags.svg}
                      alt={selectedCountry.flags.alt ?? `${selectedCountry.name.common} flag`}
                      className="h-auto w-full rounded-xl border"
                      width={640}
                      height={400}
                      unoptimized
                    />
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Card>
                      <CardContent className="space-y-2 p-4 text-sm">
                        <p>
                          <span className="font-semibold">Official Name:</span>{" "}
                          {selectedCountry.name.official}
                        </p>
                        <p>
                          <span className="font-semibold">Capital:</span>{" "}
                          {firstCapital(selectedCountry)}
                        </p>
                        <p>
                          <span className="font-semibold">Population:</span>{" "}
                          {formatNumber(selectedCountry.population)}
                        </p>
                        <p>
                          <span className="font-semibold">Area:</span>{" "}
                          {formatNumber(selectedCountry.area)} km²
                        </p>
                        <p>
                          <span className="font-semibold">Region:</span>{" "}
                          {selectedCountry.region ?? "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Subregion:</span>{" "}
                          {selectedCountry.subregion ?? "N/A"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="space-y-3 p-4 text-sm">
                        <div>
                          <p className="mb-2 font-semibold">Languages</p>
                          <div className="flex flex-wrap gap-2">
                            {Object.values(selectedCountry.languages ?? {}).length > 0 ? (
                              Object.values(selectedCountry.languages ?? {}).map((language) => (
                                <Badge key={language} variant="secondary">
                                  {language}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted-foreground">N/A</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <p className="mb-2 font-semibold">Border Countries</p>
                          {selectedCountry.borders && selectedCountry.borders.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedCountry.borders.map((borderCode) => {
                                const borderCountry = countriesByCode.get(borderCode);

                                return (
                                  <Button
                                    key={borderCode}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedCountryCode(borderCode)}
                                  >
                                    {borderCountry?.name.common ?? borderCode}
                                  </Button>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-muted-foreground">No bordering countries.</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <a
                        href={selectedCountry.maps?.googleMaps ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on Map
                      </a>
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle>Country Details</DialogTitle>
                  <DialogDescription>No country selected.</DialogDescription>
                </DialogHeader>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}