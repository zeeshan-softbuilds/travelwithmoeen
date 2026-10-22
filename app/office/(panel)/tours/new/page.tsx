import { redirect } from "next/navigation";
import { TourForm } from "@/components/office/TourForm";
import { PageHead } from "@/components/office/ui/PageHead";
import type { Tour } from "@/data/tours";
import { getPlaces } from "@/lib/http/site-content";
import { getOfficeSession } from "@/lib/http/office-session";

const blankTour = {
  id: "",
  name: "",
  location: "",
  region: "",
  duration: 1,
  description: "",
  image: "",
  pdf: "",
  code: "",
  galleryImages: [],
  categories: [],
  packageTypes: [],
  transport: "By Road",
  basePrice: 0,
  packages: [],
  itinerary: [],
  included: [],
  notIncluded: [],
  featured: false,
  places: [],
} as unknown as Tour;

export default async function OfficeNewTourPage() {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const places = await getPlaces();

  return (
    <>
      <PageHead title="New tour" description="The Owner or an Editor can add a tour. A Manager cannot." />
      <TourForm
        tour={blankTour}
        canDelete={false}
        mode="create"
        places={places.map((place) => ({ slug: place.slug, title: place.title }))}
      />
    </>
  );
}
