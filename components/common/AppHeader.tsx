"use client";

import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  isDarkMode: boolean;
  isAuthenticated: boolean;
  onToggleTheme: () => void;
  onLoginClick: () => void;
  onLogout: () => void;
}

export function AppHeader({
  isDarkMode,
  isAuthenticated,
  onToggleTheme,
  onLoginClick,
  onLogout,
}: AppHeaderProps) {
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
        <p className="text-sm text-muted-foreground">
            Browse countries and explore REST Countries API data.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={onToggleTheme} className="geo-theme-toggle">
          {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </Button>

        {isAuthenticated ? (
          <Button variant="outline" onClick={onLogout}>
            Log out
          </Button>
        ) : (
          <Button onClick={onLoginClick}>Log in</Button>
        )}
      </div>
    </header>
  );
}