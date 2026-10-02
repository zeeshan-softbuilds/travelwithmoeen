import { asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { photos, places, posts, reviews, siteSettings, slides, tourDays, tours } from "@/lib/db/schema";
import type { Blog } from "@/data/blog";
import type { Destination } from "@/data/destinations";
import type { GalleryImage } from "@/data/gallery";
import type { Testimonial } from "@/data/testimonials";
import type { Tour, TourDay, TourRegion, TransportType } from "@/data/tours";
import { buildQuote, GUEST_GRADES, type RateCatalog } from "@/lib/quote";
import { loadCatalog } from "@/lib/rates";

export type SiteSettings = {
  phoneDisplay: string;
  phoneE164: string;
  email: string;
  address: string;
  mapsUrl: string;
  facebookUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  whatsappUrl: string;
};

export type HomeSlide = {
  id: number;
  image: string;
  title: string;
  rotation: number;
};

function toTour(row: typeof tours.$inferSelect, days: TourDay[]): Tour {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    region: row.region as TourRegion,
    duration: row.duration,
    description: row.description,
    image: row.image,
    pdf: row.pdf,
    code: row.code,
    galleryImages: row.galleryImages,
    categories: row.categories,
    packageTypes: row.packageTypes,
    transport: row.transport as TransportType,
    basePrice: row.basePrice,
    packages: row.packages,
    itinerary: days,
    included: row.included,
    notIncluded: row.notIncluded,
    featured: row.featured,
    priceSource: row.priceSource,
    couplePrice: row.basePrice,
    offers: [],
  };
}

function priceTour(tour: Tour, catalog: RateCatalog): Tour {
  if (tour.priceSource === "website" || tour.code === "201") {
    return {
      ...tour,
      priceSource: "website",
      couplePrice: tour.basePrice,
      offers: [{ category: "Deluxe", price: tour.basePrice, vehicle: "", hotelName: "" }],
    };
  }
  if (catalog.hotels.length === 0) return tour;
  const mode = tour.transport === "By Air" ? "air" : "road";
  const vehicle = mode === "air" ? "Prado" : "Gli Car";
  const shared = {
    place: tour.region,
    startCity: "Islamabad",
    mode,
    days: tour.duration,
    adults: 2,
    children: 0,
    lapInfants: 0,
    seatInfants: 0,
    vehicle,
    roomCount: 1,
    guide: false,
    meals: false,
  } as const;
  const couple = buildQuote({ ...shared, grade: "Deluxe" }, catalog);
  const offers = GUEST_GRADES.flatMap((grade) => {
    const result = buildQuote({ ...shared, grade }, catalog);
    if (!result.ok) return [];
    return [{ category: grade, price: result.total, vehicle: result.vehicleName, hotelName: result.hotelName }];
  });
  return {
    ...tour,
    couplePrice: couple.ok ? couple.total : tour.basePrice,
    offers,
  };
}

async function daysByTour() {
  const rows = await db.select().from(tourDays).orderBy(asc(tourDays.dayNumber));
  const grouped = new Map<string, TourDay[]>();
  for (const row of rows) {
    const list = grouped.get(row.tourId) ?? [];
    list.push({
      day: row.dayNumber,
      title: row.title,
      description: row.description,
      highlights: row.highlights,
    });
    grouped.set(row.tourId, list);
  }
  return grouped;
}

export async function getTours(): Promise<Tour[]> {
  const [tourRows, days] = await Promise.all([
    db.select().from(tours).orderBy(asc(tours.sortOrder)),
    daysByTour(),
  ]);
  const catalog = await loadCatalog();
  return tourRows.map((row) => priceTour(toTour(row, days.get(row.id) ?? []), catalog));
}

export async function getTour(id: string): Promise<Tour | null> {
  const [row] = await db.select().from(tours).where(eq(tours.id, id)).limit(1);
  if (!row) return null;
  const dayRows = await db
    .select()
    .from(tourDays)
    .where(eq(tourDays.tourId, id))
    .orderBy(asc(tourDays.dayNumber));
  return priceTour(
    toTour(
      row,
      dayRows.map((day) => ({
        day: day.dayNumber,
        title: day.title,
        description: day.description,
        highlights: day.highlights,
      })),
    ),
    await loadCatalog(),
  );
}

function toPlace(row: typeof places.$inferSelect): Destination {
  return {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    bannerImage: row.bannerImage,
    location: row.location ?? undefined,
    listingNumber: row.listingNumber,
    content: row.content,
  };
}

export async function getPlaces(): Promise<Destination[]> {
  const rows = await db.select().from(places).orderBy(asc(places.listingNumber));
  return rows.map(toPlace);
}

export async function getPlace(slug: string): Promise<Destination | null> {
  const [row] = await db.select().from(places).where(eq(places.slug, slug)).limit(1);
  return row ? toPlace(row) : null;
}

function toPost(row: typeof posts.$inferSelect): Blog {
  return {
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    author: row.author,
    date: row.date,
    coverImage: row.coverImage,
    content: row.content,
  };
}

export async function getPosts(): Promise<Blog[]> {
  const rows = await db.select().from(posts).orderBy(asc(posts.sortOrder));
  return rows.map(toPost);
}

export async function getPost(slug: string): Promise<Blog | null> {
  const [row] = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  return row ? toPost(row) : null;
}

export async function getPhotos(): Promise<GalleryImage[]> {
  const rows = await db.select().from(photos).orderBy(asc(photos.id));
  return rows.map((row) => ({
    id: row.id,
    src: row.src,
    alt: row.alt,
    category: row.category as GalleryImage["category"],
    span: (row.span as GalleryImage["span"]) || undefined,
    homeOnly: row.homeOnly || undefined,
  }));
}

export async function getReviews(): Promise<Testimonial[]> {
  const rows = await db.select().from(reviews).orderBy(asc(reviews.id));
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    avatar: row.avatar,
    location: row.location,
    text: row.text,
    rating: row.rating,
  }));
}

export async function getSlides(): Promise<HomeSlide[]> {
  const rows = await db.select().from(slides).orderBy(asc(slides.sortOrder));
  return rows.map((row) => ({
    id: row.id,
    image: row.image,
    title: row.title,
    rotation: row.rotation,
  }));
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  if (!row) {
    throw new Error("Site settings are not loaded. Run the content seed.");
  }
  return {
    phoneDisplay: row.phoneDisplay,
    phoneE164: row.phoneE164,
    email: row.email,
    address: row.address,
    mapsUrl: row.mapsUrl,
    facebookUrl: row.facebookUrl,
    instagramUrl: row.instagramUrl,
    tiktokUrl: row.tiktokUrl,
    youtubeUrl: row.youtubeUrl,
    whatsappUrl: `https://wa.me/${row.phoneE164}`,
  };
}
