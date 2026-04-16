"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { firstCapital, formatNumber, type Country } from "@/src/lib/country-utils";

interface CountryCardProps {
  country: Country;
  animationIndex: number;
  onViewDetails: (code: string) => void;
}

export function CountryCard({ country, animationIndex, onViewDetails }: CountryCardProps) {
  return (
    <div
      className="geo-country-card"
      style={{ animationDelay: `${Math.min(animationIndex * 0.04, 0.6)}s` }}
    >
      <div className="geo-flag-wrap">
        {country.flags?.png ? (
          <Image
            src={country.flags.png}
            alt={country.flags.alt ?? `${country.name.common} flag`}
            className="h-full w-full"
            style={{ objectFit: "cover" }}
            width={320}
            height={168}
            unoptimized
          />
        ) : null}

        <div className="geo-flag-overlay" />

        {country.region ? (
          <span
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontSize: "0.65rem",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "3px 10px",
              borderRadius: "999px",
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {country.region}
          </span>
        ) : null}
      </div>

      <div
        style={{
          padding: "18px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          flex: 1,
        }}
      >
        <div>
          <h3
            className="geo-card-title"
            style={{
              fontSize: "1.05rem",
              lineHeight: 1.2,
              marginBottom: "2px",
              color: "var(--geo-text)",
            }}
          >
            {country.name.common}
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--geo-muted)", fontWeight: 300 }}>
            {firstCapital(country) !== "N/A" ? `Capital: ${firstCapital(country)}` : "No capital"}
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div className="geo-stat">
            <span className="geo-stat-label">Population</span>
            <span className="geo-stat-value">{formatNumber(country.population)}</span>
          </div>
          <div className="geo-stat">
            <span className="geo-stat-label">Area km²</span>
            <span className="geo-stat-value">{formatNumber(country.area)}</span>
          </div>
        </div>

        <Button
          className="geo-btn-primary w-full"
          style={{ marginTop: "auto" }}
          onClick={() => onViewDetails(country.cca3)}
        >
          View Details
        </Button>
      </div>
    </div>
  );
}