import { randomBytes } from "crypto";
import { del, head, put } from "@vercel/blob";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { canEditContent } from "@/lib/auth/permissions";
import type { SessionUser } from "@/lib/auth/session";
import { forbidden, type ActionResult } from "@/lib/http/result";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_PDF_BYTES = 10 * 1024 * 1024;

function mediaToken() {
  const token = process.env.MEDIA_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("Storage is not connected.");
  }
  return token;
}

export function officeMediaPath(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  let pathname = "";
  if (trimmed.startsWith("/")) {
    pathname = trimmed.slice(1);
  } else {
    try {
      pathname = decodeURIComponent(new URL(trimmed).pathname).replace(/^\/+/, "");
    } catch {
      return null;
    }
  }
  if (pathname.startsWith("backups/") || pathname.startsWith("images/") || pathname.startsWith("pdfs/")) {
    return null;
  }
  if (!pathname.startsWith("media/")) return null;
  const fileName = pathname.slice("media/".length);
  if (!fileName || fileName.includes("/") || fileName.includes("\\")) return null;
  return `media/${fileName}`;
}

export function droppedOfficeFiles(before: string[], after: string[]) {
  const kept = new Set(after.map((value) => value.trim()).filter(Boolean));
  return before.filter((value) => {
    const trimmed = value.trim();
    return trimmed !== "" && !kept.has(trimmed);
  });
}

export async function deleteOfficeFiles(urls: string[]) {
  const paths = [...new Set(urls.map((url) => officeMediaPath(url)).filter((path) => path !== null))];
  if (paths.length === 0) return;
  try {
    await del(paths, { token: mediaToken() });
  } catch (error) {
    if (error instanceof Error && error.message === "Storage is not connected.") throw error;
    throw new Error("The file could not be removed.");
  }
}

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

function isPdf(bytes: Buffer) {
  return bytes.length >= 5 && bytes.toString("ascii", 0, 5) === "%PDF-";
}

// T-51 (BR-101 to BR-104): the browser uploads an office file straight to the media store, because
// Vercel refuses a request over 4.5 MB before the site runs. The site only hands out a short-lived
// permission for one file, and the save checks the stored file before the record changes.
export type UploadKind = "image" | "pdf";

const UPLOAD_RULES: Record<UploadKind, { types: string[]; extensions: string[]; maxBytes: number }> = {
  image: { types: ["image/jpeg", "image/png", "image/webp"], extensions: ["jpg", "png", "webp"], maxBytes: MAX_IMAGE_BYTES },
  pdf: { types: ["application/pdf"], extensions: ["pdf"], maxBytes: MAX_PDF_BYTES },
};
const UPLOAD_MINUTES = 10;

class UploadRefused extends Error {}

function uploadKind(clientPayload: string | null): UploadKind {
  let kind: unknown = null;
  try {
    kind = (JSON.parse(clientPayload ?? "null") as { kind?: unknown } | null)?.kind;
  } catch {
    kind = null;
  }
  if (kind !== "image" && kind !== "pdf") throw new UploadRefused("Choose a photo or a PDF to upload.");
  return kind;
}

// The stored name is media/upload plus a random suffix the browser cannot choose, with no folder.
function uploadRules(pathname: string, clientPayload: string | null) {
  const kind = uploadKind(clientPayload);
  const rules = UPLOAD_RULES[kind];
  const match = /^media\/upload\.([a-z]+)$/.exec(pathname);
  if (!match || !rules.extensions.includes(match[1])) {
    throw new UploadRefused(kind === "image" ? "Use a JPEG, PNG, or WebP file." : "Use a PDF file.");
  }
  return {
    allowedContentTypes: rules.types,
    maximumSizeInBytes: rules.maxBytes,
    addRandomSuffix: true,
    validUntil: Date.now() + UPLOAD_MINUTES * 60 * 1000,
  };
}

function isTokenRequest(body: unknown): body is HandleUploadBody {
  if (!body || typeof body !== "object") return false;
  const event = body as { type?: unknown; payload?: { pathname?: unknown } };
  return event.type === "blob.generate-client-token" && typeof event.payload?.pathname === "string";
}

// POST /api/office/uploads. Only an Owner or an Editor gets a permission. There is no
// onUploadCompleted: it needs a public callback address, and the save checks the file instead.
export async function uploadPermissionAs(actor: SessionUser, body: unknown, request: Request) {
  if (!canEditContent(actor.role)) return { ok: false as const, error: "You cannot upload a file.", status: 403 as const };
  if (!isTokenRequest(body)) return { ok: false as const, error: "Send the upload again." };
  try {
    const reply = await handleUpload({
      body,
      request,
      token: mediaToken(),
      onBeforeGenerateToken: async (pathname, clientPayload) => uploadRules(pathname, clientPayload),
    });
    return { ok: true as const, reply };
  } catch (error) {
    if (error instanceof UploadRefused) return { ok: false as const, error: error.message };
    if (error instanceof Error && error.message === "Storage is not connected.") return { ok: false as const, error: error.message };
    return { ok: false as const, error: "The upload could not be started." };
  }
}

