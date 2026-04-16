"use client";

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
import { type EndpointType } from "@/src/lib/country-utils";

interface EndpointSearchProps {
  endpointType: EndpointType;
  endpointQuery: string;
  independentStatus: boolean;
  onEndpointTypeChange: (value: EndpointType) => void;
  onEndpointQueryChange: (value: string) => void;
  onIndependentStatusChange: (value: boolean) => void;
  onRunSearch: () => void;
  onReset: () => void;
}

export function EndpointSearch({
  endpointType,
  endpointQuery,
  independentStatus,
  onEndpointTypeChange,
  onEndpointQueryChange,
  onIndependentStatusChange,
  onRunSearch,
  onReset,
}: EndpointSearchProps) {
  return (
    <Card className="geo-panel border-0 shadow-none rounded-2xl">
      <CardHeader className="pb-2 pt-6 px-7">
        <CardTitle className="geo-card-title" style={{ fontSize: "1.1rem" }}>
          Endpoint Search
        </CardTitle>
        <CardDescription style={{ fontSize: "0.8rem", color: "var(--geo-muted)" }}>
          Query REST Countries endpoints directly.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-7 pb-7 space-y-5">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="space-y-2">
            <label className="geo-label">Endpoint</label>
            <Select
              value={endpointType}
              onValueChange={(value) => onEndpointTypeChange(value as EndpointType)}
            >
              <SelectTrigger className="geo-input">
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
            <label className="geo-label">Query</label>
            <Input
              value={endpointQuery}
              onChange={(event) => onEndpointQueryChange(event.target.value)}
              placeholder="e.g. peru, co, spanish, europe"
              disabled={endpointType === "all" || endpointType === "independent"}
              className="geo-input"
            />
          </div>

          <div className="space-y-2">
            <label className="geo-label">Independent Status</label>
            <Select
              value={independentStatus ? "true" : "false"}
              onValueChange={(value) => onIndependentStatusChange(value === "true")}
              disabled={endpointType !== "independent"}
            >
              <SelectTrigger className="geo-input">
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
          <Button className="geo-btn-primary" onClick={onRunSearch}>
            Run Endpoint
          </Button>
          <Button variant="outline" className="geo-btn-outline" onClick={onReset}>
            Reset to All Countries
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}