import { describe, expect, test } from "vitest";
import {
  buildEndpointUrl,
  formatNumber,
  firstCapital,
  filterDisplayedCountries,
  sortCountriesByPopulation,
  type Country,
} from "../src/lib/country-utils";

const mockCountries: Country[] = [
  {
    cca3: "PHL",
    name: { common: "Philippines", official: "Republic of the Philippines" },
    capital: ["Manila"],
    population: 115559009,
    region: "Asia",
    languages: { eng: "English", fil: "Filipino" },
  },
  {
    cca3: "JPN",
    name: { common: "Japan", official: "Japan" },
    capital: ["Tokyo"],
    population: 123294513,
    region: "Asia",
    languages: { jpn: "Japanese" },
  },
  {
    cca3: "CAN",
    name: { common: "Canada", official: "Canada" },
    capital: ["Ottawa"],
    population: 38929902,
    region: "Americas",
    languages: { eng: "English", fra: "French" },
  },
];

describe("country-utils", () => {
  test("buildEndpointUrl creates region endpoint correctly", () => {
    const url = buildEndpointUrl("region", "asia", true);
    expect(url).toContain("/region/asia");
    expect(url).toContain("fields=");
  });

  test("formatNumber returns formatted population", () => {
    expect(formatNumber(115559009)).toBe("115,559,009");
  });

  test("formatNumber returns N/A for undefined", () => {
    expect(formatNumber(undefined)).toBe("N/A");
  });

  test("firstCapital returns the first capital", () => {
    expect(firstCapital(mockCountries[0])).toBe("Manila");
  });

  test("filters countries by lowercase name search", () => {
    const result = filterDisplayedCountries(mockCountries, "jap", "", "all");
    expect(result).toHaveLength(1);
    expect(result[0].name.common).toBe("Japan");
  });

  test("filters countries by language", () => {
    const result = filterDisplayedCountries(mockCountries, "", "French", "all");
    expect(result).toHaveLength(1);
    expect(result[0].name.common).toBe("Canada");
  });

  test("filters countries by region", () => {
    const result = filterDisplayedCountries(mockCountries, "", "", "Asia");
    expect(result).toHaveLength(2);
  });

  test("sorts countries by population descending", () => {
    const result = sortCountriesByPopulation(mockCountries, "population-desc");
    expect(result.map((country) => country.name.common)).toEqual([
      "Japan",
      "Philippines",
      "Canada",
    ]);
  });
});