import { authenticate } from "@/lib/auth/authenticate";
import { loginIsLocked, logLockedSignIn, recordLoginFailure } from "@/lib/auth/login-guard";
import { clearSessionCookie, setSessionCookie, type SessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/http/result";
import type { BlogSection } from "@/data/blog";
import type { DestinationSection } from "@/data/destinations";
import { createUserAs, changeRoleAs, removeUserAs } from "@/lib/office/users";
import { deleteOfficeFiles } from "@/lib/office/media";
import { savePriceFromKind } from "@/lib/office/rates";
import {
  deletePhotoAs,
  deleteReviewAs,
  deleteSlideAs,
  createTourAs,
  deleteTourAs,
  savePhotoAs,
  saveReviewAs,
  saveSlideAs,
  saveUploadedImage,
  saveUploadedPdf,
  updatePlaceAs,
  updatePostAs,
  updateSiteSettingsAs,
  updateTourAs,
  type TourEditInput,
} from "@/lib/office/content-writes";

function lines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

const LOGIN_ERROR = "That email or password is not right.";

async function applyUploadedImage(actor: SessionUser, file: File): Promise<string | ActionResult> {
  try {
    return await saveUploadedImage(actor, file);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "The photo could not be saved." };
  }
}

async function applyUploadedPdf(actor: SessionUser, file: File): Promise<string | ActionResult> {
  try {
    return await saveUploadedPdf(actor, file);
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "The PDF could not be saved." };
  }
}

// T-40: a save remembers each file it stored in this request. When the save is refused, or fails,
// those files are deleted, so nothing is left in the media store that no record points at. Only
// files stored here are on the list, and deleteOfficeFiles never removes /images/ or /pdfs/.
async function storeImage(actor: SessionUser, stored: string[], file: File): Promise<string | ActionResult> {
  const uploaded = await applyUploadedImage(actor, file);
  if (typeof uploaded === "string") stored.push(uploaded);
  return uploaded;
}

async function storePdf(actor: SessionUser, stored: string[], file: File): Promise<string | ActionResult> {
  const uploaded = await applyUploadedPdf(actor, file);
  if (typeof uploaded === "string") stored.push(uploaded);
  return uploaded;
}

async function discardStored(stored: string[]) {
  if (stored.length === 0) return;
  try {
    await deleteOfficeFiles(stored);
  } catch {
    // The refusal is the answer the office needs. A file that could not be removed stays, as before T-40.
  }
}

async function keepFilesOnlyIfSaved(stored: string[], save: () => Promise<ActionResult>): Promise<ActionResult> {
  let result: ActionResult;
  try {
    result = await save();
  } catch (error) {
    await discardStored(stored);
    throw error;
  }
  if (!result.ok) await discardStored(stored);
  return result;
}

function uploadedFile(formData: FormData, name: string) {
  const file = formData.get(name);
  return file instanceof File && file.size > 0 ? file : null;
}

function stringList(formData: FormData, name: string) {
  return formData
    .getAll(name)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function loginFromForm(formData: FormData): Promise<ActionResult> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (await loginIsLocked(email)) {
    logLockedSignIn(email);
    return { ok: false, error: LOGIN_ERROR };
  }
  const user = await authenticate(email, password);
  if (!user) {
    await recordLoginFailure(email);
    return { ok: false, error: LOGIN_ERROR };
  }
  await setSessionCookie(user.id);
  return { ok: true };
}

export async function logoutFromForm(): Promise<ActionResult> {
  await clearSessionCookie();
  return { ok: true };
}

export async function createUserFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return createUserAs(actor, {
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    role: String(formData.get("role") ?? ""),
  });
}

export async function changeRoleFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return changeRoleAs(actor, Number(formData.get("userId")), String(formData.get("role") ?? ""));
}

export async function removeUserFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return removeUserAs(actor, Number(formData.get("userId")));
}

export async function savePriceFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return savePriceFromKind(actor, formData);
}

