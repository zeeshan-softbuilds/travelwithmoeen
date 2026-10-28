import { eq, inArray, max } from "drizzle-orm";
import { db } from "@/lib/db";
import { photos, places, posts, reviews, siteSettings, slides, tourDays, tourPlaces, tours } from "@/lib/db/schema";
import { canDeleteTour, canEditContent, canEditRates } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import type { BlogSection } from "@/data/blog";
import type { DestinationSection } from "@/data/destinations";
import type { PackageType, TourCategory, TourDay } from "@/data/tours";
import { forbidden, type ActionResult } from "@/lib/http/result";
import { deleteOfficeFiles, droppedOfficeFiles } from "@/lib/office/media";
import { tourIdFromName, uniquePlaceSlugs } from "@/lib/office/tour-places";

export { saveUploadedImage, saveUploadedPdf } from "@/lib/office/media";

// T-42 and T-43: a save or a delete removes a record's old office files only after the record is
// written or deleted, so a failed database step never leaves a record pointing at a deleted file.
// If removing the files then fails, the save or delete has still happened: it is reported as done,
// with a note, and the failure is logged. /images/ and /pdfs/ are never removed (officeMediaPath).
async function removeOldFilesAfter(before: string[], after: string[], done: Extract<ActionResult, { ok: true }>): Promise<ActionResult> {
  try {
    await deleteOfficeFiles(droppedOfficeFiles(before, after));
    return done;
  } catch (error) {
    console.error("An old office file could not be removed after a save or a delete.", error);
    return { ...done, message: `${done.message ?? "Done."} An old file could not be removed from storage.` };
  }
}

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
  placeSlugs?: string[];
};

async function rejectUnknownPlaces(slugs: string[]): Promise<ActionResult | null> {
  if (slugs.length === 0) return null;
  const rows = await db.select({ slug: places.slug }).from(places).where(inArray(places.slug, slugs));
  const found = new Set(rows.map((row) => row.slug));
  if (slugs.every((slug) => found.has(slug))) return null;
  return { ok: false, error: "Choose a place from the list." };
}

async function writeTourPlaces(
  tx: { delete: typeof db.delete; insert: typeof db.insert },
  tourId: string,
  slugs: string[],
) {
  await tx.delete(tourPlaces).where(eq(tourPlaces.tourId, tourId));
  if (slugs.length === 0) return;
  await tx.insert(tourPlaces).values(slugs.map((placeSlug, sortOrder) => ({ tourId, placeSlug, sortOrder })));
}

function sameTitle(left: string, right: string) {
  return left.trim().toLowerCase() === right.trim().toLowerCase();
}

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
  const placeSlugs = input.placeSlugs === undefined ? undefined : uniquePlaceSlugs(input.placeSlugs);
  if (placeSlugs) {
    const unknown = await rejectUnknownPlaces(placeSlugs);
    if (unknown) return unknown;
  }
  const [existing] = await db
    .select({ image: tours.image, pdf: tours.pdf, galleryImages: tours.galleryImages })
    .from(tours)
    .where(eq(tours.id, input.id))
    .limit(1);
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
    if (placeSlugs) await writeTourPlaces(tx, input.id, placeSlugs);
  });
  return removeOldFilesAfter(
    [existing.image, existing.pdf, ...existing.galleryImages],
    [input.image.trim(), input.pdf.trim(), ...input.galleryImages],
    { ok: true, message: "Tour saved.", tourIds: [input.id] },
  );
}

