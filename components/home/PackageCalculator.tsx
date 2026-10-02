"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { PackagePopup } from "./PackagePopup";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bus,
  Plane,
  Search,
  Phone,
  Pencil,
  Plus,
  Check,
  Hotel,
  Car,
  Users,
  Calendar,
  MapPin,
  Navigation,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  roadDestinations,
  airDestinations,
  hotelCategories,
  optionalAddOns,
  getAvailableVehicles,
  roadDepartures,
  airDepartures,
  getMinimumDays,
  isGuideCompulsory,
  getRecommendedVehicle,
  type HotelCategory,
  type VehicleType,
} from "@/data/pricing";
import type { Tour } from "@/data/tours";
import { TourCard } from "@/components/TourCard";
import { cn } from "@/lib/utils";

type TransportMode = "By Road" | "By Air";
type RoomType = "twin" | "triple";

function roadBreakfast(addOns: string[], nextDays: number, mode: TransportMode) {
  if (mode !== "By Road") return addOns;
  const hasBreakfast = addOns.includes("arrival_breakfast");
  if (nextDays > 1 && !hasBreakfast) return [...addOns, "arrival_breakfast"];
  if (nextDays <= 1 && hasBreakfast) return addOns.filter((item) => item !== "arrival_breakfast");
  return addOns;
}

