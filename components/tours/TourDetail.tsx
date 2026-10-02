"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Check, X, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCategoryBadgeClass, type Tour } from "@/data/tours";
import { TourOverview } from "@/components/tours/TourOverview";
import { cn } from "@/lib/utils";
const GUEST_GRADES = ["Deluxe", "Executive", "Luxury", "Ultra Luxury"];

export default function TourDetails({ tour }: { tour: Tour | null }) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Calculate dynamic prices for ALL hotel categories
  const packagePrices = useMemo(() => {
    const prices: Record<string, { price: number; vehicleType: string; hotelName?: string }> = {};
    for (const offer of tour?.offers ?? []) {
      if (!GUEST_GRADES.includes(offer.category)) continue;
      prices[offer.category] = {
        price: offer.price,
        vehicleType: offer.vehicle,
        hotelName: offer.hotelName,
      };
    }
    return prices;
  }, [tour]);

  const expandAll = () => {
    if (tour) {
      setOpenItems(tour.itinerary.map((day) => `day-${day.day}`));
    }
  };

  const collapseAll = () => {
    setOpenItems([]);
  };

  const allExpanded = tour
    ? openItems.length === tour.itinerary.length
    : false;

  // Filter categories: For 1-day tours, only show Deluxe
  const displayCategories = (tour?.duration === 1 ? ["Deluxe"] : GUEST_GRADES).filter((category) => packagePrices[category]);

  if (!tour) {
    return (
      <div className="min-h-screen bg-[#faf9f5]">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="mb-4 text-2xl font-bold text-secondary">
            Tour Not Found
          </h1>
          <p className="mb-8 text-muted-foreground">
            The tour you&apos;re looking for doesn&apos;t exist.
          </p>
          <Button asChild>
            <Link href="/tours">Browse All Tours</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f5]">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden md:h-96">
        <img
          src={tour.image}
          alt={tour.name}
          className="h-full w-full object-cover"
        />
        <div className="" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          <div className="container mx-auto">
            <div className="inline-block rounded-lg bg-white/85 px-5 py-4 backdrop-blur-sm">
              <div className="mb-2 flex flex-wrap gap-2">
                {tour.categories.filter((category) => category !== "Premier").map((category) => (
                  <Badge
                    key={category}
                    className={cn("text-xs", getCategoryBadgeClass(category))}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
              <h1 className="mb-2 text-3xl font-bold text-navy md:text-4xl">
                {tour.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-navy">
                  <MapPin className="h-4 w-4 text-navy" />
                  {tour.location}
                </span>
                <span className="flex items-center gap-1 text-navy">
                  <Clock className="h-4 w-4 text-navy" />
                  {tour.duration} {tour.duration === 1 ? "Day" : "Days"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Back Button & View Template Button */}
        <div className="mb-6 flex gap-4">
          <Button
            asChild
            className="text-navy border border-navy bg-white hover:bg-navy hover:text-white"
          >
            <Link href="/tours">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Tours
            </Link>
          </Button>
          {/* <Button
            asChild
            className="bg-primary text-white hover:bg-primary/90"
          >
            <a
              href={`/tours/${id}/template`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View Template
            </a>
          </Button> */}
        </div>

      

        {/* Tour Overview Section */}
        <TourOverview
          itinerary={tour.itinerary}
          galleryImages={tour.galleryImages}
          pdf={tour.pdf}
          code={tour.code}
          openItems={openItems}
          onOpenItemsChange={setOpenItems}
          id={tour.id}
        />
  {/* Expand All Button testing */}
        <div className="mb-6 flex justify-center">
          <Button
            onClick={allExpanded ? collapseAll : expandAll}
            className="rounded-full px-8"
          >
            {allExpanded ? "Collapse All Sections" : "Expand All Sections"}
          </Button>
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Details */}
          <div className="lg:col-span-2">
            {/* Included / Not Included */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Check className="h-5 w-5 text-success" />
                    What&apos;s Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.included.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <X className="h-5 w-5 text-destructive" />
                    Not Included
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tour.notIncluded.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-destructive" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
                {/* Expand All Button */}
    
            </div>
          </div>

          {/* Right Column - Pricing */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="accent-underline pb-2">
                  Package Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="Deluxe"
                  className="w-full"
                >
                  <TabsList className="mb-6 flex w-full h-auto p-2 gap-1">
                    {displayCategories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className="flex-1 py-2.5 px-2 text-xs font-medium rounded-full whitespace-nowrap data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {displayCategories.map((category) => {
                    const priceData = packagePrices[category];
                    const displayPrice = priceData?.price || 0;
                    const vehicleType = priceData?.vehicleType || "GLI Car New Model";
                    const hotelName = priceData?.hotelName || "";

                    return (
                      <TabsContent
                        key={category}
                        value={category}
                        className="mt-0"
                      >
                        <div className="space-y-4">
                          {/* Price */}
                          <div className="text-center py-4 bg-muted/30 rounded-lg">
                            <span className="text-sm text-muted-foreground">
                              Starting from
                            </span>
                            <p className="text-3xl font-bold text-primary my-1">
                              {displayPrice.toLocaleString()}.PKR
                            </p>
                            <span className="text-sm text-muted-foreground">
                              For 2 Persons
                            </span>
                          </div>

                          {/* Features */}
                          <ul className="space-y-2 border-t border-border pt-4">
                            <li className="flex items-start gap-2 text-sm">
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              Private Transport ({vehicleType})
                            </li>
                            {hotelName && (
                              <li className="flex items-start gap-2 text-sm">
                                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                {hotelName}
                              </li>
                            )}
                          </ul>

                          {/* CTA */}
                          <Button className="w-full" asChild>
                            <a
                              href={`https://wa.me/923339981177?text=${encodeURIComponent(
                                `Hi, I'm interested in booking:\n\n` +
                                  `*Package Code:* ${tour.code}\n` +
                                  `*Tour:* ${tour.name}\n` +
                                  `*Package:* ${category}\n` +
                                  `*Hotel:* ${hotelName}\n` +
                                  `*Price:* ${displayPrice.toLocaleString()} PKR\n\n` +
                                  `Please provide more details.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Book Now
                            </a>
                          </Button>
                        </div>
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
