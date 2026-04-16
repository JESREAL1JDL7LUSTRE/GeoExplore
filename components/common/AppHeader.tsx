"use client";

import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export function AppHeader({ isDarkMode, onToggleTheme }: AppHeaderProps) {
  return (
    <header className="geo-panel flex flex-col gap-5 p-7 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-1">
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <span className="geo-accent-dot" />
          <span className="geo-label">World Atlas</span>
        </div>
        <h1 className="geo-title" style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}>
          GeoExplore
        </h1>
        <p style={{ fontSize: "0.875rem", color: "var(--geo-muted)", marginTop: "4px", fontWeight: 300 }}>
          Explore countries using REST Countries API endpoints.
        </p>
      </div>

      <Button variant="outline" onClick={onToggleTheme} className="geo-theme-toggle">
        {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </Button>
    </header>
  );
}