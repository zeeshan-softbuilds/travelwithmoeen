import { count } from "drizzle-orm";
import { db } from "../lib/db";
import { photos, places, posts, reviews, siteSettings, slides, tourDays, tours } from "../lib/db/schema";
import { tours as tourFile } from "../data/tours";
import { destinations } from "../data/destinations";
import { blogs } from "../data/blog";
import { galleryImages } from "../data/gallery";
import { testimonials } from "../data/testimonials";

const site = {
  id: 1,
  phoneDisplay: "+92 333 9981177",
  phoneE164: "923339981177",
  email: "info@travelwithmoeen.com",
  address: "Office # 3, 2nd Floor, Shalimar Plaza, F-10 Markaz, Islamabad",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Office+3+2nd+Floor+Shalimar+Plaza+F-10+Markaz+Islamabad",
  facebookUrl: "https://www.facebook.com/TravelwithMoeen?mibextid=rS40aB7S9Ucbxw6v",
  instagramUrl: "https://www.instagram.com/travelwithmoeen/",
  tiktokUrl: "https://www.tiktok.com/@travelwithmoeen",
  youtubeUrl: "https://www.youtube.com/@itsmoeen",
};

const homeSlides = [
  { id: 1, image: "/images/slider/JeepSafari.webp", title: "Jeep Safari", rotation: -15, sortOrder: 1 },
  { id: 2, image: "/images/slider/NatureWildlife.webp", title: "Nature & Wildlife", rotation: -7, sortOrder: 2 },
  { id: 3, image: "/images/slider/Adventure.webp", title: "Adventure", rotation: 0, sortOrder: 3 },
  { id: 4, image: "/images/slider/Hiking.webp", title: "Hiking", rotation: 7, sortOrder: 4 },
];

async function rowCount(table: typeof tours | typeof tourDays | typeof places | typeof posts | typeof photos | typeof reviews | typeof slides | typeof siteSettings) {
  const [row] = await db.select({ value: count() }).from(table);
  return Number(row?.value ?? 0);
}

async function main() {
  await db.delete(tourDays);
  await db.delete(tours);
  await db.delete(places);
  await db.delete(posts);
  await db.delete(photos);
  await db.delete(reviews);
  await db.delete(slides);
  await db.delete(siteSettings);

  await db.insert(tours).values(
    tourFile.map((tour, index) => ({
      id: tour.id,
      name: tour.name,
      location: tour.location,
      region: tour.region,
      duration: tour.duration,
      description: tour.description,
      image: tour.image,
      pdf: tour.pdf,
      code: tour.code,
      galleryImages: tour.galleryImages,
      categories: tour.categories,
      packageTypes: tour.packageTypes,
      transport: tour.transport,
      basePrice: tour.basePrice,
      packages: tour.packages,
      included: tour.included,
      notIncluded: tour.notIncluded,
      featured: tour.featured ?? false,
      priceSource: tour.code === "201" ? ("website" as const) : ("excel" as const),
      sortOrder: index,
    })),
  );

  const dayRows = tourFile.flatMap((tour) =>
    tour.itinerary.map((day) => ({
      tourId: tour.id,
      dayNumber: day.day,
      title: day.title,
      description: day.description,
      highlights: day.highlights,
    })),
  );
  for (let i = 0; i < dayRows.length; i += 100) {
    await db.insert(tourDays).values(dayRows.slice(i, i + 100));
  }

  await db.insert(places).values(
    destinations.map((place) => ({
      slug: place.slug,
      title: place.title,
      excerpt: place.excerpt,
      bannerImage: place.bannerImage,
      location: place.location ?? null,
      listingNumber: place.listingNumber,
      content: place.content,
    })),
  );

  await db.insert(posts).values(
    blogs.map((post, index) => ({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      author: post.author,
      date: post.date,
      coverImage: post.coverImage,
      content: post.content,
      sortOrder: index,
    })),
  );

  await db.insert(photos).values(
    galleryImages.map((photo) => ({
      id: photo.id,
      src: photo.src,
      alt: photo.alt,
      category: photo.category,
      span: photo.span ?? null,
      homeOnly: photo.homeOnly ?? false,
    })),
  );

  await db.insert(reviews).values(
    testimonials.map((review) => ({
      id: review.id,
      name: review.name,
      avatar: review.avatar,
      location: review.location,
      text: review.text,
      rating: review.rating,
    })),
  );

  await db.insert(slides).values(homeSlides);
  await db.insert(siteSettings).values(site);

  const expected = {
    tours: tourFile.length,
    tour_days: dayRows.length,
    places: destinations.length,
    posts: blogs.length,
    photos: galleryImages.length,
    reviews: testimonials.length,
    slides: homeSlides.length,
    site_settings: 1,
  };
  const actual = {
    tours: await rowCount(tours),
    tour_days: await rowCount(tourDays),
    places: await rowCount(places),
    posts: await rowCount(posts),
    photos: await rowCount(photos),
    reviews: await rowCount(reviews),
    slides: await rowCount(slides),
    site_settings: await rowCount(siteSettings),
  };

  console.log(JSON.stringify({ expected, actual, site }, null, 2));
  const mismatch = (Object.keys(expected) as (keyof typeof expected)[]).filter((key) => expected[key] !== actual[key]);
  if (mismatch.length > 0) {
    throw new Error(`Row counts do not match: ${mismatch.join(", ")}`);
  }
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
