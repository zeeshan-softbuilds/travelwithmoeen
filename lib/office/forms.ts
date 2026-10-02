import { authenticate } from "@/lib/auth/authenticate";
import { loginIsLocked, logLockedSignIn, recordLoginFailure } from "@/lib/auth/login-guard";
import { clearSessionCookie, setSessionCookie, type SessionUser } from "@/lib/auth/session";
import type { ActionResult } from "@/lib/http/result";
import type { BlogSection } from "@/data/blog";
import type { DestinationSection } from "@/data/destinations";
import { createUserAs, changeRoleAs, removeUserAs } from "@/lib/office/users";
import { savePriceFromKind } from "@/lib/office/rates";
import {
  deletePhotoAs,
  deleteReviewAs,
  deleteSlideAs,
  deleteTourAs,
  savePhotoAs,
  saveReviewAs,
  saveSlideAs,
  saveUploadedImage,
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

export async function updateTourFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  let image = String(formData.get("image") ?? "");
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const uploaded = await applyUploadedImage(actor, file);
    if (typeof uploaded !== "string") return uploaded;
    image = uploaded;
  }
  let itinerary: TourEditInput["itinerary"];
  try {
    itinerary = JSON.parse(String(formData.get("itinerary") ?? "[]")) as TourEditInput["itinerary"];
  } catch {
    return { ok: false, error: "The day plan could not be read." };
  }
  return updateTourAs(actor, {
    id: String(formData.get("id") ?? ""),
    name: String(formData.get("name") ?? ""),
    location: String(formData.get("location") ?? ""),
    region: String(formData.get("region") ?? ""),
    description: String(formData.get("description") ?? ""),
    duration: Number(formData.get("duration") ?? 0),
    image,
    pdf: String(formData.get("pdf") ?? ""),
    galleryImages: lines(String(formData.get("galleryImages") ?? "")),
    categories: lines(String(formData.get("categories") ?? "")) as TourEditInput["categories"],
    packageTypes: lines(String(formData.get("packageTypes") ?? "")) as TourEditInput["packageTypes"],
    transport: String(formData.get("transport") ?? ""),
    included: lines(String(formData.get("included") ?? "")),
    notIncluded: lines(String(formData.get("notIncluded") ?? "")),
    featured: formData.get("featured") === "on",
    itinerary,
  });
}

export async function deleteTourFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return deleteTourAs(actor, String(formData.get("id") ?? ""));
}

export async function updatePlaceFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  let content: DestinationSection[];
  try {
    content = JSON.parse(String(formData.get("content") ?? "[]")) as DestinationSection[];
  } catch {
    return { ok: false, error: "The place text could not be read." };
  }
  return updatePlaceAs(actor, {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    bannerImage: String(formData.get("bannerImage") ?? ""),
    location: String(formData.get("location") ?? ""),
    content,
  });
}

export async function updatePostFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  let content: BlogSection[];
  try {
    content = JSON.parse(String(formData.get("content") ?? "[]")) as BlogSection[];
  } catch {
    return { ok: false, error: "The post text could not be read." };
  }
  return updatePostAs(actor, {
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    author: String(formData.get("author") ?? ""),
    date: String(formData.get("date") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    content,
  });
}

export async function savePhotoFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  let src = String(formData.get("src") ?? "");
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const uploaded = await applyUploadedImage(actor, file);
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
}

export async function deletePhotoFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return deletePhotoAs(actor, Number(formData.get("id")));
}

export async function saveReviewFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  const idValue = String(formData.get("id") ?? "");
  return saveReviewAs(actor, {
    id: idValue ? Number(idValue) : undefined,
    name: String(formData.get("name") ?? ""),
    avatar: String(formData.get("avatar") ?? ""),
    location: String(formData.get("location") ?? ""),
    text: String(formData.get("text") ?? ""),
    rating: Number(formData.get("rating") ?? 5),
  });
}

export async function deleteReviewFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  return deleteReviewAs(actor, Number(formData.get("id")));
}

export async function saveSlideFromForm(actor: SessionUser, formData: FormData): Promise<ActionResult> {
  let image = String(formData.get("image") ?? "");
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    const uploaded = await applyUploadedImage(actor, file);
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
