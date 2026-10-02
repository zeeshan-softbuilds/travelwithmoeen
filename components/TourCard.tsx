import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tour, getCategoryBadgeClass } from "@/data/tours";
import { cn } from "@/lib/utils";

interface TourCardProps {
  tour: Tour;
  view: "grid" | "list";
}

export function TourCard({ tour, view }: TourCardProps) {
  const isGrid = view === "grid";

  // Calculate Deluxe price dynamically
  const displayPrice = tour.couplePrice ?? tour.basePrice;

  return (
    <Card
      className={cn(
        "tour-card group overflow-hidden h-full",
        isGrid ? "flex flex-col" : "flex flex-col md:flex-row"
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative overflow-hidden",
          isGrid ? "h-48" : "h-48 md:h-auto md:w-72"
        )}
      >
        <img
          src={tour.image}
          alt={tour.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {tour.featured && (
          <Badge className="absolute left-3 top-3 bg-gold text-black">
            Featured
          </Badge>
        )}
        {tour.code && (
          <span className="absolute right-3 top-3 rounded bg-navy px-2 py-1 text-xs font-bold text-white">
            {tour.code}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col">
        <CardHeader className={cn(isGrid ? "pb-2" : "pb-2")}>
          {/* Categories */}
          <div className="mb-2 flex min-h-[28px] flex-wrap gap-1.5 text-navy">
            {tour.categories.filter((category) => category !== "Premier").map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className={cn("text-xs text-gold hover:bg-gold/80", getCategoryBadgeClass(category))}
              >
                {category}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-tight text-navy">
            {tour.name}
          </h3>

          {/* Location & Duration */}
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-navy-light">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {tour.location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {tour.duration} {tour.duration === 1 ? "Day" : "Days"}
            </span>
          </div>
        </CardHeader>

        <CardContent className={cn("flex-1", isGrid ? "pb-2" : "pb-2")}>
          <p className="line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
            {tour.description}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border pt-4">
          {/* Price */}
          <div>
            {/* <span className="text-xs text-muted-foreground">From</span> */}
            <p className="text-xl font-bold text-primary">
              {displayPrice.toLocaleString()} PKR
            </p>
              <span className="text-xs text-muted-foreground">For 2 Persons</span>
          </div>

          {/* CTA */}
          <Button asChild  className="text-black bg-gold hover:bg-gold/90" size="sm">
            <Link href={`/tours/${tour.id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}