async function tourBodyFromForm(actor: SessionUser, formData: FormData, stored: string[]): Promise<Omit<TourEditInput, "id"> | ActionResult> {
  let image = String(formData.get("image") ?? "");
  const file = uploadedFile(formData, "photo");
  if (file) {
    const uploaded = await storeImage(actor, stored, file);
    if (typeof uploaded !== "string") return uploaded;
    image = uploaded;
  }
  let pdf = String(formData.get("pdf") ?? "");
  const pdfFile = uploadedFile(formData, "pdfFile");
  if (pdfFile) {
    const uploaded = await storePdf(actor, stored, pdfFile);
    if (typeof uploaded !== "string") return uploaded;
    pdf = uploaded;
  }
  const galleryImages =
    formData.get("galleryImageSet") === "1" ? stringList(formData, "galleryImage") : lines(String(formData.get("galleryImages") ?? ""));
  const extraPhoto = uploadedFile(formData, "extraPhoto");
  if (extraPhoto) {
    const uploaded = await storeImage(actor, stored, extraPhoto);
    if (typeof uploaded !== "string") return uploaded;
    galleryImages.push(uploaded);
  }
  let itinerary: TourEditInput["itinerary"];
  try {
    itinerary = JSON.parse(String(formData.get("itinerary") ?? "[]")) as TourEditInput["itinerary"];
  } catch {
    return { ok: false, error: "The day plan could not be read." };
  }
  const placeSlugs = formData.get("placeSet") === "1" ? stringList(formData, "placeSlug") : undefined;
  return {
    name: String(formData.get("name") ?? ""),
    location: String(formData.get("location") ?? ""),
    region: String(formData.get("region") ?? ""),
    description: String(formData.get("description") ?? ""),
    duration: Number(formData.get("duration") ?? 0),
    image,
    pdf,
    galleryImages,
    categories: lines(String(formData.get("categories") ?? "")) as TourEditInput["categories"],
    packageTypes: lines(String(formData.get("packageTypes") ?? "")) as TourEditInput["packageTypes"],
    transport: String(formData.get("transport") ?? ""),
    included: lines(String(formData.get("included") ?? "")),
    notIncluded: lines(String(formData.get("notIncluded") ?? "")),
    featured: formData.get("featured") === "on",
    itinerary,
    placeSlugs,
  };
}

function isTourBody(value: Omit<TourEditInput, "id"> | ActionResult): value is Omit<TourEditInput, "id"> {
  return !("ok" in value);
}

export async function updateTourFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const stored: string[] = [];
  return keepFilesOnlyIfSaved(stored, async () => {
    const body = await tourBodyFromForm(actor, formData, stored);
    if (!isTourBody(body)) return body;
    return updateTourAs(actor, { ...body, id: String(formData.get("id") ?? "") });
  });
}

export async function createTourFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const stored: string[] = [];
  return keepFilesOnlyIfSaved(stored, async () => {
    const body = await tourBodyFromForm(actor, formData, stored);
    if (!isTourBody(body)) return body;
    return createTourAs(actor, body);
  });
}

export async function deleteTourFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return deleteTourAs(actor, String(formData.get("id") ?? ""));
}

export async function updatePlaceFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const stored: string[] = [];
  return keepFilesOnlyIfSaved(stored, async () => {
    let content: DestinationSection[];
    try {
      content = JSON.parse(String(formData.get("content") ?? "[]")) as DestinationSection[];
    } catch {
      return { ok: false, error: "The place text could not be read." };
    }
    let bannerImage = String(formData.get("bannerImage") ?? "");
    const bannerPhoto = uploadedFile(formData, "bannerPhoto");
    if (bannerPhoto) {
      const uploaded = await storeImage(actor, stored, bannerPhoto);
      if (typeof uploaded !== "string") return uploaded;
      bannerImage = uploaded;
    }
    for (let index = 0; index < content.length; index += 1) {
      const sectionPhoto = uploadedFile(formData, `sectionPhoto_${index}`);
      if (!sectionPhoto) continue;
      const uploaded = await storeImage(actor, stored, sectionPhoto);
      if (typeof uploaded !== "string") return uploaded;
      content[index] = { ...content[index], image: uploaded };
    }
    return updatePlaceAs(actor, {
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      bannerImage,
      location: String(formData.get("location") ?? ""),
      content,
    });
  });
}