export async function createTourAs(actor: SessionUser, input: Omit<TourEditInput, "id">): Promise<ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot add a tour.");
  }
  const name = input.name.trim();
  if (!name) return { ok: false, error: "Enter a tour title." };
  if (!input.image.trim()) return { ok: false, error: "Enter a photo." };
  if (!input.region.trim()) return { ok: false, error: "Enter a region." };
  if (input.transport !== "By Road" && input.transport !== "By Air") {
    return { ok: false, error: "Choose road or air." };
  }
  if (!Number.isInteger(input.duration) || input.duration < 1 || input.duration > 60) {
    return { ok: false, error: "Enter a trip of 1 to 60 days." };
  }
  const placeSlugs = uniquePlaceSlugs(input.placeSlugs ?? []);
  const unknown = await rejectUnknownPlaces(placeSlugs);
  if (unknown) return unknown;
  let location = input.location.trim();
  if (!location && placeSlugs.length === 1) {
    const [place] = await db.select({ title: places.title }).from(places).where(eq(places.slug, placeSlugs[0])).limit(1);
    location = place?.title ?? "";
  }
  if (!location) return { ok: false, error: "Enter a location." };

  const baseId = tourIdFromName(name);
  let id = baseId;
  let suffix = 2;
  while (true) {
    const [found] = await db.select({ id: tours.id }).from(tours).where(eq(tours.id, id)).limit(1);
    if (!found) break;
    id = `${baseId}-${suffix}`;
    suffix += 1;
  }
  const codeRows = await db.select({ code: tours.code }).from(tours);
  let maxCode = 0;
  for (const row of codeRows) {
    if (/^\d+$/.test(row.code)) {
      const value = Number(row.code);
      if (value > maxCode) maxCode = value;
    }
  }
  const [orderRow] = await db.select({ value: max(tours.sortOrder) }).from(tours);
  const sortOrder = (orderRow?.value ?? 0) + 1;
  const code = String(maxCode + 1);

  await db.transaction(async (tx) => {
    await tx.insert(tours).values({
      id,
      name,
      location,
      region: input.region.trim(),
      description: input.description,
      duration: input.duration,
      image: input.image.trim(),
      pdf: input.pdf.trim(),
      code,
      galleryImages: input.galleryImages,
      categories: input.categories,
      packageTypes: input.packageTypes,
      transport: input.transport,
      basePrice: 0,
      packages: [],
      included: input.included,
      notIncluded: input.notIncluded,
      featured: input.featured,
      priceSource: "excel",
      sortOrder,
    });
    if (input.itinerary.length > 0) {
      await tx.insert(tourDays).values(
        input.itinerary.map((day, index) => ({
          tourId: id,
          dayNumber: index + 1,
          title: day.title,
          description: day.description,
          highlights: day.highlights,
        })),
      );
    }
    await writeTourPlaces(tx, id, placeSlugs);
  });
  return { ok: true, message: "Tour added.", href: `/office/tours/${id}`, tourIds: [id] };
}

