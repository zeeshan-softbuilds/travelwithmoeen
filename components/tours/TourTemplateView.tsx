"use client";

import { useMemo } from "react";
import type { Tour } from "@/data/tours";
import TourTemplate from "@/components/tours/TourTemplate";

const GUEST_GRADES = ["Deluxe", "Executive", "Luxury", "Ultra Luxury"];

export default function TourTemplatePage({ tour }: { tour: Tour | null }) {

  // Filter categories: For 1-day tours, only show Deluxe
  const packages = useMemo(() => {
    if (!tour) return [];
    const displayCategories = tour.duration === 1 ? ["Deluxe"] : GUEST_GRADES;
    return displayCategories.flatMap((category) => {
      const offer = tour.offers?.find((row) => row.category === category);
      if (!offer) return [];
      return [{
        category,
        price: offer.price,
        features: [
          offer.vehicle ? `Private Transport (${offer.vehicle})` : "Private Transport",
          ...(offer.hotelName ? [offer.hotelName] : []),
        ],
      }];
    });
  }, [tour]);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Tour Not Found</h1>
          <p className="text-gray-600">The tour you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  // Prepare tour data for template
  const tourData = {
    id: tour.id,
    name: tour.name,
    location: tour.location,
    region: tour.region,
    duration: tour.duration,
    description: tour.description,
    image: tour.image,
    galleryImages: tour.galleryImages,
    transport: tour.transport,
    basePrice: tour.basePrice,
    packages: packages,
    itinerary: tour.itinerary,
    included: tour.included,
    notIncluded: tour.notIncluded,
  };

  return <TourTemplate tour={tourData} />;
}
