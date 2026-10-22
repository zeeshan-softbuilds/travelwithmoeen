import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { frameFor } from "@/components/office/content/frame";
import { RecordList, type ListRecord } from "@/components/office/content/RecordList";
import { TourForm } from "@/components/office/TourForm";
import { buttonClass } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";
import { getOfficeSession } from "@/lib/http/office-session";
import { getPlaces, getTour, getTours } from "@/lib/http/site-content";

// The Tours list, with the editor open over it when openId is set.
export async function ToursScreen({ openId }: { openId?: string }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const [tours, open, places] = await Promise.all([getTours(), openId ? getTour(openId) : null, openId ? getPlaces() : []]);
  if (openId && !open) notFound();

  const records: ListRecord[] = tours.map((tour) => {
    const placeNames = (tour.places ?? []).map((place) => place.title);
    return {
      key: tour.id,
      href: `/office/tours/${encodeURIComponent(tour.id)}`,
      title: tour.name,
      sub: `${tour.code} · ${tour.duration} ${tour.duration === 1 ? "day" : "days"} · ${placeNames.length ? placeNames.join(", ") : "No place"}`,
      thumb: tour.image,
      badges: [
        { label: tour.transport === "By Air" ? "Air" : "Road", tone: "outline" as const },
        ...(tour.featured ? [{ label: "Featured", tone: "accent" as const }] : []),
      ],
      search: `${tour.name} ${tour.code} ${tour.location} ${placeNames.join(" ")}`,
      filters: { transport: tour.transport, featured: tour.featured ? "yes" : "no" },
      sort: { name: tour.name.toLowerCase(), code: Number(tour.code) || 0, days: tour.duration },
    };
  });
  const index = open ? tours.findIndex((tour) => tour.id === open.id) : -1;

  return (
    <>
      <PageHead
        title="Tours"
        description={`${tours.length} tours on the website. A tour can link to more than one place.`}
        actions={
          <Link className={buttonClass({ variant: "primary" })} href="/office/tours/new">
            <Icon name="plus" />
            New tour
          </Link>
        }
      />
      <RecordList
        records={records}
        currentKey={open?.id}
        searchLabel="Search tours, codes, places"
        noun="tours"
        emptyIcon="map"
        emptyTitle="No tours yet"
        filters={[
          { key: "transport", label: "Travel", options: [{ value: "", label: "Road and air" }, { value: "By Road", label: "By road" }, { value: "By Air", label: "By air" }] },
          { key: "featured", label: "Featured", options: [{ value: "", label: "All tours" }, { value: "yes", label: "Featured only" }] },
        ]}
        sorts={[
          { value: "", label: "Website order" },
          { value: "name:asc", label: "Name, A to Z" },
          { value: "code:asc", label: "Code" },
          { value: "days:asc", label: "Shortest first" },
          { value: "days:desc", label: "Longest first" },
        ]}
      />
      {open ? (
        <TourForm
          key={open.id}
          tour={open}
          canDelete={user.canDeleteTour}
          mode="edit"
          places={places.map((place) => ({ slug: place.slug, title: place.title }))}
          frame={frameFor(tours, index, "/office/tours", (tour) => `/office/tours/${encodeURIComponent(tour.id)}`)}
        />
      ) : null}
    </>
  );
}
