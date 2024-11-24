"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Michroma } from "next/font/google";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const artists = [
  { value: "Anita Baker", label: "Anita Baker" },
  { value: "Luther Vandross", label: "Luther Vandross" },
  { value: "Teddy Pendergrass", label: "Teddy Pendergrass" },
  { value: "Phyllis Hyman", label: "Phyllis Hyman" },
  { value: "Marvin Gaye", label: "Marvin Gaye" },
];

const michroma = Michroma({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export function CoverArtGenerator() {
  const [vehicle, setVehicle] = React.useState<string>("");
  const [vehicleDisplay, setVehicleDisplay] = React.useState<string>("");
  const [artist, setArtist] = React.useState("Anita Baker");
  const [vehicles, setVehicles] = React.useState<
    { value: string; label: string; image_url: string; alt_name_1: string }[]
  >([]);
  const [currentImage, setCurrentImage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchVehicles() {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("id, display_name, image_url, alt_name_1")
          .order("display_name");

        if (error) throw error;

        const formattedVehicles = data.map((vehicle) => ({
          value: vehicle.id.toString(),
          label: vehicle.display_name,
          image_url: vehicle.image_url,
          alt_name_1: vehicle.alt_name_1,
        }));

        setVehicles(formattedVehicles);

        // Set initial values from first vehicle if available
        if (formattedVehicles.length > 0) {
          const firstVehicle = formattedVehicles[0];
          setVehicle(firstVehicle.value);
          setVehicleDisplay(firstVehicle.alt_name_1);
          setCurrentImage(firstVehicle.image_url);
        }
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVehicles();
  }, []);

  // Update vehicle display and image when selection changes
  const handleVehicleChange = (value: string) => {
    const selectedVehicle = vehicles.find((v) => v.value === value);
    if (selectedVehicle) {
      setVehicle(value);
      setVehicleDisplay(selectedVehicle.alt_name_1);
      setCurrentImage(selectedVehicle.image_url);
    }
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
      <Card className="mx-auto w-full max-w-3xl overflow-hidden bg-zinc-900">
        <div className="aspect-square relative group">
          <img
            src={currentImage || ""}
            alt="Album cover art showing a black classic car"
            className="h-full w-full object-cover"
          />
          <p
            className={cn(
              "absolute bottom-8 left-0 right-0 px-8 text-center text-xl text-black md:text-2xl lg:text-3xl tracking-wider font-bold",
              michroma.className
            )}
          >
            Ridin&apos; in my{" "}
            <span className="text-black">{vehicleDisplay}</span> with{" "}
            <span className="text-black">{artist}</span> in the tape deck
          </p>
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
          <div className="flex w-full max-w-md gap-4">
            <Select
              value={vehicle}
              onValueChange={handleVehicleChange}
              disabled={isLoading}
            >
              <SelectTrigger className="flex-1 bg-white/10 text-white">
                <SelectValue
                  placeholder={isLoading ? "Loading..." : "Select vehicle"}
                />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.value} value={v.value}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="flex-1 bg-white/10 text-white"
              placeholder="Enter artist name"
              defaultValue="Anita Baker"
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
