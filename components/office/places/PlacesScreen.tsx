import { notFound, redirect } from "next/navigation";
import { frameFor } from "@/components/office/content/frame";
import { RecordList, type ListRecord } from "@/components/office/content/RecordList";
import { PlaceForm } from "@/components/office/PlaceForm";
import { PageHead } from "@/components/office/ui/PageHead";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { getOfficeSession, getSavedBy } from "@/lib/http/office-session";
import { getPlace, getPlaces } from "@/lib/http/site-content";

// The Places list, with the editor open over it when openSlug is set. Adding a place is not in T-37.
export async function PlacesScreen({ openSlug }: { openSlug?: string }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const [places, open] = await Promise.all([getPlaces(), openSlug ? getPlace(openSlug) : null]);
  if (openSlug && !open) notFound();

  const hrefOf = (slug: string) => `/office/places/${encodeURIComponent(slug)}`;
  const records: ListRecord[] = places.map((place) => {
    const tourCount = place.tours?.length ?? 0;
    return {
      key: place.slug,
      href: hrefOf(place.slug),
      title: place.title,
      sub: place.location ?? "",
      thumb: place.bannerImage,
      note: tourCount ? `${tourCount} ${tourCount === 1 ? "tour" : "tours"}` : "No tour",
      search: `${place.title} ${place.location ?? ""}`,
      sort: { name: place.title.toLowerCase(), tours: tourCount },
    };
  });
  const index = open ? places.findIndex((place) => place.slug === open.slug) : -1;

  const savedBy = open ? savedByText((await getSavedBy("place", [open.slug]))[String(open.slug)], requestTime()) : "";
  return (
    <>
      <PageHead title="Places" description="Destination pages on the website. Each place lists the tours that point to it." />
      <RecordList
        records={records}
        currentKey={open?.slug}
        searchLabel="Search places"
        noun="places"
        emptyIcon="pin"
        emptyTitle="No places yet"
        sorts={[
          { value: "", label: "Website order" },
          { value: "name:asc", label: "Name, A to Z" },
          { value: "tours:desc", label: "Most tours" },
        ]}
      />
      {open ? <PlaceForm key={open.slug} place={open} savedBy={savedBy} frame={frameFor(places, index, "/office/places", (place) => hrefOf(place.slug))} /> : null}
    </>
  );
}
