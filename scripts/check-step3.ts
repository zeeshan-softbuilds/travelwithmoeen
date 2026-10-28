import { existsSync, readFileSync } from "fs";
import path from "path";
import { spawn } from "child_process";
import { count, eq, max } from "drizzle-orm";
import { db, sql } from "../lib/db";
import { guestRequests, loginFailures, places, posts, reviews, seasons, tourPlaces, tours, users } from "../lib/db/schema";
import { inferTourPlaceLinks, linkInferredTourPlaces } from "../lib/office/tour-places";
import { authenticate } from "../lib/auth/authenticate";
import { createUserAs, removeUserAs } from "../lib/office/users";
import { officeMediaPath } from "../lib/office/media";
import { GUEST_EMAIL_LIMIT, GUEST_MESSAGE_LIMIT, GUEST_NAME_LIMIT, GUEST_PHONE_LIMIT } from "../lib/requests";

const EDITOR_EMAIL = "editor-step3-requests@travelwithmoeen.test";
const EDITOR_PASSWORD = "Step3Editor-pass";
const MANAGER_EMAIL = "manager-step3-requests@travelwithmoeen.test";
const MANAGER_PASSWORD = "Step3Manager-pass";

const WHATSAPP = "https://wa.me/923339981177";
const PLACEHOLDER_PHONE = "tel:+1234567890";

function siteBase() {
  const configured = process.env.API_BASE_URL?.trim().replace(/\/$/, "");
  return configured || "http://localhost:3000";
}

function runStep2() {
  return new Promise<void>((resolve, reject) => {
    const child = spawn("npm", ["run", "check:step2"], {
      stdio: "inherit",
      shell: process.platform === "win32",
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error("The Step 2 checks failed."));
    });
  });
}

