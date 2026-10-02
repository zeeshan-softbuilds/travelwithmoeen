import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { eq, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { photos, places, posts, reviews, siteSettings, slides, tourDays, tours } from "@/lib/db/schema";
import { canDeleteTour, canEditContent, canEditRates } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import type { BlogSection } from "@/data/blog";
import type { DestinationSection } from "@/data/destinations";
import type { PackageType, TourCategory, TourDay } from "@/data/tours";
import { forbidden, type ActionResult } from "@/lib/http/result";

export type TourEditInput = {
  id: string;
  name: string;
  location: string;
  region: string;
  description: string;
  duration: number;
  image: string;
  pdf: string;
  galleryImages: string[];
  categories: TourCategory[];
  packageTypes: PackageType[];
  transport: string;
  included: string[];
  notIncluded: string[];
  featured: boolean;
  itinerary: TourDay[];
};

export async function savePriceAs(actor: SessionUser): Promise<ActionResult> {
  if (!canEditRates(actor.role)) {
    return forbidden("You cannot change a price.");
  }
  return { ok: false, error: "Rates are not open yet." };
}

export async function updateTourAs(actor: SessionUser, input: TourEditInput): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit a tour.");
  }
  const name = input.name.trim();
  if (!name) {
    return { ok: false, error: "Enter a tour title." };
  }
  if (!input.image.trim()) {
    return { ok: false, error: "Enter a photo." };
  }
  if (!Number.isInteger(input.duration) || input.duration < 1 || input.duration > 60) {
    return { ok: false, error: "Enter a trip of 1 to 60 days." };
  }
  const [existing] = await db.select({ id: tours.id }).from(tours).where(eq(tours.id, input.id)).limit(1);
  if (!existing) {
    return { ok: false, error: "That tour was not found." };
  }
  await db.transaction(async (tx) => {
    await tx
      .update(tours)
      .set({
        name,
        location: input.location.trim(),
        region: input.region.trim(),
        description: input.description,
        duration: input.duration,
        image: input.image.trim(),
        pdf: input.pdf.trim(),
        galleryImages: input.galleryImages,
        categories: input.categories,
        packageTypes: input.packageTypes,
        transport: input.transport,
        included: input.included,
        notIncluded: input.notIncluded,
        featured: input.featured,
      })
      .where(eq(tours.id, input.id));
    await tx.delete(tourDays).where(eq(tourDays.tourId, input.id));
    if (input.itinerary.length > 0) {
      await tx.insert(tourDays).values(
        input.itinerary.map((day, index) => ({
          tourId: input.id,
          dayNumber: index + 1,
          title: day.title,
          description: day.description,
          highlights: day.highlights,
        })),
      );
    }
  });
  return { ok: true, message: "Tour saved." };
}

export async function deleteTourAs(actor: SessionUser, tourId: string): Promise<ActionResult> {
  if (!canDeleteTour(actor.role)) {
    return forbidden("Only the Owner can delete a tour.");
  }
  await db.delete(tours).where(eq(tours.id, tourId));
  return { ok: true, message: "Tour deleted." };
}

export async function updatePlaceAs(
  actor: SessionUser,
  input: {
    slug: string;
    title: string;
    excerpt: string;
    bannerImage: string;
    location: string;
    content: DestinationSection[];
  },
): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit a place.");
  }
  if (!input.title.trim()) {
    return { ok: false, error: "Enter a title." };
  }
  await db
    .update(places)
    .set({
      title: input.title.trim(),
      excerpt: input.excerpt,
      bannerImage: input.bannerImage.trim(),
      location: input.location.trim() || null,
      content: input.content,
    })
    .where(eq(places.slug, input.slug));
  return { ok: true, message: "Place saved." };
}

export async function updatePostAs(
  actor: SessionUser,
  input: {
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    coverImage: string;
    content: BlogSection[];
  },
): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit a blog post.");
  }
  if (!input.title.trim()) {
    return { ok: false, error: "Enter a title." };
  }
  await db
    .update(posts)
    .set({
      title: input.title.trim(),
      excerpt: input.excerpt,
      author: input.author.trim(),
      date: input.date,
      coverImage: input.coverImage.trim(),
      content: input.content,
    })
    .where(eq(posts.slug, input.slug));
  return { ok: true, message: "Post saved." };
}

