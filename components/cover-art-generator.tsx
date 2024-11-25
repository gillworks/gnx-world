"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Download,
  Twitter,
  Check,
  ChevronsUpDown,
  Shuffle,
  Loader2,
} from "lucide-react";
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
  { value: "Stevie Wonder", label: "Stevie Wonder" },
  { value: "Whitney Houston", label: "Whitney Houston" },
  { value: "Michael Jackson", label: "Michael Jackson" },
  { value: "Prince", label: "Prince" },
  { value: "Diana Ross", label: "Diana Ross" },
  { value: "The Temptations", label: "The Temptations" },
  { value: "The Supremes", label: "The Supremes" },
  { value: "Aretha Franklin", label: "Aretha Franklin" },
  { value: "Patti LaBelle", label: "Patti LaBelle" },
  { value: "Gladys Knight", label: "Gladys Knight" },
  { value: "Earth, Wind & Fire", label: "Earth, Wind & Fire" },
  { value: "Chaka Khan", label: "Chaka Khan" },
  { value: "Barry White", label: "Barry White" },
  { value: "Donna Summer", label: "Donna Summer" },
  { value: "Billy Joel", label: "Billy Joel" },
  { value: "Elton John", label: "Elton John" },
  { value: "Fleetwood Mac", label: "Fleetwood Mac" },
  { value: "The Eagles", label: "The Eagles" },
  { value: "The Bee Gees", label: "The Bee Gees" },
  { value: "Lionel Richie", label: "Lionel Richie" },
  { value: "Hall & Oates", label: "Hall & Oates" },
  { value: "Al Green", label: "Al Green" },
  { value: "Roberta Flack", label: "Roberta Flack" },
  { value: "The Isley Brothers", label: "The Isley Brothers" },
  { value: "Sade", label: "Sade" },
  { value: "George Benson", label: "George Benson" },
  { value: "The Commodores", label: "The Commodores" },
  { value: "Rick James", label: "Rick James" },
  { value: "Kool & The Gang", label: "Kool & The Gang" },
  { value: "Jackson 5", label: "Jackson 5" },
  { value: "James Brown", label: "James Brown" },
  { value: "Chicago", label: "Chicago" },
  { value: "Tina Turner", label: "Tina Turner" },
  { value: "Cyndi Lauper", label: "Cyndi Lauper" },
  { value: "Journey", label: "Journey" },
  { value: "Bruce Springsteen", label: "Bruce Springsteen" },
  { value: "Van Halen", label: "Van Halen" },
  { value: "Madonna", label: "Madonna" },
  { value: "The Police", label: "The Police" },
  { value: "Randy Crawford", label: "Randy Crawford" },
  { value: "Dionne Warwick", label: "Dionne Warwick" },
  { value: "Billy Ocean", label: "Billy Ocean" },
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
      alt_name_2: string;
      alt_name_3: string;
      description: string;
    }[]
  >([]);
  const [currentImage, setCurrentImage] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [altNames, setAltNames] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);
  const [isTwitterSharing, setIsTwitterSharing] = React.useState(false);

  React.useEffect(() => {
    async function fetchVehicles() {
      try {
        const { data, error } = await supabase
          .from("vehicles")
          .select(
            "id, display_name, image_url, alt_name_1, alt_name_2, alt_name_3, description"
          )
          .order("priority", { ascending: true });

        if (error) throw error;

        const formattedVehicles = data.map((vehicle) => ({
          value: vehicle.id.toString(),
          label: vehicle.display_name,
          image_url: vehicle.image_url,
          alt_name_1: vehicle.alt_name_1,
          alt_name_2: vehicle.alt_name_2,
          alt_name_3: vehicle.alt_name_3,
          description: vehicle.description,
        }));

        setVehicles(formattedVehicles);

        // Set initial values from first vehicle if available
        if (formattedVehicles.length > 0) {
          const firstVehicle = formattedVehicles[0];
          setVehicle(firstVehicle.value);
          setVehicleDisplay(firstVehicle.alt_name_1);
          setCurrentImage(firstVehicle.image_url);
          // Set alt names for the first vehicle
          setAltNames(
            [
              firstVehicle.alt_name_1,
              firstVehicle.alt_name_2,
              firstVehicle.alt_name_3,
            ].filter(Boolean)
          );
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
      // Create array of alt names, filtering out any empty values
      setAltNames(
        [
          selectedVehicle.alt_name_1,
          selectedVehicle.alt_name_2,
          selectedVehicle.alt_name_3,
        ].filter(Boolean)
      );
    }
  };

  const handleAltNameSelect = (altName: string) => {
    setVehicleDisplay(altName);
  };

  const generateImage = async () => {
    if (typeof window === "undefined") return null;

    // Create a canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Create a new image object
    const img = new Image();
    img.crossOrigin = "anonymous"; // Enable CORS

    // Wait for image to load and process
    return new Promise<string | null>((resolve) => {
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

        // Convert to blob and return the URL
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(null);
              return;
            }
            const url = URL.createObjectURL(blob);
            resolve(url);
          },
          "image/jpeg",
          0.9
        );
      };
      img.src = currentImage;
    });
  };

  const handleDownload = async () => {
    const blobUrl = await generateImage();
    if (!blobUrl) return;

    const link = document.createElement("a");
    link.href = blobUrl;
    const selectedVehicle = vehicles.find((v) => v.value === vehicle);
    const filename = selectedVehicle
      ? `GNX-${selectedVehicle.description}-${artist}.jpg`
      : "GNX-cover-art.jpg";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const handleShuffle = () => {
    // Randomly select a vehicle
    const randomVehicle = vehicles[Math.floor(Math.random() * vehicles.length)];
    if (randomVehicle) {
      handleVehicleChange(randomVehicle.value);
    }

    // Randomly select an artist
    const randomArtist = artists[Math.floor(Math.random() * artists.length)];
    if (randomArtist) {
      setArtist(randomArtist.value);
    }
  };

  const handleTwitterShare = async () => {
    setIsTwitterSharing(true);
    const shareText = `Ridin' in my ${vehicleDisplay} with ${artist} in the tape deck`;
    const blobUrl = await generateImage();
    if (!blobUrl) {
      setIsTwitterSharing(false);
      return;
    }

    try {
      // Get the blob from the blob URL
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // Generate a unique filename
      const timestamp = new Date().getTime();
      const randomString = Math.random().toString(36).substring(2, 10);
      const selectedVehicle = vehicles.find((v) => v.value === vehicle);
      const safeArtistName = artist.toLowerCase().replace(/[^a-z0-9]/g, "");
      const safeVehicleName =
        selectedVehicle?.description.toLowerCase().replace(/[^a-z0-9]/g, "") ||
        "unknown";
      const filename = `share-${safeVehicleName}-${safeArtistName}-${timestamp}-${randomString}.jpg`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("social-shares")
        .upload(filename, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Storage error:", error);
        throw error;
      }

      // Get the public URL for the uploaded file
      const {
        data: { publicUrl },
      } = supabase.storage.from("social-shares").getPublicUrl(filename);

      // Create a share URL that includes the image ID
      const shareBaseUrl = window.location.origin;
      const shareUrl = `${shareBaseUrl}/share/${filename}`;

      // Open Twitter share dialog with the share URL
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}&url=${encodeURIComponent(shareUrl)}`,
        "_blank"
      );

      // Clean up the blob URL
      URL.revokeObjectURL(blobUrl);

      // Schedule cleanup of the uploaded file after some time (e.g., 1 hour)
      setTimeout(async () => {
        await supabase.storage.from("social-shares").remove([filename]);
      }, 3600000); // 1 hour
    } catch (error) {
      console.error("Error sharing to Twitter:", error);
      // Fallback to sharing without image
      const shareUrl = window.location.href;
      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          shareText
        )}`,
        "_blank"
      );
    } finally {
      setIsTwitterSharing(false);
    }
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
              <Popover>
                <PopoverTrigger asChild>
                  <span className="text-black cursor-pointer hover:underline">
                    {vehicleDisplay}
                  </span>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2">
                  <div className="flex flex-col gap-2">
                    {altNames.map((name, index) => (
                      <Button
                        key={index}
                        variant={
                          name === vehicleDisplay ? "secondary" : "ghost"
                        }
                        className="justify-start"
                        onClick={() => handleAltNameSelect(name)}
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>{" "}
              with <span className="text-black">{artist}</span> in the tape deck
            </p>
          )}
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 touch:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white hover:bg-white/90"
                onClick={handleTwitterShare}
                aria-label="Share on Twitter"
                disabled={isLoading || isTwitterSharing}
              >
                {isTwitterSharing ? (
                  <Loader2 className="h-5 w-5 text-black animate-spin" />
                ) : (
                  <Twitter className="h-5 w-5 text-black" />
                )}
              </Button>
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
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="flex-1 bg-white/10 text-white justify-between"
                  disabled={isLoading}
                >
                  {vehicle
                    ? vehicles.find((v) => v.value === vehicle)?.label
                    : "Select vehicle..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search vehicles..." />
                  <CommandList>
                    <CommandEmpty>No vehicle found.</CommandEmpty>
                    <CommandGroup>
                      {vehicles.map((v) => (
                        <CommandItem
                          key={v.value}
                          onSelect={() => {
                            handleVehicleChange(v.value);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              vehicle === v.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {v.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              type="text"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              className="flex-1 bg-white/10 text-white"
              placeholder="Enter artist name"
              defaultValue="Anita Baker"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={handleShuffle}
              className="bg-white/10 text-white"
              disabled={isLoading}
              title="Shuffle vehicle and artist"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
      <a
        href="https://x.com/gill_works"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 text-zinc-600 hover:text-zinc-400 text-sm transition-colors"
      >
        by @gill_works
      </a>
    </div>
  );
}