async function postRequest(body: Record<string, string>) {
  let response: Response;
  try {
    response = await fetch(`${siteBase()}/api/requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(`The site is not running at ${siteBase()}. Start it with npm run dev.`);
  }
  const text = await response.text();
  let parsed: { ok?: boolean; error?: string; id?: number; phone?: string; message?: string; name?: string; email?: string } = {};
  try {
    parsed = JSON.parse(text) as typeof parsed;
  } catch {
    parsed = {};
  }
  return { status: response.status, body: parsed, text };
}

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function bookNowHref(html: string) {
  const match = html.match(/<a\b[^>]*href="(https:\/\/wa\.me\/923339981177[^"]*)"[^>]*>Book Now<\/a>/);
  return match ? decodeHtml(match[1]) : "";
}

function sessionCookie(response: Response) {
  const lines = response.headers.getSetCookie?.() ?? [];
  const match = lines.find((line) => line.startsWith("twm_office="));
  return match ? match.split(";")[0] : "";
}

async function officePost(pathname: string, form: FormData, cookie: string) {
  const response = await fetch(`${siteBase()}${pathname}`, {
    method: "POST",
    body: form,
    headers: cookie ? { cookie } : {},
  });
  const text = await response.text();
  let body: { ok?: boolean; error?: string; href?: string } = {};
  try {
    body = JSON.parse(text) as { ok?: boolean; error?: string };
  } catch {
    body = {};
  }
  return { status: response.status, body, text, response };
}

async function signIn(email: string, password: string) {
  const form = new FormData();
  form.set("email", email);
  form.set("password", password);
  return officePost("/api/office/login", form, "");
}

async function officeGet(pathname: string, cookie: string) {
  const response = await fetch(`${siteBase()}${pathname}`, {
    headers: cookie ? { cookie } : {},
  });
  const text = await response.text();
  let body: { ok?: boolean; requests?: { id: number; kind?: string; phone?: string; message?: string; status?: string }[] } = {};
  try {
    body = JSON.parse(text) as typeof body;
  } catch {
    body = {};
  }
  return { status: response.status, body, text };
}

async function assertBookingOnOfficeList(id: number, message: string) {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  if (!ownerEmail || !ownerPassword) throw new Error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  const login = await signIn(ownerEmail, ownerPassword);
  const cookie = sessionCookie(login.response);
  if (!cookie) throw new Error("The Owner did not get a session.");
  const list = await officeGet("/api/office/requests", cookie);
  const listed = list.body.requests?.find((row) => row.id === id);
  if (list.status !== 200 || !listed || listed.kind !== "booking" || listed.status !== "new" || listed.message !== message) {
    throw new Error("The saved booking is not in the office list.");
  }
}

const JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  "base64",
);

function shippedFile(urlPath: string) {
  return path.join(process.cwd(), "public", urlPath.replace(/^\/+/, ""));
}

function assertMediaGuards() {
  if (officeMediaPath("https://example.public.blob.vercel-storage.com/backups/preview-2026.json") !== null) {
    throw new Error("A media check accepted a backup path.");
  }
  if (officeMediaPath("/images/tours/a.jpg") !== null) {
    throw new Error("A media check would delete a shipped picture.");
  }
  if (officeMediaPath("/pdfs/tour.pdf") !== null) {
    throw new Error("A media check would delete a shipped PDF.");
  }
  const kept = officeMediaPath("https://example.public.blob.vercel-storage.com/media/1710000000000-ab12cd34ef567890.jpg");
  if (kept !== "media/1710000000000-ab12cd34ef567890.jpg") {
    throw new Error("A public media file was not recognized.");
  }
}

function tourForm(
  tour: typeof tours.$inferSelect,
  extras: { image?: string; pdf?: string; gallery?: string[]; photo?: File; extra?: File; pdfFile?: File } = {},
) {
  const form = new FormData();
  form.set("id", tour.id);
  form.set("name", tour.name);
  form.set("location", tour.location);
  form.set("region", tour.region);
  form.set("description", tour.description);
  form.set("duration", String(tour.duration));
  form.set("image", extras.image ?? tour.image);
  form.set("pdf", extras.pdf ?? tour.pdf);
  form.set("categories", tour.categories.join("\n"));
  form.set("packageTypes", tour.packageTypes.join("\n"));
  form.set("transport", tour.transport);
  form.set("included", tour.included.join("\n"));
  form.set("notIncluded", tour.notIncluded.join("\n"));
  form.set("itinerary", "[]");
  form.set("galleryImageSet", "1");
  for (const photo of extras.gallery ?? tour.galleryImages) form.append("galleryImage", photo);
  if (extras.photo) form.set("photo", extras.photo);
  if (extras.extra) form.set("extraPhoto", extras.extra);
  if (extras.pdfFile) form.set("pdfFile", extras.pdfFile);
  return form;
}

function jpegFile(name: string) {
  return new File([new Uint8Array(JPEG)], name, { type: "image/jpeg" });
}

async function assertPlaceBlogReview(editorCookie: string, shipped: string) {
  const placeSlug = "office-media-place";
  const postSlug = "office-media-post";
  await db.delete(places).where(eq(places.slug, placeSlug));
  await db.delete(posts).where(eq(posts.slug, postSlug));
  const [idRow] = await db.select({ value: max(reviews.id) }).from(reviews);
  const reviewId = (idRow?.value ?? 0) + 1;
  await db.insert(places).values({
    slug: placeSlug,
    title: "Office media place",
    excerpt: "Office media place",
    bannerImage: shipped,
    location: "Check",
    listingNumber: 99001,
    content: [],
  });
  await db.insert(posts).values({
    slug: postSlug,
    title: "Office media post",
    excerpt: "Office media post",
    author: "Office",
    date: "2026-10-13",
    coverImage: shipped,
    content: [],
  });
  await db.insert(reviews).values({
    id: reviewId,
    name: "Office media review",
    avatar: "",
    location: "Check",
    text: "Office media review stays.",
    rating: 5,
  });
  const uploaded: string[] = [];
  try {
    const placeForm = new FormData();
    placeForm.set("slug", placeSlug);
    placeForm.set("title", "Office media place");
    placeForm.set("excerpt", "Office media place");
    placeForm.set("location", "Check");
    placeForm.set("bannerImage", shipped);
    placeForm.set("content", "[]");
    placeForm.set("bannerPhoto", jpegFile("banner.jpg"));
    const placeSave = await officePost("/api/office/places", placeForm, editorCookie);
    if (placeSave.status !== 200 || !placeSave.body.ok) {
      throw new Error(`A place banner was not saved: ${placeSave.status} ${placeSave.body.error ?? ""}`);
    }
    const [place] = await db.select().from(places).where(eq(places.slug, placeSlug)).limit(1);
    if (!place?.bannerImage || !officeMediaPath(place.bannerImage)?.endsWith(".jpg")) {
      throw new Error("The place banner was not stored as a public media file.");
    }
    uploaded.push(place.bannerImage);
    const placePage = await fetch(`${siteBase()}/destinations/${placeSlug}`);
    if (!(await placePage.text()).includes(place.bannerImage)) {
      throw new Error("The public place page does not show the banner.");
    }
    const postForm = new FormData();
    postForm.set("slug", postSlug);
    postForm.set("title", "Office media post");
    postForm.set("excerpt", "Office media post");
    postForm.set("author", "Office");
    postForm.set("date", "2026-10-13");
    postForm.set("coverImage", shipped);
    postForm.set("content", "[]");
    postForm.set("coverPhoto", jpegFile("cover.jpg"));
    const postSave = await officePost("/api/office/posts", postForm, editorCookie);
    if (postSave.status !== 200 || !postSave.body.ok) {
      throw new Error(`A blog cover was not saved: ${postSave.status} ${postSave.body.error ?? ""}`);
    }
    const [post] = await db.select().from(posts).where(eq(posts.slug, postSlug)).limit(1);
    if (!post?.coverImage || !officeMediaPath(post.coverImage)?.endsWith(".jpg")) {
      throw new Error("The blog cover was not stored as a public media file.");
    }
    uploaded.push(post.coverImage);
    const postPage = await fetch(`${siteBase()}/blog/${postSlug}`);
    if (!(await postPage.text()).includes(post.coverImage)) {
      throw new Error("The public blog page does not show the cover.");
    }
    const reviewForm = new FormData();
    reviewForm.set("id", String(reviewId));
    reviewForm.set("name", "Office media review");
    reviewForm.set("location", "Check");
    reviewForm.set("text", "Office media review stays.");
    reviewForm.set("rating", "5");
    reviewForm.set("avatar", "");
    reviewForm.set("avatarPhoto", jpegFile("avatar.jpg"));
    const reviewSave = await officePost("/api/office/reviews", reviewForm, editorCookie);
    if (reviewSave.status !== 200 || !reviewSave.body.ok) {
      throw new Error(`A review photo was not saved: ${reviewSave.status} ${reviewSave.body.error ?? ""}`);
    }
    const [withAvatar] = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
    if (!withAvatar?.avatar || !officeMediaPath(withAvatar.avatar)?.endsWith(".jpg")) {
      throw new Error("The review photo was not stored as a public media file.");
    }
    uploaded.push(withAvatar.avatar);
    const home = await fetch(`${siteBase()}/`);
    if (!(await home.text()).includes(withAvatar.avatar)) {
      throw new Error("The public page does not show the review photo.");
    }
    const clearForm = new FormData();
    clearForm.set("id", String(reviewId));
    clearForm.set("name", "Office media review");
    clearForm.set("location", "Check");
    clearForm.set("text", "Office media review stays.");
    clearForm.set("rating", "5");
    clearForm.set("avatar", "");
    const cleared = await officePost("/api/office/reviews", clearForm, editorCookie);
    if (cleared.status !== 200 || !cleared.body.ok) {
      throw new Error(`The review photo could not be cleared: ${cleared.status} ${cleared.body.error ?? ""}`);
    }
    const [kept] = await db.select().from(reviews).where(eq(reviews.id, reviewId)).limit(1);
    if (!kept || kept.text !== "Office media review stays." || kept.avatar !== "") {
      throw new Error("Clearing the photo removed the review.");
    }
    if ((await fetch(withAvatar.avatar)).ok) {
      throw new Error("Clearing the photo left the office file in storage.");
    }
    if (!existsSync(shippedFile(shipped))) {
      throw new Error("An office upload deleted a shipped picture.");
    }
    const placeBack = new FormData();
    placeBack.set("slug", placeSlug);
    placeBack.set("title", "Office media place");
    placeBack.set("excerpt", "Office media place");
    placeBack.set("location", "Check");
    placeBack.set("bannerImage", shipped);
    placeBack.set("content", "[]");
    const placeRestored = await officePost("/api/office/places", placeBack, editorCookie);
    if (placeRestored.status !== 200 || !placeRestored.body.ok) {
      throw new Error(`The place banner could not be put back: ${placeRestored.status} ${placeRestored.body.error ?? ""}`);
    }
    const [placeKept] = await db.select().from(places).where(eq(places.slug, placeSlug)).limit(1);
    if (!placeKept || placeKept.bannerImage !== shipped) throw new Error("Replacing the banner removed the place.");
    if ((await fetch(place.bannerImage)).ok) throw new Error("Replacing the banner left the office file in storage.");
    const postBack = new FormData();
    postBack.set("slug", postSlug);
    postBack.set("title", "Office media post");
    postBack.set("excerpt", "Office media post");
    postBack.set("author", "Office");
    postBack.set("date", "2026-10-13");
    postBack.set("coverImage", shipped);
    postBack.set("content", "[]");
    const postRestored = await officePost("/api/office/posts", postBack, editorCookie);
    if (postRestored.status !== 200 || !postRestored.body.ok) {
      throw new Error(`The blog cover could not be put back: ${postRestored.status} ${postRestored.body.error ?? ""}`);
    }
    const [postKept] = await db.select().from(posts).where(eq(posts.slug, postSlug)).limit(1);
    if (!postKept || postKept.coverImage !== shipped) throw new Error("Replacing the cover removed the post.");
    if ((await fetch(post.coverImage)).ok) throw new Error("Replacing the cover left the office file in storage.");
  } finally {
    const placeBack = new FormData();
    placeBack.set("slug", placeSlug);
    placeBack.set("title", "Office media place");
    placeBack.set("excerpt", "Office media place");
    placeBack.set("location", "Check");
    placeBack.set("bannerImage", shipped);
    placeBack.set("content", "[]");
    await officePost("/api/office/places", placeBack, editorCookie);
    const postBack = new FormData();
    postBack.set("slug", postSlug);
    postBack.set("title", "Office media post");
    postBack.set("excerpt", "Office media post");
    postBack.set("author", "Office");
    postBack.set("date", "2026-10-13");
    postBack.set("coverImage", shipped);
    postBack.set("content", "[]");
    await officePost("/api/office/posts", postBack, editorCookie);
    const removeReview = new FormData();
    removeReview.set("id", String(reviewId));
    await officePost("/api/office/reviews/delete", removeReview, editorCookie);
    await db.delete(places).where(eq(places.slug, placeSlug));
    await db.delete(posts).where(eq(posts.slug, postSlug));
    await db.delete(reviews).where(eq(reviews.id, reviewId));
  }
}

async function assertOfficeMedia(editorCookie: string, managerCookie: string, ownerCookie: string) {
  assertMediaGuards();
  const rows = await db.select().from(tours);
  const shipped = rows.flatMap((tour) => [tour.image, ...tour.galleryImages]).find((item) => item.startsWith("/images/") && existsSync(shippedFile(item)));
  if (!shipped) throw new Error("The media check needs a shipped picture under /images/.");
  await db.delete(tours).where(eq(tours.id, "office-media-check"));
  const [sample] = rows;
  if (!sample) throw new Error("There is no tour to copy for the media check.");
  await db.insert(tours).values({
    id: "office-media-check",
    name: "Office media check",
    location: sample.location,
    region: sample.region,
    duration: 1,
    description: "Office media check",
    image: shipped,
    pdf: "",
    code: "office-media-check",
    galleryImages: [shipped],
    categories: sample.categories,
    packageTypes: sample.packageTypes,
    transport: sample.transport,
    basePrice: 0,
    packages: [],
    included: [],
    notIncluded: [],
    featured: false,
    priceSource: "website",
  });
  const [created] = await db.select().from(tours).where(eq(tours.id, "office-media-check")).limit(1);
  if (!created) throw new Error("The media check tour was not created.");
  try {
    const jpeg = new File([new Uint8Array(JPEG)], "photo.jpg", { type: "image/jpeg" });
    const managerPhoto = await officePost("/api/office/tours", tourForm(created, { extra: jpeg }), managerCookie);
    if (managerPhoto.status !== 403 || managerPhoto.body.error !== "You cannot edit a photo.") {
      throw new Error(`A Manager was not refused a photo upload: ${managerPhoto.status} ${managerPhoto.body.error ?? ""}`);
    }
    const textPdf = new File([Buffer.from("hello")], "notes.pdf", { type: "application/pdf" });
    const badPdf = await officePost("/api/office/tours", tourForm(created, { pdfFile: textPdf }), editorCookie);
    if (badPdf.status !== 400 || badPdf.body.error !== "Use a PDF file.") {
      throw new Error(`A text file in the PDF field was not refused: ${badPdf.status} ${badPdf.body.error ?? ""}`);
    }
    const oversized = Buffer.alloc(10 * 1024 * 1024 + 1);
    oversized.write("%PDF-");
    const bigPdf = new File([new Uint8Array(oversized)], "large.pdf", { type: "application/pdf" });
    const big = await officePost("/api/office/tours", tourForm(created, { pdfFile: bigPdf }), editorCookie);
    if (big.status !== 400 || big.body.error !== "The file is larger than 10 MB.") {
      throw new Error(`A PDF over 10 MB was not refused: ${big.status} ${big.body.error ?? ""}`);
    }
    const extra = await officePost("/api/office/tours", tourForm(created, { extra: jpeg }), editorCookie);
    if (extra.status !== 200 || !extra.body.ok) {
      throw new Error(`An Editor JPEG was not saved: ${extra.status} ${extra.body.error ?? ""}`);
    }
    const [withPhoto] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    const photoUrl = withPhoto?.galleryImages.find((item) => officeMediaPath(item)?.endsWith(".jpg"));
    if (!photoUrl || !withPhoto.galleryImages.includes(shipped)) {
      throw new Error("The extra photo was not stored beside the shipped picture.");
    }
    const page = await fetch(`${siteBase()}/tours/${created.id}`);
    const html = await page.text();
    if (!html.includes(photoUrl) || !html.includes(shipped)) {
      throw new Error("The public tour page does not show the extra photo and the shipped picture.");
    }
    const cleared = await officePost("/api/office/tours", tourForm(withPhoto, { gallery: [shipped], image: shipped, pdf: "" }), editorCookie);
    if (cleared.status !== 200 || !cleared.body.ok) {
      throw new Error(`The extra photo could not be removed: ${cleared.status} ${cleared.body.error ?? ""}`);
    }
    const [withoutPhoto] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (!withoutPhoto || withoutPhoto.galleryImages.includes(photoUrl)) {
      throw new Error("Removing a photo left it on the tour.");
    }
    if ((await fetch(photoUrl)).ok) {
      throw new Error("Removing a photo left the office file in storage.");
    }
    if (!existsSync(shippedFile(shipped))) {
      throw new Error("Removing an office photo deleted a shipped picture.");
    }
    const pdfBytes = Buffer.from("%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");
    const pdfFile = new File([new Uint8Array(pdfBytes)], "tour.pdf", { type: "application/pdf" });
    const pdfSave = await officePost("/api/office/tours", tourForm(withoutPhoto, { gallery: [shipped], pdfFile }), editorCookie);
    if (pdfSave.status !== 200 || !pdfSave.body.ok) {
      throw new Error(`An Editor PDF was not saved: ${pdfSave.status} ${pdfSave.body.error ?? ""}`);
    }
    const [withPdf] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (!withPdf?.pdf || !officeMediaPath(withPdf.pdf)?.endsWith(".pdf")) {
      throw new Error("The tour PDF was not stored as a public media file.");
    }
    const pdfPage = await fetch(`${siteBase()}/tours/${created.id}`);
    if (!(await pdfPage.text()).includes(withPdf.pdf)) {
      throw new Error("The public tour page does not open the PDF.");
    }
    const replacement = new File([new Uint8Array(JPEG)], "main.jpg", { type: "image/jpeg" });
    const firstMain = await officePost("/api/office/tours", tourForm(withPdf, { gallery: [shipped], photo: replacement }), editorCookie);
    if (firstMain.status !== 200) throw new Error(`The main photo was not replaced: ${firstMain.body.error ?? firstMain.status}`);
    const [mainOne] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (!mainOne?.image || !officeMediaPath(mainOne.image)) throw new Error("The replacement photo was not a public media file.");
    const secondMain = await officePost(
      "/api/office/tours",
      tourForm(mainOne, { gallery: [shipped], image: mainOne.image, photo: replacement }),
      editorCookie,
    );
    if (secondMain.status !== 200) throw new Error(`The main photo was not replaced again: ${secondMain.body.error ?? secondMain.status}`);
    const [mainTwo] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (!mainTwo || mainTwo.image === mainOne.image) throw new Error("Replacing a photo kept the old file on the tour.");
    if ((await fetch(mainOne.image)).ok) throw new Error("Replacing a photo left the old office file in storage.");
    const deleteForm = new FormData();
    deleteForm.set("id", created.id);
    const editorDelete = await officePost("/api/office/tours/delete", deleteForm, editorCookie);
    if (editorDelete.status !== 200 || !editorDelete.body.ok) {
      throw new Error(`An Editor could not delete the media check tour: ${editorDelete.status} ${editorDelete.body.error ?? ""}`);
    }
    const [gone] = await db.select().from(tours).where(eq(tours.id, created.id)).limit(1);
    if (gone) throw new Error("Deleting the tour left the row.");
    if ((await fetch(mainTwo.image)).ok || (await fetch(withPdf.pdf)).ok) {
      throw new Error("Deleting the tour left an office file in storage.");
    }
    if (!existsSync(shippedFile(shipped))) {
      throw new Error("Deleting the tour deleted a shipped picture.");
    }
    await assertPlaceBlogReview(editorCookie, shipped);
  } finally {
    const form = new FormData();
    form.set("id", "office-media-check");
    await officePost("/api/office/tours/delete", form, ownerCookie);
    await db.delete(tours).where(eq(tours.id, "office-media-check"));
  }
}

function assertInferredLinks() {
  const known = new Set([
    "skardu-valley",
    "hunza-valley",
    "astor-valley-minimarg",
    "naran-kaghan-babusar-top",
    "kumrat-valley",
    "chitral-valley",
    "neelum-valley",
    "swat-valley-kalam-malam-jabba",
  ]);
  const cases: { tour: { name: string; region: string; location: string }; slugs: string[]; note: boolean }[] = [
    { tour: { name: "4 Days Trip to Skardu (By Air)", region: "Skardu Valley", location: "Skardu Valley" }, slugs: ["skardu-valley"], note: false },
    { tour: { name: "10 Days By Air Trip to Skardu & Hunza Valley", region: "Skardu & Hunza", location: "Deosai National Park" }, slugs: ["skardu-valley", "hunza-valley"], note: true },
    { tour: { name: "5 Days By Air Trip to Astor Minimarg and Skardu", region: "Minimarg Astor Valley", location: "Astor Minimarg" }, slugs: ["astor-valley-minimarg", "skardu-valley"], note: true },
    { tour: { name: "3 Days By Road Trip to Leepa Valley", region: "Neelum Valley Kashmir", location: "Leepa Valley" }, slugs: ["neelum-valley"], note: true },
    { tour: { name: "1 Day By Road Trip to Islamabad", region: "Islamabad", location: "Islamabad Capital Territory" }, slugs: [], note: true },
    { tour: { name: "3 Days Trip to Ratti Gali Lake", region: "Ratti Gali Lake", location: "Ratti Gali Lake" }, slugs: [], note: true },
    { tour: { name: "5 Days By Air Trip to Fairy Meadows + Skardu Valley", region: "Fairy Meadows Nanga Base Camp", location: "Fairy Meadows" }, slugs: [], note: true },
    { tour: { name: "1 Day By Road Trip to Murree", region: "Murree Patriata Galiyat", location: "Murree and Patriata" }, slugs: [], note: true },
  ];
  for (const item of cases) {
    const inferred = inferTourPlaceLinks(item.tour, known);
    if (inferred.slugs.join(",") !== item.slugs.join(",")) {
      throw new Error(`Links for ${item.tour.name} were ${inferred.slugs.join(",") || "none"}.`);
    }
    if (item.note && !inferred.note) throw new Error(`The note for ${item.tour.name} was missing.`);
    if (!item.note && inferred.note) throw new Error(`The note for ${item.tour.name} was unexpected.`);
  }
}

async function assertTourPlaceOffice(editorCookie: string, managerCookie: string, ownerCookie: string) {
  assertInferredLinks();
  const linked = await linkInferredTourPlaces();
  if (linked.unlinked.length === 0) throw new Error("The link pass linked every tour, including ones with no place page.");
  const [skardu] = await db.select().from(tours).where(eq(tours.region, "Skardu Valley")).limit(1);
  if (!skardu) throw new Error("A Skardu Valley tour was not loaded.");
  const skarduLinks = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, skardu.id));
  if (skarduLinks.length !== 1 || skarduLinks[0]?.placeSlug !== "skardu-valley") {
    throw new Error("A Skardu Valley tour was not linked to Skardu Valley.");
  }
  const [islamabad] = await db.select().from(tours).where(eq(tours.region, "Islamabad")).limit(1);
  if (!islamabad) throw new Error("An Islamabad tour was not loaded.");
  const islamabadLinks = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, islamabad.id));
  if (islamabadLinks.length !== 0) throw new Error("An Islamabad tour was linked without a place page.");
  const [combined] = await db.select().from(tours).where(eq(tours.region, "Skardu & Hunza")).limit(1);
  if (!combined) throw new Error("A Skardu and Hunza tour was not loaded.");
  const combinedLinks = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, combined.id));
  const combinedSlugs = combinedLinks.map((row) => row.placeSlug).sort();
  if (combinedSlugs.join(",") !== "hunza-valley,skardu-valley") {
    throw new Error("A Skardu and Hunza tour was not linked to both places.");
  }

  const placeSlug = "office-link-place";
  const otherSlug = "office-link-other";
  const shipped = skardu.image;
  await db.delete(tourPlaces).where(eq(tourPlaces.placeSlug, placeSlug));
  await db.delete(tourPlaces).where(eq(tourPlaces.placeSlug, otherSlug));
  await db.delete(places).where(eq(places.slug, placeSlug));
  await db.delete(places).where(eq(places.slug, otherSlug));
  await db.insert(places).values([
    {
      slug: placeSlug,
      title: "Link Valley",
      excerpt: "Link valley guide stays.",
      bannerImage: shipped,
      location: "Check",
      listingNumber: 99002,
      content: [{ heading: "Link Valley", body: "The place guide.", highlight: [], image: "" }],
    },
    {
      slug: otherSlug,
      title: "Other Valley",
      excerpt: "Other valley.",
      bannerImage: shipped,
      location: "Check",
      listingNumber: 99003,
      content: [],
    },
  ]);

  const createdNames = ["Office Link Check Tour", "Office Link Check Tour Amended"];
  const stale = await db.select({ id: tours.id }).from(tours).where(eq(tours.region, "Link Valley"));
  for (const row of stale) await db.delete(tours).where(eq(tours.id, row.id));
  try {
    // T-37c: the list links to the new-tour page, and each tour's editor offers Delete tour.
    const [anyTour] = await db.select({ id: tours.id }).from(tours).limit(1);
    if (!anyTour) throw new Error("No tour to open in the office.");
    for (const [who, cookie] of [["Editor", editorCookie], ["Owner", ownerCookie]] as const) {
      const list = await fetch(`${siteBase()}/office/tours`, { headers: { cookie } });
      const listHtml = await list.text();
      const editor = await fetch(`${siteBase()}/office/tours/${encodeURIComponent(anyTour.id)}`, { headers: { cookie } });
      const editorPageHtml = await editor.text();
      if (list.status !== 200 || !listHtml.includes('href="/office/tours/new"') || editor.status !== 200 || !editorPageHtml.includes("Delete tour")) {
        throw new Error(`The ${who} tours screens do not offer add and delete.`);
      }
    }
    const newPage = await fetch(`${siteBase()}/office/tours/new`, { headers: { cookie: editorCookie } });
    if (newPage.status !== 200 || !(await newPage.text()).includes("Add tour")) {
      throw new Error("The Editor could not open Add tour.");
    }

    const form = new FormData();
    form.set("name", "Office Link Check Tour");
    form.set("location", "Link Valley");
    form.set("region", "Link Valley");
    form.set("description", "Office link check.");
    form.set("duration", "2");
    form.set("image", shipped);
    form.set("pdf", "");
    form.set("transport", "By Road");
    form.set("itinerary", "[]");
    form.set("galleryImageSet", "1");
    form.set("placeSet", "1");
    form.append("placeSlug", placeSlug);
    const signedOut = await officePost("/api/office/tours/create", form, "");
    if (signedOut.status !== 401) throw new Error(`A tour create with no cookie returned ${signedOut.status}.`);
    const managerCreate = await officePost("/api/office/tours/create", form, managerCookie);
    if (managerCreate.status !== 403 || managerCreate.body.error !== "You cannot add a tour.") {
      throw new Error(`A Manager was not refused a new tour: ${managerCreate.status} ${managerCreate.body.error ?? ""}`);
    }
    const created = await officePost("/api/office/tours/create", form, editorCookie);
    if (created.status !== 200 || !created.body.ok || !created.body.href) {
      throw new Error(`An Editor could not add a tour: ${created.status} ${created.body.error ?? ""}`);
    }
    const [tour] = await db.select().from(tours).where(eq(tours.name, "Office Link Check Tour")).limit(1);
    if (!tour || tour.basePrice !== 0 || tour.region !== "Link Valley" || tour.location !== "Link Valley") {
      throw new Error("The new tour was not stored.");
    }
    const tourLinks = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, tour.id));
    if (tourLinks.length !== 1 || tourLinks[0]?.placeSlug !== placeSlug) throw new Error("The new tour was not linked to its place.");

    const tourPage = await fetch(`${siteBase()}/tours/${encodeURIComponent(tour.id)}`);
    const tourHtml = await tourPage.text();
    if (!tourPage.ok || !tourHtml.includes("Office Link Check Tour") || !tourHtml.includes(`/destinations/${placeSlug}`) || !tourHtml.includes("Link Valley")) {
      throw new Error("The public tour page does not show the linked place.");
    }
    const placePage = await fetch(`${siteBase()}/destinations/${placeSlug}`);
    const placeHtml = await placePage.text();
    if (!placePage.ok || !placeHtml.includes(`/tours/${tour.id}`) || !placeHtml.includes("Office Link Check Tour")) {
      throw new Error("The public place page does not show the linked tour.");
    }

    const placeForm = new FormData();
    placeForm.set("slug", placeSlug);
    placeForm.set("title", "Link Valley West");
    placeForm.set("excerpt", "Link valley guide stays.");
    placeForm.set("location", "Check");
    placeForm.set("bannerImage", shipped);
    placeForm.set("content", JSON.stringify([{ heading: "Link Valley", body: "The place guide.", highlight: [], image: "" }]));
    const renamed = await officePost("/api/office/places", placeForm, editorCookie);
    if (renamed.status !== 200 || !renamed.body.ok) {
      throw new Error(`The place title was not saved: ${renamed.status} ${renamed.body.error ?? ""}`);
    }
    const [moved] = await db.select().from(tours).where(eq(tours.id, tour.id)).limit(1);
    const [place] = await db.select().from(places).where(eq(places.slug, placeSlug)).limit(1);
    if (!moved || moved.location !== "Link Valley West" || moved.name !== "Office Link Check Tour" || moved.region !== "Link Valley") {
      throw new Error("Renaming the place did not update the single linked tour location.");
    }
    if (!place || place.excerpt !== "Link valley guide stays." || place.content[0]?.body !== "The place guide.") {
      throw new Error("Renaming the place changed the place guide.");
    }
    const renamedTourPage = await fetch(`${siteBase()}/tours/${encodeURIComponent(tour.id)}`);
    if (!(await renamedTourPage.text()).includes("Link Valley West")) {
      throw new Error("The public tour page does not show the new place title.");
    }

    const amend = new FormData();
    amend.set("id", tour.id);
    amend.set("name", "Office Link Check Tour Amended");
    amend.set("location", moved.location);
    amend.set("region", moved.region);
    amend.set("description", moved.description);
    amend.set("duration", String(moved.duration));
    amend.set("image", moved.image);
    amend.set("pdf", moved.pdf);
    amend.set("transport", moved.transport);
    amend.set("categories", moved.categories.join("\n"));
    amend.set("packageTypes", moved.packageTypes.join("\n"));
    amend.set("included", moved.included.join("\n"));
    amend.set("notIncluded", moved.notIncluded.join("\n"));
    amend.set("itinerary", "[]");
    amend.set("galleryImageSet", "1");
    amend.set("placeSet", "1");
    amend.append("placeSlug", placeSlug);
    amend.append("placeSlug", otherSlug);
    const amended = await officePost("/api/office/tours", amend, editorCookie);
    if (amended.status !== 200 || !amended.body.ok) {
      throw new Error(`An Editor could not amend the tour: ${amended.status} ${amended.body.error ?? ""}`);
    }
    const [placeAfterAmend] = await db.select().from(places).where(eq(places.slug, placeSlug)).limit(1);
    if (!placeAfterAmend || placeAfterAmend.title !== "Link Valley West" || placeAfterAmend.excerpt !== "Link valley guide stays.") {
      throw new Error("Amending the tour rewrote the place.");
    }
    const placeAfter = await fetch(`${siteBase()}/destinations/${placeSlug}`);
    if (!(await placeAfter.text()).includes("Office Link Check Tour Amended")) {
      throw new Error("The place page does not show the amended tour.");
    }

    const placeAgain = new FormData();
    placeAgain.set("slug", placeSlug);
    placeAgain.set("title", "Link Valley North");
    placeAgain.set("excerpt", "Link valley guide stays.");
    placeAgain.set("location", "Check");
    placeAgain.set("bannerImage", shipped);
    placeAgain.set("content", JSON.stringify([{ heading: "Link Valley", body: "The place guide.", highlight: [], image: "" }]));
    const secondRename = await officePost("/api/office/places", placeAgain, editorCookie);
    if (secondRename.status !== 200 || !secondRename.body.ok) {
      throw new Error(`The second place title was not saved: ${secondRename.status}`);
    }
    const [keptLocation] = await db.select().from(tours).where(eq(tours.id, tour.id)).limit(1);
    if (!keptLocation || keptLocation.location !== "Link Valley West") {
      throw new Error("A tour linked to two places took a single place title as its location.");
    }

    const managerDelete = await officePost("/api/office/tours/delete", deleteFormFor(tour.id), managerCookie);
    if (managerDelete.status !== 403 || managerDelete.body.error !== "You cannot delete a tour.") {
      throw new Error(`A Manager was not refused a tour delete: ${managerDelete.status} ${managerDelete.body.error ?? ""}`);
    }
    const editorDelete = await officePost("/api/office/tours/delete", deleteFormFor(tour.id), editorCookie);
    if (editorDelete.status !== 200 || !editorDelete.body.ok) {
      throw new Error(`An Editor could not delete the new tour: ${editorDelete.status} ${editorDelete.body.error ?? ""}`);
    }
    const [gone] = await db.select().from(tours).where(eq(tours.id, tour.id)).limit(1);
    if (gone) throw new Error("The deleted tour is still stored.");
    const leftover = await db.select().from(tourPlaces).where(eq(tourPlaces.tourId, tour.id));
    if (leftover.length !== 0) throw new Error("Deleting the tour left its place links.");
  } finally {
    for (const name of createdNames) {
      const rows = await db.select({ id: tours.id }).from(tours).where(eq(tours.name, name));
      for (const row of rows) await db.delete(tours).where(eq(tours.id, row.id));
    }
    const staleLeft = await db.select({ id: tours.id }).from(tours).where(eq(tours.region, "Link Valley"));
    for (const row of staleLeft) await db.delete(tours).where(eq(tours.id, row.id));
    await db.delete(places).where(eq(places.slug, placeSlug));
    await db.delete(places).where(eq(places.slug, otherSlug));
  }
}

function deleteFormFor(id: string) {
  const form = new FormData();
  form.set("id", id);
  return form;
}

async function assertOfficeRequests(savedIds: number[]) {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  const ownerPassword = process.env.OWNER_PASSWORD;
  if (!ownerEmail || !ownerPassword) throw new Error("OWNER_EMAIL and OWNER_PASSWORD are required.");
  await db.delete(loginFailures).where(eq(loginFailures.email, EDITOR_EMAIL));
  await db.delete(loginFailures).where(eq(loginFailures.email, MANAGER_EMAIL));
  await db.delete(users).where(eq(users.email, EDITOR_EMAIL));
  await db.delete(users).where(eq(users.email, MANAGER_EMAIL));
  const owner = await authenticate(ownerEmail, ownerPassword);
  if (!owner) throw new Error("The Owner password was refused.");
  const editorCreated = await createUserAs(owner, { email: EDITOR_EMAIL, password: EDITOR_PASSWORD, role: "editor" });
  if (!editorCreated.ok) throw new Error("The Owner could not create the Step 3 Editor.");
  const managerCreated = await createUserAs(owner, { email: MANAGER_EMAIL, password: MANAGER_PASSWORD, role: "manager" });
  if (!managerCreated.ok) throw new Error("The Owner could not create the Step 3 Manager.");

  const marker = `step3-office-${Date.now()}`;
  const phone = "03007770021";
  const message = `<b>${marker}</b>`;
  try {
    const saved = await postRequest({
      kind: "contact",
      name: "Office List Guest",
      email: "office-list@travelwithmoeen.test",
      phone,
      message,
    });
    if (saved.status !== 200 || !saved.body.id) throw new Error("The office test contact was not saved.");
    savedIds.push(saved.body.id);
    const requestId = String(saved.body.id);

    const signedOut = await officeGet("/api/office/requests", "");
    if (signedOut.status !== 401) throw new Error(`A request list with no cookie returned ${signedOut.status}.`);

    const editorLogin = await signIn(EDITOR_EMAIL, EDITOR_PASSWORD);
    const editorCookie = sessionCookie(editorLogin.response);
    if (!editorCookie) throw new Error("The Editor did not get a session.");
    const editorList = await officeGet("/api/office/requests", editorCookie);
    const listed = editorList.body.requests?.find((row) => row.id === saved.body.id);
    if (editorList.status !== 200 || !listed || listed.phone !== phone || listed.message !== message) {
      throw new Error("An Editor could not read the guest request.");
    }
    const statusForm = new FormData();
    statusForm.set("id", requestId);
    statusForm.set("status", "in_progress");
    const editorStatus = await officePost("/api/office/requests/status", statusForm, editorCookie);
    if (editorStatus.status !== 403) throw new Error(`An Editor status change returned ${editorStatus.status}.`);
    const deleteForm = new FormData();
    deleteForm.set("id", requestId);
    const editorDelete = await officePost("/api/office/requests/delete", deleteForm, editorCookie);
    if (editorDelete.status !== 403) throw new Error(`An Editor delete returned ${editorDelete.status}.`);

    const managerLogin = await signIn(MANAGER_EMAIL, MANAGER_PASSWORD);
    const managerCookie = sessionCookie(managerLogin.response);
    if (!managerCookie) throw new Error("The Manager did not get a session.");
    const managerStatus = await officePost("/api/office/requests/status", statusForm, managerCookie);
    if (managerStatus.status !== 200 || !managerStatus.body.ok) {
      throw new Error(`A Manager status change returned ${managerStatus.status}.`);
    }
    const [updated] = await db.select().from(guestRequests).where(eq(guestRequests.id, saved.body.id));
    if (!updated || updated.status !== "in_progress") throw new Error("The Manager status was not saved.");
    const badStatus = new FormData();
    badStatus.set("id", requestId);
    badStatus.set("status", "done");
    const refused = await officePost("/api/office/requests/status", badStatus, managerCookie);
    if (refused.status !== 400) throw new Error(`A bad status returned ${refused.status}.`);
    const managerDelete = await officePost("/api/office/requests/delete", deleteForm, managerCookie);
    if (managerDelete.status !== 403) throw new Error(`A Manager delete returned ${managerDelete.status}.`);

    const contentPaths = ["/api/content/tours", "/api/content/places", "/api/content/posts", "/api/content/photos", "/api/content/reviews", "/api/content/slides", "/api/content/site"];
    for (const path of contentPaths) {
      const read = await officeGet(path, "");
      if (read.status !== 200 || !read.body.ok) throw new Error(`${path} returned ${read.status}.`);
    }
    const missingTour = await officeGet("/api/content/tours/no-such-tour", "");
    if (missingTour.status !== 404) throw new Error(`A missing tour returned ${missingTour.status}.`);
    const ratesSignedOut = await officeGet("/api/office/rates", "");
    if (ratesSignedOut.status !== 401) throw new Error(`A rates read with no cookie returned ${ratesSignedOut.status}.`);
    const editorRates = await officeGet("/api/office/rates", editorCookie);
    if (editorRates.status !== 403) throw new Error(`An Editor rates read returned ${editorRates.status}.`);
    const managerRates = await officeGet("/api/office/rates", managerCookie);
    if (managerRates.status !== 200 || !managerRates.text.includes('"hotels"')) {
      throw new Error(`A Manager rates read returned ${managerRates.status}.`);
    }
    const officePages: [string, string][] = [
      ["/office/tours", editorCookie],
      ["/office/places", editorCookie],
      ["/office/blog", editorCookie],
      ["/office/gallery", editorCookie],
      ["/office/reviews", editorCookie],
      ["/office/slides", editorCookie],
      ["/office/site", editorCookie],
      ["/office/rates", managerCookie],
    ];
    for (const [path, cookie] of officePages) {
      const page = await fetch(`${siteBase()}${path}`, { headers: { cookie }, redirect: "manual" });
      if (page.status !== 200) throw new Error(`The office page ${path} returned ${page.status}.`);
    }

    const publicPaths = ["/", "/tours", "/contact", "/customize-trip", "/calculator"];
    for (const path of publicPaths) {
      const page = await fetch(`${siteBase()}${path}`);
      const html = await page.text();
      if (!page.ok || html.includes(phone) || html.includes(marker)) {
        throw new Error(`A public page includes the guest details: ${path}`);
      }
    }

    const ownerLogin = await signIn(ownerEmail, ownerPassword);
    const ownerCookie = sessionCookie(ownerLogin.response);
    if (!ownerCookie) throw new Error("The Owner did not get a session.");
    await assertOfficeMedia(editorCookie, managerCookie, ownerCookie);
    await assertTourPlaceOffice(editorCookie, managerCookie, ownerCookie);
    await assertOfficeShellLinks(editorCookie, managerCookie, ownerCookie);
    await assertSessionRequestCount(ownerCookie);
    await assertProfitMargin(editorCookie, managerCookie);
    const ownerDelete = await officePost("/api/office/requests/delete", deleteForm, ownerCookie);
    if (ownerDelete.status !== 200 || !ownerDelete.body.ok) {
      throw new Error(`An Owner delete returned ${ownerDelete.status}.`);
    }
    const [gone] = await db.select().from(guestRequests).where(eq(guestRequests.id, saved.body.id));
    if (gone) throw new Error("The Owner delete left the request in the list.");
  } finally {
    const editor = await authenticate(EDITOR_EMAIL, EDITOR_PASSWORD);
    if (editor) await removeUserAs(owner, editor.id);
    const manager = await authenticate(MANAGER_EMAIL, MANAGER_PASSWORD);
    if (manager) await removeUserAs(owner, manager.id);
    await db.delete(users).where(eq(users.email, EDITOR_EMAIL));
    await db.delete(users).where(eq(users.email, MANAGER_EMAIL));
  }
}

const OFFICE_LINKS_BY_ROLE = {
  owner: [
    "/office",
    "/office/requests",
    "/office/rates",
    "/office/tours",
    "/office/places",
    "/office/blog",
    "/office/gallery",
    "/office/reviews",
    "/office/slides",
    "/office/site",
    "/office/users",
    "/office/backup",
  ],
  manager: ["/office", "/office/requests", "/office/rates"],
  editor: [
    "/office",
    "/office/requests",
    "/office/tours",
    "/office/places",
    "/office/blog",
    "/office/gallery",
    "/office/reviews",
    "/office/slides",
    "/office/site",
  ],
};

function sidebarLinks(html: string) {
  const links: string[] = [];
  for (const tag of html.match(/<a [^>]*class="nav-item"[^>]*>/g) ?? []) {
    const href = /href="([^"]+)"/.exec(tag)?.[1];
    if (href) links.push(href);
  }
  return links;
}

const SKARDU_QUOTE = {
  place: "Skardu Valley",
  startCity: "Islamabad",
  mode: "road",
  days: 5,
  adults: 2,
  children: 0,
  lapInfants: 0,
  seatInfants: 0,
  grade: "Deluxe",
  vehicle: "Gli Car",
  guide: false,
  meals: false,
};

// A Manager's quote sends no margin, so it uses the saved one and shows the subtotal and the profit.
// A guest's quote shows only the total.
async function skarduQuote(cookie: string) {
  const response = await fetch(`${siteBase()}/api/quote`, {
    method: "POST",
    headers: { "content-type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(SKARDU_QUOTE),
  });
  return (await response.json()) as { ok?: boolean; subtotal?: number; profit?: number; total?: number; seasonPercent?: number };
}

function marginForm(percent: string) {
  const form = new FormData();
  form.set("kind", "season");
  form.set("percent", percent);
  return form;
}

// T-37f: the margin is one whole percent from 0 to 100, saved by the Owner or a Manager only.
async function assertProfitMargin(editorCookie: string, managerCookie: string) {
  const [saved] = await db.select({ percent: seasons.percent }).from(seasons).limit(1);
  if (saved?.percent !== 20) throw new Error(`The profit margin starts at ${saved?.percent ?? "nothing"}, not 20.`);
  try {
    const editorSave = await officePost("/api/office/rates", marginForm("16"), editorCookie);
    if (editorSave.status !== 403) throw new Error(`An Editor margin save returned ${editorSave.status}.`);
    for (const refused of ["101", "12.5", "-1", ""]) {
      const result = await officePost("/api/office/rates", marginForm(refused), managerCookie);
      if (result.status !== 400 || result.body.ok) throw new Error(`The margin "${refused}" was not refused: ${result.status}.`);
    }
    const [unchanged] = await db.select({ percent: seasons.percent }).from(seasons).limit(1);
    if (unchanged?.percent !== 20) throw new Error("A refused margin changed the saved margin.");

    const atTwenty = await skarduQuote(managerCookie);
    if (atTwenty.subtotal !== 117000 || atTwenty.profit !== 23400 || atTwenty.total !== 140400) {
      throw new Error(`The Skardu quote at 20 percent was ${atTwenty.total}.`);
    }
    for (const [percent, profit] of [["16", 18720], ["30", 35100]] as const) {
      const result = await officePost("/api/office/rates", marginForm(percent), managerCookie);
      if (result.status !== 200 || !result.body.ok) throw new Error(`The margin ${percent} was not saved: ${result.body.error ?? result.status}.`);
      const quote = await skarduQuote(managerCookie);
      if (quote.seasonPercent !== Number(percent) || quote.subtotal !== 117000 || quote.profit !== profit || quote.total !== 117000 + profit) {
        throw new Error(`At ${percent} percent the Skardu quote was ${quote.subtotal} plus ${quote.profit}.`);
      }
      const guest = await skarduQuote("");
      if (guest.total !== 117000 + profit || guest.profit !== undefined) {
        throw new Error(`At ${percent} percent the guest total was ${guest.total}.`);
      }
    }
  } finally {
    await db.update(seasons).set({ percent: 20 });
  }
  const [back] = await db.select({ percent: seasons.percent }).from(seasons).limit(1);
  if (back?.percent !== 20) throw new Error("The profit margin was not put back to 20.");
}

// T-37b: the session reply carries the sidebar count of new requests, and only with a session.
async function assertSessionRequestCount(ownerCookie: string) {
  const [row] = await db.select({ total: count() }).from(guestRequests).where(eq(guestRequests.status, "new"));
  const expected = row?.total ?? 0;
  const signedIn = await fetch(`${siteBase()}/api/office/session`, { headers: { cookie: ownerCookie } });
  const body = (await signedIn.json()) as { ok?: boolean; newRequestCount?: unknown };
  if (signedIn.status !== 200 || !body.ok || body.newRequestCount !== expected) {
    throw new Error(`The session reply has newRequestCount ${String(body.newRequestCount)}, not ${expected}.`);
  }
  const signedOut = await fetch(`${siteBase()}/api/office/session`);
  const outText = await signedOut.text();
  if (signedOut.status !== 401 || outText.includes("newRequestCount")) {
    throw new Error(`Without a session the session reply returned ${signedOut.status} or a request count.`);
  }
}

// T-37a: the Meadow shell shows each role only the links it may use.
async function assertOfficeShellLinks(editorCookie: string, managerCookie: string, ownerCookie: string) {
  const cookies = { owner: ownerCookie, manager: managerCookie, editor: editorCookie };
  for (const role of ["owner", "manager", "editor"] as const) {
    const page = await officeGet("/office", cookies[role]);
    if (page.status !== 200) throw new Error(`The ${role} office page returned ${page.status}.`);
    const shown = sidebarLinks(page.text).join(" ");
    const expected = OFFICE_LINKS_BY_ROLE[role].join(" ");
    if (shown !== expected) throw new Error(`The ${role} sidebar shows ${shown || "no links"}, not ${expected}.`);
    if (page.text.includes("Trip plans") || page.text.includes("View as")) {
      throw new Error(`The ${role} office shows a prototype-only control.`);
    }
  }
}

function assertBookNowOpensOnClick() {
  const source = readFileSync(new URL("../components/tours/TourDetail.tsx", import.meta.url), "utf8");
  if (!source.includes(WHATSAPP) || source.includes("preventDefault") || source.includes("window.open")) {
    throw new Error("Book Now must open the WhatsApp link on the click.");
  }
}

async function main() {
  await runStep2();
  const marker = `step3-part1-${Date.now()}`;
  const phone = "03009990001";
  const savedIds: number[] = [];
  try {
    const contactMessage = `Subject: A question\n\n<b>${marker} contact</b>`;
    const contact = await postRequest({
      kind: "contact",
      name: "Step Three Guest",
      email: "step3-guest@travelwithmoeen.test",
      phone,
      message: contactMessage,
    });
    if (contact.status !== 200 || !contact.body.ok || !contact.body.id) {
      throw new Error("A contact was not saved.");
    }
    if (contact.text.includes(phone) || contact.body.phone || contact.body.message || contact.body.email) {
      throw new Error("The save response included the guest details.");
    }
    savedIds.push(contact.body.id);
    const [row] = await db.select().from(guestRequests).where(eq(guestRequests.id, contact.body.id));
    if (
      !row ||
      row.kind !== "contact" ||
      row.status !== "new" ||
      row.name !== "Step Three Guest" ||
      row.phone !== phone ||
      row.email !== "step3-guest@travelwithmoeen.test" ||
      row.message !== contactMessage
    ) {
      throw new Error("The saved contact could not be read back.");
    }

    const tooLong = await postRequest({
      kind: "contact",
      name: "Step Three Guest",
      email: "step3-guest@travelwithmoeen.test",
      message: "m".repeat(GUEST_MESSAGE_LIMIT + 1),
    });
    if (tooLong.status !== 400 || tooLong.body.ok) {
      throw new Error("A message over 4,000 characters was accepted.");
    }
    const longName = await postRequest({
      kind: "contact",
      name: "n".repeat(GUEST_NAME_LIMIT + 1),
      email: "step3-guest@travelwithmoeen.test",
      message: marker,
    });
    if (longName.status !== 400) throw new Error("A name over 200 characters was accepted.");
    const longPhone = await postRequest({
      kind: "booking",
      phone: "1".repeat(GUEST_PHONE_LIMIT + 1),
      message: marker,
    });
    if (longPhone.status !== 400) throw new Error("A phone number over 40 characters was accepted.");
    const longEmail = await postRequest({
      kind: "custom",
      name: "Step Three Guest",
      email: `${"e".repeat(GUEST_EMAIL_LIMIT)}@x.test`,
      message: marker,
    });
    if (longEmail.status !== 400) throw new Error("An email over 200 characters was accepted.");

    const custom = await postRequest({
      kind: "custom",
      name: "Step Three Guest",
      phone: "+92 3001112233",
      email: "",
      message: `${marker} custom trip`,
    });
    if (custom.status !== 200 || !custom.body.id) throw new Error("A custom trip was not saved.");
    savedIds.push(custom.body.id);
    const [customRow] = await db.select().from(guestRequests).where(eq(guestRequests.id, custom.body.id));
    if (!customRow || customRow.kind !== "custom" || customRow.status !== "new" || customRow.message !== `${marker} custom trip`) {
      throw new Error("The saved custom trip could not be read back.");
    }

    const booking = await postRequest({
      kind: "booking",
      message: `${marker} booking`,
    });
    if (booking.status !== 200 || !booking.body.id) throw new Error("A booking was not saved.");
    savedIds.push(booking.body.id);
    const [bookingRow] = await db.select().from(guestRequests).where(eq(guestRequests.id, booking.body.id));
    if (!bookingRow || bookingRow.kind !== "booking" || bookingRow.status !== "new" || bookingRow.message !== `${marker} booking`) {
      throw new Error("The saved booking could not be read back.");
    }
    await assertBookingOnOfficeList(booking.body.id, `${marker} booking`);

    assertBookNowOpensOnClick();
    const tourRows = await db.select({ id: tours.id, name: tours.name }).from(tours);
    let bookNow = "";
    let tourName = "";
    for (const tour of tourRows) {
      const page = await fetch(`${siteBase()}/tours/${encodeURIComponent(tour.id)}`);
      const html = await page.text();
      if (!page.ok) continue;
      if (html.includes(PLACEHOLDER_PHONE)) {
        throw new Error("A tour page still uses the placeholder phone link.");
      }
      const href = bookNowHref(html);
      if (!href) continue;
      bookNow = href;
      tourName = tour.name;
      break;
    }
    if (!bookNow.startsWith(WHATSAPP)) {
      throw new Error("Book Now does not open the WhatsApp link.");
    }
    const bookingText = new URL(bookNow).searchParams.get("text") ?? "";
    if (!bookingText.includes(tourName) || !bookingText.toLowerCase().includes("booking")) {
      throw new Error("Book Now does not carry the tour booking.");
    }
    const buttonBooking = await postRequest({ kind: "booking", message: bookingText });
    if (buttonBooking.status !== 200 || !buttonBooking.body.id) {
      throw new Error("The Book Now booking was not saved.");
    }
    savedIds.push(buttonBooking.body.id);
    const [buttonRow] = await db.select().from(guestRequests).where(eq(guestRequests.id, buttonBooking.body.id));
    if (!buttonRow || buttonRow.kind !== "booking" || buttonRow.message !== bookingText) {
      throw new Error("The Book Now booking could not be read back.");
    }

    const home = await fetch(`${siteBase()}/`);
    const homeText = await home.text();
    if (!home.ok) throw new Error("The public home page did not load.");
    if (homeText.includes(PLACEHOLDER_PHONE)) {
      throw new Error("The public home page still uses the placeholder phone link.");
    }
    if (homeText.includes(phone)) {
      throw new Error("The public home page includes the test guest phone.");
    }
    await assertOfficeRequests(savedIds);
    console.log("Step 3 checks passed.");
  } finally {
    for (const id of savedIds) {
      await db.delete(guestRequests).where(eq(guestRequests.id, id));
    }
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sql.end({ timeout: 5 });
  });
