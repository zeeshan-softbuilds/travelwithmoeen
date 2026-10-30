"use client";

import { useActionState, useState } from "react";
import { DeleteCard } from "@/components/office/content/DeleteCard";
import { EditorDrawer } from "@/components/office/content/EditorDrawer";
import type { EditorFrame } from "@/components/office/content/frame";
import { photoStyle, rememberSaved } from "@/components/office/content/media";
import { FileField } from "@/components/office/content/PhotoField";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Card } from "@/components/office/ui/Card";
import { Field } from "@/components/office/ui/Field";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { GalleryImage } from "@/data/gallery";

export function PhotoForm({ photo, frame, savedBy }: { photo: GalleryImage | null; frame: EditorFrame; savedBy?: string }) {
  const [src, setSrc] = useState(photo?.src ?? "");
  const [chosenPreview, setChosenPreview] = useState("");
  const [alt, setAlt] = useState(photo?.alt ?? "");
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm("/api/office/photos", formData);
    if (result.ok) {
      rememberSaved(result.message ?? "Photo saved.");
      if (photo) window.location.reload();
      else window.location.assign(frame.closeHref);
    }
    return result;
  }, null as ActionResult | null);

  const preview = (
    <div className="pv-card">
      <span className="pv-img tall" style={photoStyle(chosenPreview || src)} />
      <div className="pv-body">
        <p>{alt || "Description"}</p>
      </div>
    </div>
  );

  return (
    <EditorDrawer
      title={photo ? "Edit photo" : "Add a photo"}
      description={photo ? photo.alt : "JPEG, PNG, or WebP up to 5 MB."}
      closeHref={frame.closeHref}
      savedBy={savedBy}
      previousHref={frame.previousHref}
      nextHref={frame.nextHref}
      position={photo ? frame.position : null}
      viewHref={photo ? "/gallery" : undefined}
      preview={preview}
    >
      <form action={action} className="stack">
        {photo ? <input type="hidden" name="id" value={photo.id} /> : null}
        <Card title="Photo">
          <FileField label={photo ? "Replace photo" : "Photo"} pathName="src" fileName="photo" value={src} onChange={setSrc} onFile={setChosenPreview} />
          <div className="form-grid">
            <div className="field full">
              <label className="label" htmlFor="photo-alt">
                Description
              </label>
              <input className="input" id="photo-alt" name="alt" value={alt} onChange={(event) => setAlt(event.target.value)} required aria-describedby="photo-alt-help" />
              <p className="help" id="photo-alt-help">
                Describe what is in the photo for people who can&apos;t see it.
              </p>
            </div>
            <Field id="photo-category" label="Group">
              <select className="select" id="photo-category" name="category" defaultValue={photo?.category ?? "private"}>
                <option value="private">Private</option>
                <option value="group">Group</option>
              </select>
            </Field>
            <Field id="photo-span" label="Shape">
              <select className="select" id="photo-span" name="span" defaultValue={photo?.span ?? ""}>
                <option value="">Normal</option>
                <option value="tall">Tall</option>
                <option value="wide">Wide</option>
                <option value="large">Large</option>
              </select>
            </Field>
          </div>
          <label className="check">
            <input name="homeOnly" type="checkbox" defaultChecked={photo?.homeOnly} />
            <span>
              Home page only
              <small>Hide it from the gallery page.</small>
            </span>
          </label>
        </Card>
        <SaveBar label={photo ? "Save photo" : "Add photo"} pending={pending} result={state} />
      </form>
      {photo ? (
        <DeleteCard
          title="Remove this photo"
          body="It disappears from the website, and an office upload is deleted from storage."
          buttonLabel="Remove photo"
          path="/api/office/photos/delete"
          id={photo.id}
          goTo={frame.closeHref}
        />
      ) : null}
    </EditorDrawer>
  );
}