const NOT_IN_STORE = "That file is not in the office media store. Choose it again.";
// A direct upload is stored as media/upload plus the random suffix addRandomSuffix gives. Older office
// files are named media/<time>-<hex>, so they can never be taken for a fresh upload.
const FRESH_UPLOAD_NAME = /^media\/upload-[A-Za-z0-9]+\.(jpg|png|webp|pdf)$/;
const FRESH_UPLOAD_MINUTES = 15;

// A save that names an uploaded file checks it before the record changes: it is in this store under
// media/, it is under the size limit, and its first bytes are the kind it claims. The role is checked
// first, so a role that may not save never touches a stored file. Only a fresh direct upload is
// accepted: one with the upload name, stored in the last 15 minutes. Any other file, which a record
// may still use, is refused and never deleted, by this check or by the save's stored list. A fresh
// upload that fails is the uploader's own, so it is deleted.
export async function checkUploadedFile(actor: SessionUser, value: string, kind: UploadKind): Promise<string | ActionResult> {
  if (!canEditContent(actor.role)) return forbidden(kind === "pdf" ? "You cannot edit a tour." : "You cannot edit a photo.");
  const url = value.trim();
  const path = officeMediaPath(url);
  if (!path || !url.startsWith("https://") || !FRESH_UPLOAD_NAME.test(path)) return { ok: false, error: NOT_IN_STORE };
  const token = mediaToken();
  let stored: Awaited<ReturnType<typeof head>>;
  try {
    stored = await head(path, { token });
  } catch {
    return { ok: false, error: NOT_IN_STORE };
  }
  // The same path in another store is not this store's file.
  if (stored.url !== url) return { ok: false, error: NOT_IN_STORE };
  if (Date.now() - stored.uploadedAt.getTime() > FRESH_UPLOAD_MINUTES * 60 * 1000) return { ok: false, error: NOT_IN_STORE };
  const rules = UPLOAD_RULES[kind];
  let refusal = "";
  if (stored.size > rules.maxBytes) {
    refusal = kind === "image" ? "The file is larger than 5 MB." : "The file is larger than 10 MB.";
  } else {
    let bytes = Buffer.alloc(0);
    try {
      const response = await fetch(stored.url, { headers: { Range: "bytes=0-15" }, cache: "no-store" });
      bytes = Buffer.from(await response.arrayBuffer()).subarray(0, 16);
    } catch {
      return { ok: false, error: "The file could not be checked. Save again." };
    }
    if (kind === "image" && !imageKind(bytes)) refusal = "Use a JPEG, PNG, or WebP file.";
    if (kind === "pdf" && !isPdf(bytes)) refusal = "Use a PDF file.";
  }
  if (refusal) {
    try {
      await del(path, { token });
    } catch {
      // The refusal is the answer the office needs. A file that could not be removed stays.
    }
    return { ok: false, error: refusal };
  }
  return stored.url;
}

function fileName(kind: string) {
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${kind}`;
}

async function storePublicFile(bytes: Buffer, kind: string, contentType: string) {
  try {
    const blob = await put(`media/${fileName(kind)}`, bytes, {
      access: "public",
      token: mediaToken(),
      contentType,
      addRandomSuffix: false,
    });
    return blob.url;
  } catch (error) {
    if (error instanceof Error && error.message === "Storage is not connected.") throw error;
    throw new Error("The file could not be saved.");
  }
}

export async function saveUploadedImage(actor: SessionUser, file: File): Promise<string | ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit a photo.");
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("The file is larger than 5 MB.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_IMAGE_BYTES) {
    throw new Error("The file is larger than 5 MB.");
  }
  const kind = imageKind(bytes);
  if (!kind) {
    throw new Error("Use a JPEG, PNG, or WebP file.");
  }
  const contentType = kind === "png" ? "image/png" : kind === "webp" ? "image/webp" : "image/jpeg";
  return storePublicFile(bytes, kind, contentType);
}

export async function saveUploadedPdf(actor: SessionUser, file: File): Promise<string | ActionResult> {
  if (!canEditContent(actor.role)) {
    return forbidden("You cannot edit a tour.");
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("The file is larger than 10 MB.");
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  if (bytes.length > MAX_PDF_BYTES) {
    throw new Error("The file is larger than 10 MB.");
  }
  if (!isPdf(bytes)) {
    throw new Error("Use a PDF file.");
  }
  return storePublicFile(bytes, "pdf", "application/pdf");
}