export async function deleteTourAs(actor: SessionUser, tourId: string): Promise<ActionResult> {
  if (!canDeleteTour(actor.role)) {
    return forbidden("You cannot delete a tour.");
  }
  const [existing] = await db
    .select({ image: tours.image, pdf: tours.pdf, galleryImages: tours.galleryImages })
    .from(tours)
    .where(eq(tours.id, tourId))
    .limit(1);
  // The tour and the rows that belong to it go together, or not at all.
  await db.transaction(async (tx) => {
    await tx.delete(tourDays).where(eq(tourDays.tourId, tourId));
    await tx.delete(tourPlaces).where(eq(tourPlaces.tourId, tourId));
    await tx.delete(tours).where(eq(tours.id, tourId));
  });
  const deleted = { ok: true as const, message: "Tour deleted." };
  return existing ? removeOldFilesAfter([existing.image, existing.pdf, ...existing.galleryImages], [], deleted) : deleted;
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
  const [existing] = await db
    .select({ title: places.title, bannerImage: places.bannerImage, content: places.content })
    .from(places)
    .where(eq(places.slug, input.slug))
    .limit(1);
  const title = input.title.trim();
  const linkedTourIds = await db.transaction(async (tx) => {
    await tx
      .update(places)
      .set({
        title,
        excerpt: input.excerpt,
        bannerImage: input.bannerImage.trim(),
        location: input.location.trim() || null,
        content: input.content,
      })
      .where(eq(places.slug, input.slug));
    const links = await tx.select({ tourId: tourPlaces.tourId }).from(tourPlaces).where(eq(tourPlaces.placeSlug, input.slug));
    const ids = links.map((link) => link.tourId);
    if (!existing || sameTitle(existing.title, title)) return ids;
    for (const tourId of ids) {
      const rows = await tx.select({ placeSlug: tourPlaces.placeSlug }).from(tourPlaces).where(eq(tourPlaces.tourId, tourId));
      if (rows.length !== 1) continue;
      const [tour] = await tx.select({ location: tours.location }).from(tours).where(eq(tours.id, tourId)).limit(1);
      if (!tour || !sameTitle(tour.location, existing.title)) continue;
      await tx.update(tours).set({ location: title }).where(eq(tours.id, tourId));
    }
    return ids;
  });
  const saved = { ok: true as const, message: "Place saved.", tourIds: linkedTourIds };
  if (!existing) return saved;
  return removeOldFilesAfter(
    [existing.bannerImage, ...existing.content.map((section) => section.image ?? "")],
    [input.bannerImage.trim(), ...input.content.map((section) => section.image ?? "")],
    saved,
  );
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
  const [existing] = await db
    .select({ coverImage: posts.coverImage, content: posts.content })
    .from(posts)
    .where(eq(posts.slug, input.slug))
    .limit(1);
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
  const saved = { ok: true as const, message: "Post saved." };
  if (!existing) return saved;
  return removeOldFilesAfter(
    [existing.coverImage, ...existing.content.map((section) => section.image ?? "")],
    [input.coverImage.trim(), ...input.content.map((section) => section.image ?? "")],
    saved,
  );
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
    const [existing] = await db.select({ src: photos.src }).from(photos).where(eq(photos.id, input.id)).limit(1);
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
    const saved = { ok: true as const, message: "Photo saved." };
    return existing ? removeOldFilesAfter([existing.src], [input.src.trim()], saved) : saved;
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
  const [existing] = await db.select({ src: photos.src }).from(photos).where(eq(photos.id, id)).limit(1);
  await db.delete(photos).where(eq(photos.id, id));
  const deleted = { ok: true as const, message: "Photo removed." };
  return existing ? removeOldFilesAfter([existing.src], [], deleted) : deleted;
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
    const [existing] = await db.select({ avatar: reviews.avatar }).from(reviews).where(eq(reviews.id, input.id)).limit(1);
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
    const saved = { ok: true as const, message: "Review saved." };
    return existing ? removeOldFilesAfter([existing.avatar], [input.avatar.trim()], saved) : saved;
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
  const [existing] = await db.select({ avatar: reviews.avatar }).from(reviews).where(eq(reviews.id, id)).limit(1);
  await db.delete(reviews).where(eq(reviews.id, id));
  const deleted = { ok: true as const, message: "Review removed." };
  return existing ? removeOldFilesAfter([existing.avatar], [], deleted) : deleted;
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
    const [existing] = await db.select({ image: slides.image }).from(slides).where(eq(slides.id, input.id)).limit(1);
    await db
      .update(slides)
      .set({
        image: input.image.trim(),
        title: input.title.trim(),
        rotation: input.rotation,
        sortOrder: input.sortOrder,
      })
      .where(eq(slides.id, input.id));
    const saved = { ok: true as const, message: "Slide saved." };
    return existing ? removeOldFilesAfter([existing.image], [input.image.trim()], saved) : saved;
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
  const [existing] = await db.select({ image: slides.image }).from(slides).where(eq(slides.id, id)).limit(1);
  await db.delete(slides).where(eq(slides.id, id));
  const deleted = { ok: true as const, message: "Slide removed." };
  return existing ? removeOldFilesAfter([existing.image], [], deleted) : deleted;
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

