"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

const vehicles = [
  { value: "GNX", label: "Buick GNX" },
  { value: "Trans Am", label: "Pontiac Trans Am" },
  { value: "Monte Carlo", label: "Chevy Monte Carlo" },
  { value: "Cutlass", label: "Oldsmobile Cutlass" },
  { value: "Regal", label: "Buick Regal" },
];

const artists = [
  { value: "Anita Baker", label: "Anita Baker" },
  { value: "Luther Vandross", label: "Luther Vandross" },
  { value: "Teddy Pendergrass", label: "Teddy Pendergrass" },
  { value: "Phyllis Hyman", label: "Phyllis Hyman" },
  { value: "Marvin Gaye", label: "Marvin Gaye" },
];

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength: number;
  disabled: boolean;
  className?: string;
}

function getTextWidth(text: string, font: string): number {
  if (typeof window === "undefined") return 0; // Server-side check
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  return 0;
}

const DynamicInput: React.FC<InputProps> = ({
  value,
  onChange,
  maxLength,
  disabled,
  className,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [width, setWidth] = React.useState(
    value === "GNX" ? 68 : value === "Anita Baker" ? 168 : 20
  );

  const updateWidth = React.useCallback(() => {
    if (typeof window === "undefined") return; // Server-side check
    if (inputRef.current) {
      const textWidth = getTextWidth(
        value,
        getComputedStyle(inputRef.current).font
      );
      setWidth(
        value === "GNX"
          ? 68
          : value === "Anita Baker"
          ? 168
          : Math.max(20, textWidth + 4)
      );
    }
  }, [value]);

  React.useEffect(() => {
    updateWidth();
  }, [updateWidth]);

  React.useEffect(() => {
    updateWidth();
  }, [value, updateWidth]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      className={cn(
        "bg-transparent text-center focus:outline-none font-bold text-white [color:white]",
        disabled ? "" : "border-b-2 border-white",
        className
      )}
      style={{
        width: `${width}px`,
        minWidth: "20px",
      }}
      maxLength={maxLength}
      disabled={disabled}
    />
  );
};

export function CoverArtGenerator() {
  const [vehicle, setVehicle] = React.useState("GNX");
  const [artist, setArtist] = React.useState("Anita Baker");
  const [isCustomMode, setIsCustomMode] = React.useState(false);

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle(e.target.value.slice(0, 32));
  };

  const handleArtistChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArtist(e.target.value.slice(0, 40));
  };

  const handleDownload = () => {
    if (typeof window === "undefined") return; // Server-side check
    const link = document.createElement("a");
    link.href =
      "https://replicate.delivery/xezq/nu6sPqSoe2xXIauj8Ldu1A67xqfBeTvYkoQQhxDj5SjehURPB/out-0.jpg";
    link.download = "cover-art.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="absolute top-4 right-4 flex items-center space-x-2 hidden">
        <Switch
          id="custom-mode"
          checked={isCustomMode}
          onCheckedChange={setIsCustomMode}
        />
        <label htmlFor="custom-mode" className="text-sm font-medium text-white">
          Custom
        </label>
      </div>
      <Card className="mx-auto w-full max-w-3xl overflow-hidden bg-zinc-900">
        <div className="aspect-square relative group">
          <img
            src="https://replicate.delivery/xezq/nu6sPqSoe2xXIauj8Ldu1A67xqfBeTvYkoQQhxDj5SjehURPB/out-0.jpg"
            alt="Album cover art showing a black classic car"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 touch:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70"
                onClick={handleDownload}
                aria-label="Download cover art"
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-black/50 hover:bg-black/70"
                aria-label="Share cover art"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center p-8">
          <p className="mb-8 text-center text-xl font-bold text-white [color:white] md:text-2xl lg:text-3xl">
            Ridin&apos; in my{" "}
            <span className="relative inline-block text-white [color:white]">
              <DynamicInput
                value={vehicle}
                onChange={handleVehicleChange}
                maxLength={32}
                disabled={!isCustomMode}
              />
            </span>{" "}
            with{" "}
            <span className="relative inline-block text-white [color:white]">
              <DynamicInput
                value={artist}
                onChange={handleArtistChange}
                maxLength={40}
                disabled={!isCustomMode}
              />
            </span>{" "}
            in the tape deck
          </p>
          <div className="flex w-full max-w-md gap-4">
            <Select value={vehicle} onValueChange={setVehicle}>
              <SelectTrigger className="flex-1 bg-white/10 text-white">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={artist} onValueChange={setArtist}>
              <SelectTrigger className="flex-1 bg-white/10 text-white">
                <SelectValue placeholder="Select artist" />
              </SelectTrigger>
              <SelectContent>
                {artists.map((a) => (
                  <SelectItem key={a.value} value={a.value}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
}
