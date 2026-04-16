"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { firstCapital, formatNumber, type Country } from "@/src/lib/country-utils";

interface CountryDialogProps {
  isOpen: boolean;
  selectedCountry: Country | null;
  countriesByCode: Map<string, Country>;
  onOpenChange: (open: boolean) => void;
  onSelectBorderCountry: (code: string) => void;
}

export function CountryDialog({
  isOpen,
  selectedCountry,
  countriesByCode,
  onOpenChange,
  onSelectBorderCountry,
}: CountryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="geo-dialog-content max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {selectedCountry ? (
          <>
            <DialogHeader>
              <DialogTitle className="geo-card-title">{selectedCountry.name.common}</DialogTitle>
              <DialogDescription>Detailed country information</DialogDescription>
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
                <div className="geo-panel p-4 text-sm">
                  <p><span className="font-semibold">Official Name:</span> {selectedCountry.name.official}</p>
                  <p><span className="font-semibold">Capital:</span> {firstCapital(selectedCountry)}</p>
                  <p><span className="font-semibold">Population:</span> {formatNumber(selectedCountry.population)}</p>
                  <p><span className="font-semibold">Area:</span> {formatNumber(selectedCountry.area)} km²</p>
                  <p><span className="font-semibold">Region:</span> {selectedCountry.region ?? "N/A"}</p>
                  <p><span className="font-semibold">Subregion:</span> {selectedCountry.subregion ?? "N/A"}</p>
                </div>

                <div className="geo-panel p-4 text-sm space-y-3">
                  <div>
                    <p className="mb-2 font-semibold">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(selectedCountry.languages ?? {}).length > 0 ? (
                        Object.values(selectedCountry.languages ?? {}).map((language) => (
                          <Badge key={language} className="geo-badge">
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
                              className="geo-border-btn"
                              onClick={() => onSelectBorderCountry(borderCode)}
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
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="geo-map-btn">
                  <a
                    href={selectedCountry.maps?.googleMaps ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on Map
                  </a>
                </Button>
                <Button variant="outline" className="geo-btn-outline" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              </div>
            </div>
          </>
        ) : (
          <DialogHeader>
            <DialogTitle>Country Details</DialogTitle>
            <DialogDescription>No country selected.</DialogDescription>
          </DialogHeader>
        )}
      </DialogContent>
    </Dialog>
  );
}