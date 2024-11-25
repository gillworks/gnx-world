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
import { Skeleton } from "@/components/ui/skeleton";

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
    {
      value: string;
      label: string;
      image_url: string;
      alt_name_1: string;
      description: string;
    }[]
  >([]);
  const [currentImage, setCurrentImage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchVehicles() {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select("id, display_name, image_url, alt_name_1, description")
          .order("display_name");

        if (error) throw error;

        const formattedVehicles = data.map((vehicle) => ({
          value: vehicle.id.toString(),
          label: vehicle.display_name,
          image_url: vehicle.image_url,
          alt_name_1: vehicle.alt_name_1,
          description: vehicle.description,
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

  const handleDownload = async () => {
    if (typeof window === "undefined") return;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create a new image object
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable CORS

    // Wait for image to load
    await new Promise((resolve) => {
      img.onload = () => {
        // Set canvas size to match image
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image
        ctx.drawImage(img, 0, 0);

        // Configure text style
        const fontSize = img.width * 0.04;
        ctx.font = `bold ${fontSize}px ${michroma.style.fontFamily}`;
        ctx.fillStyle = "black";
        ctx.textAlign = "center";

        // Function to wrap text
        function wrapText(
          context: CanvasRenderingContext2D,
          text: string,
          maxWidth: number
        ) {
          const words = text.split(" ");
          const lines = [];
          let currentLine = words[0];

          for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + " " + word).width;
            if (width < maxWidth) {
              currentLine += " " + word;
            } else {
              lines.push(currentLine);
              currentLine = word;
            }
          }
          lines.push(currentLine);
          return lines;
        }

        // Add text with wrapping
        const text = `Ridin' in my ${vehicleDisplay} with ${artist} in the tape deck`;
        const maxWidth = canvas.width * 0.9; // 90% of canvas width for padding
        const lines = wrapText(ctx, text, maxWidth);

        const lineHeight = fontSize * 1.5;
        const startY = canvas.height - lineHeight * (lines.length + 1);

        lines.forEach((line, index) => {
          ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
        });

        // Convert to blob and download
        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const selectedVehicle = vehicles.find((v) => v.value === vehicle);
            const filename = selectedVehicle
              ? `GNX-${selectedVehicle.description}-${artist}.jpg`
              : "GNX-cover-art.jpg";
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          },
          "image/jpeg",
          0.9
        );

        resolve(null);
      };
      img.src = currentImage;
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <Card className="mx-auto w-full max-w-3xl overflow-hidden bg-zinc-900">
        <div className="aspect-square relative group">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : (
            <img
              src={currentImage || ""}
              alt="Album cover art showing a black classic car"
              className="h-full w-full object-cover"
            />
          )}
          {isLoading ? (
            <div
              className={cn(
                "absolute bottom-8 left-0 right-0 px-8",
                michroma.className
              )}
            >
              <Skeleton className="h-12 mx-auto max-w-2xl" />
            </div>
          ) : (
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
          )}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 touch:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white hover:bg-white/90"
                onClick={handleDownload}
                aria-label="Download cover art"
                disabled={isLoading}
              >
                <Download className="h-5 w-5 text-black" />
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
