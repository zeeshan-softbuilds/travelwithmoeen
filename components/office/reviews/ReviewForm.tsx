"use client";

import { useActionState, useState } from "react";
import { DeleteCard } from "@/components/office/content/DeleteCard";
import { EditorDrawer } from "@/components/office/content/EditorDrawer";
import type { EditorFrame } from "@/components/office/content/frame";
import { FileField } from "@/components/office/content/PhotoField";
import { Stars } from "@/components/office/content/RecordList";
import { SaveBar } from "@/components/office/content/SaveBar";
import { submitTo, useAfterSave } from "@/components/office/content/after-save";
import { UploadProgress } from "@/components/office/content/UploadProgress";
import { postOfficeFormWithUploads, useUploadProgress } from "@/components/office/content/uploads";
import { Card } from "@/components/office/ui/Card";
import { Field } from "@/components/office/ui/Field";
import type { ActionResult } from "@/lib/http/result";
import type { Testimonial } from "@/data/testimonials";

export function ReviewForm({ review, frame, savedBy }: { review: Testimonial | null; frame: EditorFrame; savedBy?: string }) {
  const [name, setName] = useState(review?.name ?? "");
  const [text, setText] = useState(review?.text ?? "");
  const [rating, setRating] = useState(String(review?.rating ?? 5));
  const [avatar, setAvatar] = useState(review?.avatar ?? "");
  const after = useAfterSave();
  const uploads = useUploadProgress();
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeFormWithUploads("/api/office/reviews", formData, uploads.begin(review ? "Saving review" : "Adding review"));
    if (result.ok) {
      const message = result.message ?? "Review saved.";
      if (review) after.stay(message, `review:${review.id}`);
      else after.go(frame.closeHref, message, { scroll: false });
    }
    return result;
  }, null as ActionResult | null);

  const preview = (
    <div className="pv-card pv-quote">
      <div className="pv-body">
        <Stars rating={Number(rating) || 0} />
        <p>{text || "The guest's words appear here."}</p>
        <b>{name || "Guest name"}</b>
      </div>
    </div>
  );

  return (
    <EditorDrawer
      title={review ? review.name : "Add a review"}
      description={review ? "Shown on the home page." : "Shown on the home page after you add it."}
      closeHref={frame.closeHref}
      savedBy={savedBy}
      previousHref={frame.previousHref}
      nextHref={frame.nextHref}
      position={review ? frame.position : null}
      viewHref={review ? "/" : undefined}
      preview={preview}
    >
      <form onSubmit={submitTo(action)} className="stack" aria-busy={pending || undefined}>
        <fieldset className="form-lock" disabled={pending}>
        {review ? <input type="hidden" name="id" value={review.id} /> : null}
        <Card title="Review">
          <div className="form-grid">
            <Field id="review-name" label="Guest name">
              <input className="input" id="review-name" name="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </Field>
            <Field id="review-location" label="Place" optional>
              <input className="input" id="review-location" name="location" defaultValue={review?.location ?? ""} />
            </Field>
            <div className="field full">
              <label className="label" htmlFor="review-text">
                Review
              </label>
              <textarea className="textarea" id="review-text" name="text" rows={6} value={text} onChange={(event) => setText(event.target.value)} required />
            </div>
            <Field id="review-rating" label="Rating">
              <select className="select" id="review-rating" name="rating" value={rating} onChange={(event) => setRating(event.target.value)}>
                {[5, 4, 3, 2, 1].map((stars) => (
                  <option key={stars} value={stars}>
                    {stars} {stars === 1 ? "star" : "stars"}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <FileField label="Guest photo" pathName="avatar" fileName="avatarPhoto" value={avatar} onChange={setAvatar} removeLabel="Clear photo" />
        </Card>
        </fieldset>
        <UploadProgress progress={uploads.progress} onCancel={uploads.cancel} />
        <SaveBar label={review ? "Save review" : "Add review"} pending={pending} result={state} scope={review ? `review:${review.id}` : undefined} />
      </form>
      {review ? (
        <DeleteCard title="Remove this review" body="It disappears from the home page." buttonLabel="Remove review" path="/api/office/reviews/delete" id={review.id} goTo={frame.closeHref} />
      ) : null}
    </EditorDrawer>
  );
}