export async function updatePostFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const stored: string[] = [];
  return keepFilesOnlyIfSaved(stored, async () => {
    let content: BlogSection[];
    try {
      content = JSON.parse(String(formData.get("content") ?? "[]")) as BlogSection[];
    } catch {
      return { ok: false, error: "The post text could not be read." };
    }
    let coverImage = String(formData.get("coverImage") ?? "");
    const coverPhoto = uploadedFile(formData, "coverPhoto");
    if (coverPhoto) {
      const uploaded = await storeImage(actor, stored, coverPhoto);
      if (typeof uploaded !== "string") return uploaded;
      coverImage = uploaded;
    }
    for (let index = 0; index < content.length; index += 1) {
      const sectionPhoto = uploadedFile(formData, `sectionPhoto_${index}`);
      if (!sectionPhoto) continue;
      const uploaded = await storeImage(actor, stored, sectionPhoto);
      if (typeof uploaded !== "string") return uploaded;
      content[index] = { ...content[index], image: uploaded };
    }
    return updatePostAs(actor, {
      slug: String(formData.get("slug") ?? ""),
      title: String(formData.get("title") ?? ""),
      excerpt: String(formData.get("excerpt") ?? ""),
      author: String(formData.get("author") ?? ""),
      date: String(formData.get("date") ?? ""),
      coverImage,
      content,
    });
  });
}

export async function savePhotoFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const stored: string[] = [];
  return keepFilesOnlyIfSaved(stored, async () => {
    let src = String(formData.get("src") ?? "");
    const file = formData.get("photo");
    if (file instanceof File && file.size > 0) {
      const uploaded = await storeImage(actor, stored, file);
      if (typeof uploaded !== "string") return uploaded;
      src = uploaded;
    }
    const idValue = String(formData.get("id") ?? "");
    return savePhotoAs(actor, {
      id: idValue ? Number(idValue) : undefined,
      src,
      alt: String(formData.get("alt") ?? ""),
      category: String(formData.get("category") ?? ""),
      span: String(formData.get("span") ?? ""),
      homeOnly: formData.get("homeOnly") === "on",
    });
  });
}

export async function deletePhotoFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return deletePhotoAs(actor, Number(formData.get("id")));
}

export async function saveReviewFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const stored: string[] = [];
  return keepFilesOnlyIfSaved(stored, async () => {
    const idValue = String(formData.get("id") ?? "");
    let avatar = String(formData.get("avatar") ?? "");
    const avatarPhoto = uploadedFile(formData, "avatarPhoto");
    if (avatarPhoto) {
      const uploaded = await storeImage(actor, stored, avatarPhoto);
      if (typeof uploaded !== "string") return uploaded;
      avatar = uploaded;
    }
    return saveReviewAs(actor, {
      id: idValue ? Number(idValue) : undefined,
      name: String(formData.get("name") ?? ""),
      avatar,
      location: String(formData.get("location") ?? ""),
      text: String(formData.get("text") ?? ""),
      rating: Number(formData.get("rating") ?? 5),
    });
  });
}

export async function deleteReviewFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return deleteReviewAs(actor, Number(formData.get("id")));
}

export async function saveSlideFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const stored: string[] = [];
  return keepFilesOnlyIfSaved(stored, async () => {
    let image = String(formData.get("image") ?? "");
    const file = formData.get("photo");
    if (file instanceof File && file.size > 0) {
      const uploaded = await storeImage(actor, stored, file);
      if (typeof uploaded !== "string") return uploaded;
      image = uploaded;
    }
    const idValue = String(formData.get("id") ?? "");
    return saveSlideAs(actor, {
      id: idValue ? Number(idValue) : undefined,
      image,
      title: String(formData.get("title") ?? ""),
      rotation: Number(formData.get("rotation") ?? 0),
      sortOrder: Number(formData.get("sortOrder") ?? 0),
    });
  });
}

export async function deleteSlideFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return deleteSlideAs(actor, Number(formData.get("id")));
}

export async function updateSiteFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return updateSiteSettingsAs(actor, {
    phoneDisplay: String(formData.get("phoneDisplay") ?? ""),
    phoneE164: String(formData.get("phoneE164") ?? ""),
    email: String(formData.get("email") ?? ""),
    address: String(formData.get("address") ?? ""),
    mapsUrl: String(formData.get("mapsUrl") ?? ""),
    facebookUrl: String(formData.get("facebookUrl") ?? ""),
    instagramUrl: String(formData.get("instagramUrl") ?? ""),
    tiktokUrl: String(formData.get("tiktokUrl") ?? ""),
    youtubeUrl: String(formData.get("youtubeUrl") ?? ""),
  });
}
