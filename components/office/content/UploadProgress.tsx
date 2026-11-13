"use client";

import type { UploadProgressState } from "@/components/office/content/uploads";
import { Button } from "@/components/office/ui/Button";

function megabytes(bytes: number) {
  return (bytes / (1024 * 1024)).toFixed(1);
}

export function uploadText(progress: UploadProgressState) {
  const percent = progress.total > 0 ? Math.round((progress.loaded / progress.total) * 100) : 0;
  const which = progress.count > 1 ? ` file ${progress.index + 1} of ${progress.count}:` : "";
  return { percent, text: `Uploading${which} ${megabytes(progress.loaded)} of ${megabytes(progress.total)} MB, ${percent}%` };
}

// T-50 (BR-97, BR-100): the upload bar, the amount sent and the file size, and Cancel. Cancel stops
// the upload before the save is sent. The bar is a progressbar with the same text for a screen reader.
export function UploadProgress({ progress, onCancel }: { progress: UploadProgressState | null; onCancel: () => void }) {
  if (!progress) return null;
  const { percent, text } = uploadText(progress);
  return (
    <div className="upload-progress">
      <div className="upload-progress-row">
        <span>{text}</span>
        <Button variant="secondary" size="sm" onClick={onCancel}>
          Cancel upload
        </Button>
      </div>
      <div
        className="upload-progress-bar"
        role="progressbar"
        aria-label={`Uploading ${progress.fileName}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={text}
      >
        <div className="upload-progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
