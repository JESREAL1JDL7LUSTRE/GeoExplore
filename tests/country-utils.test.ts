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


describe("buildEndpointUrl", () => {
 test("creates region endpoint correctly", () => {
   const url = buildEndpointUrl("region", "asia", true);
   expect(url).toContain("/region/asia");
   expect(url).toContain("fields=");
 });
});


describe("formatNumber", () => {
 test("formats population correctly", () => {
   expect(formatNumber(115559009)).toBe("115,559,009");
 });


 test("returns N/A for undefined", () => {
   expect(formatNumber(undefined)).toBe("N/A");
 });
});


describe("firstCapital", () => {
 test("returns first capital", () => {
   expect(firstCapital(mockCountries[0])).toBe("Manila");
 });
});


describe("filterDisplayedCountries", () => {
 test("filters by name", () => {
   const result = filterDisplayedCountries(mockCountries, "jap", "", "all");
   expect(result).toHaveLength(1);
 });


 test("filters by language", () => {
   const result = filterDisplayedCountries(mockCountries, "", "French", "all");
   expect(result).toHaveLength(1);
 });


 test("filters by region", () => {
   const result = filterDisplayedCountries(mockCountries, "", "", "Asia");
   expect(result).toHaveLength(2);
 });
});


describe("sortCountriesByPopulation", () => {
 test("sorts descending", () => {
   const result = sortCountriesByPopulation(mockCountries, "population-desc");
   expect(result.map(c => c.name.common)).toEqual([
     "Japan",
     "Philippines",
     "Canada",
   ]);
 });
});