export function PackageCalculator({ tours }: { tours: Tour[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>("By Road");
  const [departure, setDeparture] = useState<string>("Islamabad");
  const [selectedDestination, setSelectedDestination] = useState<string>("");
  const [days, setDays] = useState<number>(2);
  // Traveler types (used for both By Road and By Air)
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [infantLap, setInfantLap] = useState<number>(0);
  const [infantOwnSeat, setInfantOwnSeat] = useState<number>(0);
  const [hotelCategory, setHotelCategory] = useState<HotelCategory>("Deluxe");
  const [vehicleType, setVehicleType] = useState<VehicleType>("Honda BRV");
  const [roomType, setRoomType] = useState<RoomType>("twin");
  // Default: welcome_pack, entry_tickets, arrival_breakfast are always included (not shown to user)
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(["arrival_breakfast"]);
  const [showMatchingTours, setShowMatchingTours] = useState(false);

  const destinations =
    transportMode === "By Air" ? airDestinations : roadDestinations;
  const departures =
    transportMode === "By Air" ? airDepartures : roadDepartures.filter((city) => city !== "Karachi");
  const guestGrades = hotelCategories.filter((category) => category !== "Premier");

  // Calculate total seats needed (infant lap doesn't need seat)
  const totalSeatsNeeded = adults + children + infantOwnSeat;

  // Total travelers for per-person calculations
  const totalTravelers = adults + children + infantLap + infantOwnSeat;

  // Available vehicles filtered by seat capacity
  const availableVehicles = useMemo(() => {
    if (!selectedDestination) return [];
    return getAvailableVehicles(
      departure,
      selectedDestination,
      totalSeatsNeeded,
      transportMode,
    );
  }, [departure, selectedDestination, totalSeatsNeeded, transportMode]);

  // Get minimum days for selected destination
  const minimumDays = useMemo(() => {
    if (!selectedDestination) return 2;
    return getMinimumDays(selectedDestination, transportMode);
  }, [selectedDestination, transportMode]);

  // Check if guide is compulsory for current vehicle
  const guideRequired = useMemo(
    () => isGuideCompulsory(vehicleType),
    [vehicleType],
  );

  // Handle destination change - also sets minimum days and recommended vehicle
  const handleDestinationChange = (dest: string) => {
    setSelectedDestination(dest);
    const minDays = getMinimumDays(dest, transportMode);
    if (days < minDays) {
      setDays(minDays);
      setSelectedAddOns((prev) => roadBreakfast(prev, minDays, transportMode));
    }
    // Auto-select recommended vehicle
    const recommended = getRecommendedVehicle(totalSeatsNeeded, transportMode);
    const available = getAvailableVehicles(
      departure,
      dest,
      totalSeatsNeeded,
      transportMode,
    );
    if (available.find((v) => v.type === recommended)) {
      setVehicleType(recommended);
    } else if (available.length > 0) {
      setVehicleType(available[0].type);
    }
  };

  // Handle vehicle change - enforce guide for Coaster
  const handleVehicleChange = (vehicle: VehicleType) => {
    setVehicleType(vehicle);
    // If Coaster selected, ensure guide is included
    if (isGuideCompulsory(vehicle) && !selectedAddOns.includes("guide")) {
      setSelectedAddOns((prev) => [...prev, "guide"]);
    }
  };

  // Reset destination & departure when transport mode changes
  const handleTransportChange = (mode: TransportMode) => {
    setTransportMode(mode);
    setSelectedDestination("");
    setDeparture("Islamabad");
    setDays(2);
    // Set default add-ons based on transport mode
    if (mode === "By Air") {
      setSelectedAddOns(["welcome_pack", "entry_tickets"]);
    } else {
      // By Road: include arrival_breakfast if days > 1 (default is 2)
      setSelectedAddOns(["arrival_breakfast"]);
    }
  };

  const changeDays = (nextDays: number) => {
    setDays(nextDays);
    setSelectedAddOns((prev) => roadBreakfast(prev, nextDays, transportMode));
  };

  // Add-ons that users can toggle (shown in UI) - only Guide and Meals
  const toggleableAddOns = optionalAddOns.filter(
    (addon) => addon.id === "guide" || addon.id === "meal",
  );

  const [quote, setQuote] = useState<{
    ok: boolean;
    total?: number;
    hotelName?: string;
    vehicleCount?: number;
    error?: string;
    lines?: { label: string; amount: number }[];
    profit?: number;
    subtotal?: number;
    seasonPercent?: number;
  } | null>(null);

  useEffect(() => {
    if (!selectedDestination) return;
    let active = true;
    const timer = setTimeout(() => {
      void fetch("/api/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          place: selectedDestination,
          startCity: departure,
          mode: transportMode === "By Air" ? "air" : "road",
          days,
          adults,
          children,
          lapInfants: infantLap,
          seatInfants: infantOwnSeat,
          grade: hotelCategory,
          vehicle: vehicleType,
          guide: selectedAddOns.includes("guide") || guideRequired,
          meals: selectedAddOns.includes("meal") || selectedAddOns.includes("meals"),
        }),
      })
        .then((response) => response.json())
        .then((body) => {
          if (active) setQuote(body);
        })
        .catch(() => {
          if (active) setQuote({ ok: false, error: "The quote could not be reached." });
        });
    }, 200);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [
    transportMode,
    selectedDestination,
    hotelCategory,
    vehicleType,
    days,
    departure,
    adults,
    children,
    infantLap,
    infantOwnSeat,
    selectedAddOns,
    guideRequired,
  ]);

  const matchingTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchTransport = tour.transport === transportMode;
      const matchDest =
        !selectedDestination ||
        tour.location.toLowerCase().includes(selectedDestination.toLowerCase());
      return matchTransport && matchDest;
    });
  }, [tours, transportMode, selectedDestination]);

  const toggleAddOn = (id: string) => {
    // Prevent removing guide if it's compulsory for current vehicle
    if (id === "guide" && guideRequired && selectedAddOns.includes("guide")) {
      return; // Can't remove guide for Coaster vehicles
    }
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-PK").format(price);

  // Get hotel name for the selected category and destination
  const hotelName = quote?.ok ? quote.hotelName : null;

  const handleWhatsAppClick = () => {
    const addOnNames = selectedAddOns
      .map((id) => optionalAddOns.find((a) => a.id === id)?.name)
      .filter(Boolean)
      .join(", ");

    const vehiclesNeededCount = quote?.vehicleCount || 1;
    const message = `Hi, I'm interested in booking a tour with the following details:

*Transport Mode:* ${transportMode}
*Departure City:* ${departure}
*Destination:* ${selectedDestination || "Not selected"}
*Duration:* ${days} Days
*Hotel Category:* ${hotelCategory}
*Vehicle Type:* ${vehicleType}${vehiclesNeededCount > 1 ? ` (×${vehiclesNeededCount} vehicles)` : ''}
*Room Type:* ${roomType === "twin" ? "Twin (2 Pax)" : "Triple (3 Pax)"}

*Travelers:*
- Adults (12+): ${adults}
- Children (2-11 yrs): ${children}
- Infant (Lap): ${infantLap}
- Infant (Own Seat): ${infantOwnSeat}
- Total Travelers: ${totalTravelers}

*Add-ons:* ${addOnNames || "None"}

${
  quote?.ok && quote.total !== undefined
    ? `*Estimated Cost:* PKR ${formatPrice(quote.total)}`
    : "*Estimated Cost:* Not calculated (please select a destination)"
}

Please confirm availability and provide more details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/923339981177?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section ref={sectionRef} className="bg-muted/30 py-16 md:py-24">
      {/* Scroll-triggered WhatsApp Popup */}
      <PackagePopup
        triggerRef={sectionRef}
        imageSrc="/images/logo/popup.jpeg"
        whatsappNumber="923339981177"
        whatsappMessage="Hi, I am interested in your tour packages. Please share more details."
      />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <Badge className="mb-4 bg-gold text-navy">Plan Your Trip</Badge>
          <h2 className="text-3xl font-bold text-navy md:text-4xl">
            Package Builder
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Customize your perfect trip and get an instant price estimate
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3">
                {/* Left Side - Form */}
                <div className="p-6 md:col-span-2 md:p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/20">
                      <MapPin className="h-5 w-5 text-gold" />
                    </div>
                    <h3 className="text-xl font-bold text-navy">
                      Package Builder
                    </h3>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* 1. Transport Mode */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        1. Transport Mode
                      </label>
                      <div className="flex gap-2">
                        {(["By Road", "By Air"] as TransportMode[]).map(
                          (mode) => (
                            <Button
                              key={mode}
                              variant={
                                transportMode === mode ? "navy" : "outline"
                              }
                              className="flex-1 gap-2"
                              onClick={() => handleTransportChange(mode)}
                            >
                              {mode === "By Road" ? (
                                <Bus className="h-4 w-4" />
                              ) : (
                                <Plane className="h-4 w-4" />
                              )}
                              {mode}
                            </Button>
                          ),
                        )}
                      </div>
                    </div>

                    {/* 2. Departure City */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Navigation className="mr-1 inline h-3.5 w-3.5" /> 2.
                        Departure City
                      </label>
                      <div className="flex gap-2">
                        {departures.map((city) => (
                            <Button
                              key={city}
                              variant={departure === city ? "navy" : "outline"}
                              className="flex-1"
                              onClick={() => setDeparture(city)}
                            >
                              {city}
                            </Button>
                          ))}
                      </div>
                    </div>

                    {/* 3. Destination */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        3. Destination
                      </label>
                      <Select
                        value={selectedDestination}
                        onValueChange={handleDestinationChange}
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select destination" />
                        </SelectTrigger>
                        <SelectContent>
                          {destinations.map((dest) => (
                            <SelectItem key={dest} value={dest}>
                              {dest}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 4. Hotel Category */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Hotel className="mr-1 inline h-3.5 w-3.5" /> 4. Hotel
                        Category
                      </label>
                      <Select
                        value={hotelCategory}
                        onValueChange={(v) =>
                          setHotelCategory(v as HotelCategory)
                        }
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {guestGrades.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 5. Travelers - Same breakdown for both By Air and By Road */}
                    {/* <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Users className="mr-1 inline h-3.5 w-3.5" /> 5. Adults (12+)
                      </label>
                      <Input
                        type="number"
                        min={1}
                        max={25}
                        value={adults}
                        onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                        className="h-11"
                      />
                    </div> */}
                    {/* 5. Adults */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Users className="mr-1 inline h-3.5 w-3.5" /> 5. Adults
                        (12+) ({adults})
                      </label>
                      <div className="flex items-center gap-4 pt-2">
                        <Slider
                          value={[adults]}
                          onValueChange={([val]) => setAdults(Math.max(1, val))}
                          min={1}
                          max={25}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-semibold text-navy">
                          {adults}
                        </span>
                      </div>
                    </div>

                    {/* 6. Children */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        6. Children (2-11 yrs) ({children})
                      </label>
                      <div className="flex items-center gap-4 pt-2">
                        <Slider
                          value={[children]}
                          onValueChange={([val]) =>
                            setChildren(Math.max(0, val))
                          }
                          min={0}
                          max={25}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-semibold text-navy">
                          {children}
                        </span>
                      </div>
                      {/* {transportMode === "By Air" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          75% of adult fare
                        </p>
                      )} */}
                    </div>

                    {/* 7. Infant (Lap) */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        7. Infant (Lap) ({infantLap})
                      </label>
                      <div className="flex items-center gap-4 pt-2">
                        <Slider
                          value={[infantLap]}
                          onValueChange={([val]) =>
                            setInfantLap(Math.max(0, val))
                          }
                          min={0}
                          max={10}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-semibold text-navy">
                          {infantLap}
                        </span>
                      </div>
                      {/* {transportMode === "By Air" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          PKR 1,000 fixed, no seat
                        </p>
                      )} */}
                    </div>

                    {/* 8. Infant (Own Seat) */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        8. Infant (Own Seat) ({infantOwnSeat})
                      </label>
                      <div className="flex items-center gap-4 pt-2">
                        <Slider
                          value={[infantOwnSeat]}
                          onValueChange={([val]) =>
                            setInfantOwnSeat(Math.max(0, val))
                          }
                          min={0}
                          max={10}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-semibold text-navy">
                          {infantOwnSeat}
                        </span>
                      </div>
                      {/* {transportMode === "By Air" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          PKR 5,000 fixed, 1 seat
                        </p>
                      )} */}
                    </div>

                    {/* <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        6. Children (2-11 yrs)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={25}
                        value={children}
                        onChange={(e) =>
                          setChildren(
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="h-11"
                      />
                      {transportMode === "By Air" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          75% of adult fare
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        7. Infant (Lap)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={infantLap}
                        onChange={(e) =>
                          setInfantLap(
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="h-11"
                      />
                      {transportMode === "By Air" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          PKR 1,000 fixed, no seat
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        8. Infant (Own Seat)
                      </label>
                      <Input
                        type="number"
                        min={0}
                        max={10}
                        value={infantOwnSeat}
                        onChange={(e) =>
                          setInfantOwnSeat(
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="h-11"
                      />
                      {transportMode === "By Air" && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          PKR 5,000 fixed, 1 seat
                        </p>
                      )}
                    </div> */}

                    {/* Days */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Calendar className="mr-1 inline h-3.5 w-3.5" /> 9.
                        Duration ({days} Days)
                        {selectedDestination && (
                          <span className="ml-2 text-[10px] font-normal text-muted-foreground">
                            (Min: {minimumDays} days)
                          </span>
                        )}
                      </label>
                      <div className="flex items-center gap-4 pt-2">
                        <Slider
                          value={[days]}
                          onValueChange={([val]) =>
                            changeDays(Math.max(val, minimumDays))
                          }
                          min={minimumDays}
                          max={15}
                          step={1}
                          className="flex-1"
                        />
                        <span className="w-8 text-center font-semibold text-navy">
                          {days}
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Type (filtered by seats) */}
                    <div>
                      <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                        <Car className="mr-1 inline h-3.5 w-3.5" /> 10. Vehicle
                        Type
                        {guideRequired && (
                          <span className="ml-2 text-[10px] font-normal text-primary">
                            (Guide compulsory)
                          </span>
                        )}
                      </label>
                      <Select
                        value={vehicleType}
                        onValueChange={(v) =>
                          handleVehicleChange(v as VehicleType)
                        }
                        disabled={availableVehicles.length === 0}
                      >
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue
                            placeholder={
                              availableVehicles.length === 0
                                ? "Select destination first"
                                : undefined
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {availableVehicles.map(({ type, rate, vehiclesNeeded }) => (
                            <SelectItem key={type} value={type}>
                              {type} ({rate.seats} seats){vehiclesNeeded > 1 ? ` × ${vehiclesNeeded}` : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {selectedDestination && totalSeatsNeeded > 0 && quote?.ok && (quote.vehicleCount ?? 1) > 1 && (
                          <p className="mt-1.5 text-xs text-muted-foreground">
                            {quote.vehicleCount} vehicles needed for {totalSeatsNeeded} travelers
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Room Type */}
                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                      11. Room Type
                    </label>
                    <div className="flex gap-2">
                      {(["twin", "triple"] as RoomType[]).map((type) => (
                        <Button
                          key={type}
                          variant={roomType === type ? "navy" : "outline"}
                          className="min-w-25 capitalize"
                          onClick={() => setRoomType(type)}
                        >
                          {type === "twin" ? "Twin (2 Pax)" : "Triple (3 Pax)"}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Add-ons */}
                  <div className="mt-6">
                    <label className="mb-3 block text-xs font-semibold uppercase tracking-wide text-navy">
                      12. Optional Add-ons
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {/* Only show Guide and Meals as toggleable options */}
                      {toggleableAddOns.map((addon) => {
                        const isGuideAndRequired =
                          addon.id === "guide" && guideRequired;
                        return (
                          <Button
                            key={addon.id}
                            variant="outline"
                            className={cn(
                              "gap-2",
                              selectedAddOns.includes(addon.id) &&
                                "border-navy bg-navy/10 text-navy",
                              isGuideAndRequired &&
                                "cursor-not-allowed opacity-70",
                            )}
                            onClick={() => toggleAddOn(addon.id)}
                            disabled={isGuideAndRequired}
                          >
                            {selectedAddOns.includes(addon.id) ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            {addon.name}
                            {isGuideAndRequired && " (Required)"}
                          </Button>
                        );
                      })}
                    </div>
                    {transportMode === "By Air" && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        * Welcome Pack & Entry Tickets included
                      </p>
                    )}
                    {transportMode === "By Road" && days > 1 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        * Arrival breakfast is included for trips longer than one day
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Side - Price Display */}
                <div className="flex flex-col rounded-xl bg-muted/50 p-6 md:p-8">
                  <div className="mb-4 text-center">
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Estimated Trip Quote
                    </span>
                  </div>

                  {quote?.ok && quote.total !== undefined ? (
                    <>
                      <motion.div
                        key={quote.total}
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 overflow-hidden rounded-2xl bg-navy p-6 text-center"
                      >
                        <div className="relative">
                          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/10" />
                          <p className="relative text-3xl font-bold text-gold md:text-4xl">
                            PKR {formatPrice(quote.total)}
                          </p>
                          <p className="mt-1 text-sm text-gold/80">
                            Total for {totalTravelers} traveler
                            {totalTravelers > 1 ? "s" : ""}
                          </p>
                        </div>
                      </motion.div>
                      {quote.lines && quote.profit !== undefined ? (
                        <div className="mb-4 space-y-2 rounded-xl bg-background p-4 text-sm">
                          {quote.lines.map((line) => (
                            <div className="flex justify-between" key={line.label}>
                              <span className="text-muted-foreground">{line.label}</span>
                              <span className="font-medium text-navy">PKR {formatPrice(line.amount)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Profit {quote.seasonPercent}%</span>
                            <span className="font-medium text-navy">PKR {formatPrice(quote.profit)}</span>
                          </div>
                        </div>
                      ) : null}

                      {/* Breakdown 
                      <div className="mb-4 space-y-2 rounded-xl bg-background p-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Hotel ({days > 1 ? days - 1 : 0} nights)
                          </span>
                          <span className="font-medium text-navy">
                            PKR {formatPrice(pricing.hotelTotal)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Vehicle ({days} days)
                          </span>
                          <span className="font-medium text-navy">
                            PKR {formatPrice(pricing.vehicleTotal)}
                          </span>
                        </div>
                        {pricing.airTicketTotal > 0 && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Air Tickets
                              </span>
                              <span className="font-medium text-navy">
                                PKR {formatPrice(pricing.airTicketTotal)}
                              </span>
                            </div>
                            {transportMode === "By Air" && (
                              <div className="ml-4 space-y-1 text-xs">
                                {adults > 0 &&
                                  pricing.adultTicketTotal &&
                                  pricing.adultTicketTotal > 0 && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Adults ({adults})</span>
                                      <span>
                                        PKR{" "}
                                        {formatPrice(pricing.adultTicketTotal)}
                                      </span>
                                    </div>
                                  )}
                                {children > 0 &&
                                  pricing.childTicketTotal &&
                                  pricing.childTicketTotal > 0 && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Children ({children}) @ 75%</span>
                                      <span>
                                        PKR{" "}
                                        {formatPrice(pricing.childTicketTotal)}
                                      </span>
                                    </div>
                                  )}
                                {infantLap > 0 &&
                                  pricing.infantLapTotal &&
                                  pricing.infantLapTotal > 0 && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Infant Lap ({infantLap})</span>
                                      <span>
                                        PKR{" "}
                                        {formatPrice(pricing.infantLapTotal)}
                                      </span>
                                    </div>
                                  )}
                                {infantOwnSeat > 0 &&
                                  pricing.infantOwnSeatTotal &&
                                  pricing.infantOwnSeatTotal > 0 && (
                                    <div className="flex justify-between text-muted-foreground">
                                      <span>Infant Seat ({infantOwnSeat})</span>
                                      <span>
                                        PKR{" "}
                                        {formatPrice(
                                          pricing.infantOwnSeatTotal,
                                        )}
                                      </span>
                                    </div>
                                  )}
                              </div>
                            )}
                          </>
                        )}
                        {pricing.departureSurcharge > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Departure Surcharge
                            </span>
                            <span className="font-medium text-navy">
                              PKR {formatPrice(pricing.departureSurcharge)}
                            </span>
                          </div>
                        )}
                        {pricing.arrivalBreakfastTotal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Arrival Breakfast ({totalTravelers} x PKR 500)
                            </span>
                            <span className="font-medium text-navy">
                              PKR {formatPrice(pricing.arrivalBreakfastTotal)}
                            </span>
                          </div>
                        )}
                        {selectedAddOns.some(id => id !== "arrival_breakfast") &&
                         pricing.addOnsTotal - pricing.arrivalBreakfastTotal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Other Add-ons
                            </span>
                            <span className="font-medium text-navy">
                              PKR {formatPrice(pricing.addOnsTotal - pricing.arrivalBreakfastTotal)}
                            </span>
                          </div>
                        )}
                        {pricing.stickerTotal > 0 && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Sticker (Per Vehicle)
                            </span>
                            <span className="font-medium text-navy">
                              PKR {formatPrice(pricing.stickerTotal)}
                            </span>
                          </div>
                        )}
                        <Separator />
                        <div className="flex justify-between font-bold">
                          <span className="text-navy">Grand Total</span>
                          <span className="text-gold">
                            PKR {formatPrice(pricing.grandTotal)}
                          </span>
                        </div>
                      </div>*/}

                      {/* Hotel Name Display */}
                      {hotelName && (
                        <div className="mb-4 rounded-xl bg-navy/5 p-4">
                          <div className="flex items-start gap-2">
                            <Hotel className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-navy">
                                {hotelCategory} Hotels
                              </p>
                              <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                                {hotelName}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="mb-4 rounded-2xl bg-navy/50 p-8 text-center">
                      <MapPin className="mx-auto mb-2 h-8 w-8 text-white/50" />
                      <p className="text-sm text-white/70">
                        {quote && !quote.ok && quote.error ? quote.error : "Select a destination to see pricing"}
                      </p>
                    </div>
                  )}

                  <div className="mt-auto space-y-3">
                    <Button
                   size="lg"
                      className="w-full gap-2 bg-[hsl(160,84%,39%)] text-white hover:bg-[hsl(160,84%,35%)]"
                      onClick={() => setShowMatchingTours(true)}
                    >
                      <Search className="h-4 w-4" /> View Matching Tours
                    </Button>
                    <Button
                      asChild
                      variant="outline-navy"
                      size="lg"
                      className="w-full gap-2"
                    >
                      <Link href="/customize-trip">
                        <Pencil className="h-4 w-4" /> Customize Your Trip
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                       variant="gold"
                     
                      className="w-full gap-2 "
                      onClick={handleWhatsAppClick}
                    >
                      <Phone className="h-4 w-4" /> Book or Talk to us
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Matching Tours */}
        <AnimatePresence>
          {showMatchingTours && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-12"
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-navy">
                  Matching Tours ({matchingTours.length})
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMatchingTours(false)}
                >
                  Hide
                </Button>
              </div>
              {matchingTours.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {matchingTours.map((tour, index) => (
                    <motion.div
                      key={tour.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <TourCard tour={tour} view="grid" />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    No tours match your current selection. Try adjusting your
                    filters.
                  </p>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
