import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";
import { apiPath } from "@/lib/http/api-path";
import { startBusy } from "@/lib/http/office-busy";
import { busyOutcome, postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";

// T-51: Vercel refuses a request over 4.5 MB before the site runs, so a chosen file cannot travel in
// the save. When Save is pressed, each chosen file is uploaded straight to the media store, and the
// save is sent with its address as <field>Uploaded instead of the file. The server checks the file.
const IMAGE_EXTENSION: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const LIMIT = { image: 5 * 1024 * 1024, pdf: 10 * 1024 * 1024 };

export const UPLOAD_CANCELLED = "Upload cancelled. Nothing was saved.";

// T-50 (BR-97): how far the upload of one chosen file has got.
export type UploadProgressState = { fileName: string; loaded: number; total: number; index: number; count: number };

type UploadOptions = {
  // The office top bar label for the whole save, such as "Saving photo" (BR-98).
  label?: string;
  onProgress?: (progress: UploadProgressState | null) => void;
  signal?: AbortSignal;
};

function chosenFiles(formData: FormData) {
  return [...formData.entries()].filter((entry): entry is [string, File] => entry[1] instanceof File && entry[1].size > 0);
}

async function uploadChosenFile(name: string, file: File, report: (loaded: number) => void, signal?: AbortSignal): Promise<string | ActionResult> {
  // The tour PDF is the only file field that is not a picture.
  const kind = name === "pdfFile" ? "pdf" : "image";
  const extension = kind === "pdf" ? (file.type === "application/pdf" ? "pdf" : null) : (IMAGE_EXTENSION[file.type] ?? null);
  if (!extension) return { ok: false, error: kind === "pdf" ? "Use a PDF file." : "Use a JPEG, PNG, or WebP file." };
  if (file.size > LIMIT[kind]) return { ok: false, error: kind === "pdf" ? "The file is larger than 10 MB." : "The file is larger than 5 MB." };
  if (signal?.aborted) return { ok: false, error: UPLOAD_CANCELLED };
  // upload() does not pass the signal to its permission request, and a Cancel pressed while that
  // request runs leaves its promise unsettled for ever. So Cancel is raced against the upload here:
  // it always ends the wait. Once aborted, upload() sends no file, so nothing is stored.
  let stopWaiting = () => {};
  const cancelled = new Promise<"cancelled">((resolve) => {
    stopWaiting = () => resolve("cancelled");
    signal?.addEventListener("abort", stopWaiting, { once: true });
  });
  try {
    const stored = await Promise.race([
      upload(`media/upload.${extension}`, file, {
        access: "public",
        handleUploadUrl: apiPath("/api/office/uploads"),
        clientPayload: JSON.stringify({ kind }),
        contentType: file.type,
        abortSignal: signal,
        // After a Cancel, upload() can still report 0% once its permission arrives. That report would
        // bring the cancelled progress bar back, so reports stop with the Cancel.
        onUploadProgress: ({ loaded }) => {
          if (!signal?.aborted) report(loaded);
        },
      }),
      cancelled,
    ]);
    if (stored === "cancelled" || signal?.aborted) return { ok: false, error: UPLOAD_CANCELLED };
    return stored.url;
  } catch {
    if (signal?.aborted) return { ok: false, error: UPLOAD_CANCELLED };
    return { ok: false, error: "The file could not be uploaded. Check the connection and save again." };
  } finally {
    signal?.removeEventListener("abort", stopWaiting);
  }
}

// Uploads each chosen file, then sends the save. If an upload fails or is cancelled, the save is not
// sent, so the record does not change, no activity row is written, and the form keeps what was typed.
export async function postOfficeFormWithUploads(path: string, formData: FormData, options: UploadOptions = {}): Promise<ActionResult> {
  const end = options.label ? startBusy(options.label) : null;
  const files = chosenFiles(formData);
  for (const [index, [name, file]] of files.entries()) {
    const report = (loaded: number) => options.onProgress?.({ fileName: file.name, loaded: Math.min(loaded, file.size), total: file.size, index, count: files.length });
    report(0);
    const uploaded = await uploadChosenFile(name, file, report, options.signal);
    if (typeof uploaded !== "string") {
      options.onProgress?.(null);
      end?.(busyOutcome(uploaded));
      return uploaded;
    }
    formData.delete(name);
    formData.set(`${name}Uploaded`, uploaded);
  }
  options.onProgress?.(null);
  const result = await postOfficeForm(path, formData);
  end?.(busyOutcome(result));
  return result;
}

// The upload progress of one form, and its Cancel.
export function useUploadProgress() {
  const [progress, setProgress] = useState<UploadProgressState | null>(null);
  const controller = useRef<AbortController | null>(null);
  return {
    progress,
    // Options for postOfficeFormWithUploads, with a fresh Cancel for this save.
    begin(label: string): UploadOptions {
      controller.current = new AbortController();
      return { label, signal: controller.current.signal, onProgress: setProgress };
    },
    cancel() {
      controller.current?.abort();
    },
  };
}
