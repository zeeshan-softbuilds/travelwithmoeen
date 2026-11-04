import { upload } from "@vercel/blob/client";
import { apiPath } from "@/lib/http/api-path";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

// T-51: Vercel refuses a request over 4.5 MB before the site runs, so a chosen file cannot travel in
// the save. When Save is pressed, each chosen file is uploaded straight to the media store, and the
// save is sent with its address as <field>Uploaded instead of the file. The server checks the file.
const IMAGE_EXTENSION: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const LIMIT = { image: 5 * 1024 * 1024, pdf: 10 * 1024 * 1024 };

function chosenFiles(formData: FormData) {
  return [...formData.entries()].filter((entry): entry is [string, File] => entry[1] instanceof File && entry[1].size > 0);
}

async function uploadChosenFile(name: string, file: File): Promise<string | ActionResult> {
  // The tour PDF is the only file field that is not a picture.
  const kind = name === "pdfFile" ? "pdf" : "image";
  const extension = kind === "pdf" ? (file.type === "application/pdf" ? "pdf" : null) : (IMAGE_EXTENSION[file.type] ?? null);
  if (!extension) return { ok: false, error: kind === "pdf" ? "Use a PDF file." : "Use a JPEG, PNG, or WebP file." };
  if (file.size > LIMIT[kind]) return { ok: false, error: kind === "pdf" ? "The file is larger than 10 MB." : "The file is larger than 5 MB." };
  try {
    const stored = await upload(`media/upload.${extension}`, file, {
      access: "public",
      handleUploadUrl: apiPath("/api/office/uploads"),
      clientPayload: JSON.stringify({ kind }),
      contentType: file.type,
    });
    return stored.url;
  } catch {
    return { ok: false, error: "The file could not be uploaded. Check the connection and save again." };
  }
}

// Uploads each chosen file, then sends the save. If an upload fails, the save is not sent, so the
// record does not change and the form keeps what was typed.
export async function postOfficeFormWithUploads(path: string, formData: FormData): Promise<ActionResult> {
  for (const [name, file] of chosenFiles(formData)) {
    const uploaded = await uploadChosenFile(name, file);
    if (typeof uploaded !== "string") return uploaded;
    formData.delete(name);
    formData.set(`${name}Uploaded`, uploaded);
  }
  return postOfficeForm(path, formData);
}
