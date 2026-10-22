"use client";

import { useEffect, useId, useRef, useState } from "react";
import { photoStyle } from "@/components/office/content/media";
import { Button } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";

const PHOTO_TYPES = "image/jpeg,image/png,image/webp";

type FileFieldProps = {
  label: string;
  // The stored path or URL, sent as pathName. Omit pathName for a field that only uploads.
  pathName?: string;
  fileName: string;
  value?: string;
  onChange?: (value: string) => void;
  // Called with a browser preview URL when a file is chosen, or "" when it is cleared.
  onFile?: (previewUrl: string) => void;
  removeLabel?: string;
  kind?: "photo" | "pdf";
  help?: string;
};

// The prototype drop box: the current file, a chooser, the stored path, and Remove where the
// office allows it. Removing clears the path, and the save removes the office file from storage.
export function FileField({ label, pathName, fileName, value = "", onChange, onFile, removeLabel, kind = "photo", help }: FileFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [chosen, setChosen] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const isPdf = kind === "pdf";
  const defaultHelp = isPdf ? "PDF only." : "JPEG, PNG, or WebP. 5 MB or less.";
  const thumb = previewUrl || (!isPdf ? value : "");

  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = "";
    setChosen("");
    setPreviewUrl("");
    onFile?.("");
  };

  return (
    <div className="field">
      <span className="label" id={`${id}-label`}>
        {label}
      </span>
      <div className="drop">
        <span className={chosen ? "drop-thumb is-file" : "drop-thumb"} style={photoStyle(thumb)} aria-hidden="true">
          {thumb ? null : <Icon name={isPdf ? "file" : "image"} />}
        </span>
        <div className="drop-main">
          <label className="drop-label">
            <input
              ref={inputRef}
              className="sr-only"
              type="file"
              name={fileName}
              accept={isPdf ? "application/pdf" : PHOTO_TYPES}
              aria-labelledby={`${id}-label`}
              aria-describedby={`${id}-help`}
              onChange={(event) => {
                const file = event.target.files?.[0];
                setChosen(file?.name ?? "");
                const url = file && !isPdf ? URL.createObjectURL(file) : "";
                setPreviewUrl(url);
                onFile?.(url);
              }}
            />
            <b>{value || chosen ? `Choose a new ${isPdf ? "PDF" : "photo"}` : `Choose a ${isPdf ? "PDF" : "photo"}`}</b>
          </label>
          {chosen ? (
            <span className="file-name">
              {chosen} <span className="muted">will upload when you save.</span>
            </span>
          ) : value && isPdf ? (
            <a className="file-name" href={value} target="_blank" rel="noopener noreferrer">
              Open the current PDF
            </a>
          ) : null}
          <p className="help" id={`${id}-help`}>
            {help ?? defaultHelp}
          </p>
          <div className="drop-actions">
            {chosen ? (
              <Button variant="ghost" size="sm" onClick={clearFile}>
                Clear choice
              </Button>
            ) : null}
            {removeLabel && value && onChange ? (
              <Button variant="danger-outline" size="sm" icon="trash" onClick={() => onChange("")}>
                {removeLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
      {pathName || onChange ? (
        <label className="help" htmlFor={`${id}-path`}>
          {isPdf ? "PDF path" : "Photo path"}
        </label>
      ) : null}
      {pathName || onChange ? (
        onChange ? (
          <input className="input path-input" id={`${id}-path`} name={pathName} value={value} onChange={(event) => onChange(event.target.value)} />
        ) : (
          <input className="input path-input" id={`${id}-path`} name={pathName} defaultValue={value} />
        )
      ) : null}
    </div>
  );
}