export async function savePhotoAs(
  actor: SessionUser,
  input: { id?: number; src: string; alt: string; category: string; span: string; homeOnly: boolean },
): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit the gallery.");
  }
  if (!input.src.trim() || !input.alt.trim()) {
    return { ok: false, error: "Enter a photo and a description." };
  }
  if (input.category !== "private" && input.category !== "group") {
    return { ok: false, error: "Choose private or group." };
  }
  const span = input.span === "tall" || input.span === "wide" || input.span === "large" ? input.span : null;
  if (input.id) {
    await db
      .update(photos)
      .set({
        src: input.src.trim(),
        alt: input.alt.trim(),
        category: input.category,
        span,
        homeOnly: input.homeOnly,
      })
      .where(eq(photos.id, input.id));
    return { ok: true, message: "Photo saved." };
  }
  const [row] = await db.select({ value: max(photos.id) }).from(photos);
  const id = (row?.value ?? 0) + 1;
  await db.insert(photos).values({
    id,
    src: input.src.trim(),
    alt: input.alt.trim(),
    category: input.category,
    span,
    homeOnly: input.homeOnly,
  });
  return { ok: true, message: "Photo added." };
}

export async function deletePhotoAs(actor: SessionUser, id: number): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit the gallery.");
  }
  await db.delete(photos).where(eq(photos.id, id));
  return { ok: true, message: "Photo removed." };
}

export async function saveReviewAs(
  actor: SessionUser,
  input: { id?: number; name: string; avatar: string; location: string; text: string; rating: number },
): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit reviews.");
  }
  if (!input.name.trim() || !input.text.trim()) {
    return { ok: false, error: "Enter a name and the review." };
  }
  if (!Number.isInteger(input.rating) || input.rating < 1 || input.rating > 5) {
    return { ok: false, error: "A review rating is 1 to 5." };
  }
  const rating = input.rating;
  if (input.id) {
    await db
      .update(reviews)
      .set({
        name: input.name.trim(),
        avatar: input.avatar.trim(),
        location: input.location.trim(),
        text: input.text.trim(),
        rating,
      })
      .where(eq(reviews.id, input.id));
    return { ok: true, message: "Review saved." };
  }
  const [row] = await db.select({ value: max(reviews.id) }).from(reviews);
  await db.insert(reviews).values({
    id: (row?.value ?? 0) + 1,
    name: input.name.trim(),
    avatar: input.avatar.trim(),
    location: input.location.trim(),
    text: input.text.trim(),
    rating,
  });
  return { ok: true, message: "Review added." };
}

export async function deleteReviewAs(actor: SessionUser, id: number): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit reviews.");
  }
  await db.delete(reviews).where(eq(reviews.id, id));
  return { ok: true, message: "Review removed." };
}

export async function saveSlideAs(
  actor: SessionUser,
  input: { id?: number; image: string; title: string; rotation: number; sortOrder: number },
): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit home slides.");
  }
  if (!input.image.trim() || !input.title.trim()) {
    return { ok: false, error: "Enter a photo and a title." };
  }
  if (input.id) {
    await db
      .update(slides)
      .set({
        image: input.image.trim(),
        title: input.title.trim(),
        rotation: input.rotation,
        sortOrder: input.sortOrder,
      })
      .where(eq(slides.id, input.id));
    return { ok: true, message: "Slide saved." };
  }
  const [row] = await db.select({ value: max(slides.id) }).from(slides);
  const id = (row?.value ?? 0) + 1;
  await db.insert(slides).values({
    id,
    image: input.image.trim(),
    title: input.title.trim(),
    rotation: input.rotation,
    sortOrder: input.sortOrder || id,
  });
  return { ok: true, message: "Slide added." };
}

export async function deleteSlideAs(actor: SessionUser, id: number): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit home slides.");
  }
  await db.delete(slides).where(eq(slides.id, id));
  return { ok: true, message: "Slide removed." };
}

export async function updateSiteSettingsAs(
  actor: SessionUser,
  input: {
    phoneDisplay: string;
    phoneE164: string;
    email: string;
    address: string;
    mapsUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
    youtubeUrl: string;
  },
): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit site details.");
  }
  await db
    .update(siteSettings)
    .set({
      phoneDisplay: input.phoneDisplay.trim(),
      phoneE164: input.phoneE164.replace(/\D/g, ""),
      email: input.email.trim(),
      address: input.address.trim(),
      mapsUrl: input.mapsUrl.trim(),
      facebookUrl: input.facebookUrl.trim(),
      instagramUrl: input.instagramUrl.trim(),
      tiktokUrl: input.tiktokUrl.trim(),
      youtubeUrl: input.youtubeUrl.trim(),
    })
    .where(eq(siteSettings.id, 1));
  return { ok: true, message: "Site details saved." };
}

const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function imageKind(bytes: Buffer): "jpg" | "png" | "webp" | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "png";
  }
  if (bytes.length >= 12 && bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return "webp";
  }
  return null;
}

export async function saveUploadedImage(actor: SessionUser, file: File): Promise<string | ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit a photo.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("The file is larger than 5 MB.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_UPLOAD_BYTES) {
    throw new Error("The file is larger than 5 MB.");
  }
  const kind = imageKind(bytes);
  if (!kind) {
    throw new Error("Use a JPEG, PNG, or WebP file.");
  }
  const filename = `${Date.now()}-${randomBytes(8).toString("hex")}.${kind}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
  return `/uploads/${filename}`;
}
