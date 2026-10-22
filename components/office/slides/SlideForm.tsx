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
import type { HomeSlide } from "@/lib/content-types";

export function SlideForm({ slide, position, frame }: { slide: HomeSlide | null; position: number; frame: EditorFrame }) {
  const [title, setTitle] = useState(slide?.title ?? "");
  const [rotation, setRotation] = useState(String(slide?.rotation ?? 0));
  const [image, setImage] = useState(slide?.image ?? "");
  const [chosenPreview, setChosenPreview] = useState("");
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm("/api/office/slides", formData);
    if (result.ok) {
      rememberSaved(result.message ?? "Slide saved.");
      if (slide) window.location.reload();
      else window.location.assign(frame.closeHref);
    }
    return result;
  }, null as ActionResult | null);

  const preview = (
    <div className="pv-slide">
      <span className="pv-slide-card" style={{ ...photoStyle(chosenPreview || image), transform: `rotate(${Number(rotation) || 0}deg)` }}>
        <b>{title || "Title"}</b>
      </span>
    </div>
  );

  return (
    <EditorDrawer
      title={slide ? slide.title : "Add a slide"}
      description={slide ? `Position ${position} on the home page` : "It joins the end of the row unless you give it a lower order."}
      closeHref={frame.closeHref}
      previousHref={frame.previousHref}
      nextHref={frame.nextHref}
      position={slide ? frame.position : null}
      viewHref={slide ? "/" : undefined}
      preview={preview}
    >
      <form action={action} className="stack">
        {slide ? <input type="hidden" name="id" value={slide.id} /> : null}
        <Card title="Slide">
          <div className="form-grid">
            <div className="field full">
              <label className="label" htmlFor="slide-title">
                Title
              </label>
              <input className="input" id="slide-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <Field id="slide-rotation" label="Tilt in degrees" help="0 is straight. A minus number tilts left.">
              <input className="input" id="slide-rotation" name="rotation" type="number" value={rotation} onChange={(event) => setRotation(event.target.value)} aria-describedby="slide-rotation-help" />
            </Field>
            <Field id="slide-order" label="Order" help="Lower numbers show first. Give each slide its own number, because two slides with the same number can swap.">
              <input className="input" id="slide-order" name="sortOrder" type="number" defaultValue={position} aria-describedby="slide-order-help" />
            </Field>
          </div>
          <FileField label={slide ? "Replace photo" : "Photo"} pathName="image" fileName="photo" value={image} onChange={setImage} onFile={setChosenPreview} />
        </Card>
        <SaveBar label={slide ? "Save slide" : "Add slide"} pending={pending} result={state} />
      </form>
      {slide ? (
        <DeleteCard
          title="Remove this slide"
          body="It leaves the home page, and an office upload is deleted from storage."
          buttonLabel="Remove slide"
          path="/api/office/slides/delete"
          id={slide.id}
          goTo={frame.closeHref}
        />
      ) : null}
    </EditorDrawer>
  );
}
