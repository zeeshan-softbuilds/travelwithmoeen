"use client";

import { useActionState, useState } from "react";
import { DeleteCard } from "@/components/office/content/DeleteCard";
import { EditorDrawer } from "@/components/office/content/EditorDrawer";
import type { EditorFrame } from "@/components/office/content/frame";
import { rememberSaved } from "@/components/office/content/media";
import { FileField } from "@/components/office/content/PhotoField";
import { Stars } from "@/components/office/content/RecordList";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Card } from "@/components/office/ui/Card";
import { Field } from "@/components/office/ui/Field";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { Testimonial } from "@/data/testimonials";

export function ReviewForm({ review, frame }: { review: Testimonial | null; frame: EditorFrame }) {
  const [name, setName] = useState(review?.name ?? "");
  const [text, setText] = useState(review?.text ?? "");
  const [rating, setRating] = useState(String(review?.rating ?? 5));
  const [avatar, setAvatar] = useState(review?.avatar ?? "");
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm("/api/office/reviews", formData);
    if (result.ok) {
      rememberSaved(result.message ?? "Review saved.");
      if (review) window.location.reload();
      else window.location.assign(frame.closeHref);
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
      previousHref={frame.previousHref}
      nextHref={frame.nextHref}
      position={review ? frame.position : null}
      viewHref={review ? "/" : undefined}
      preview={preview}
    >
      <form action={action} className="stack">
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
        <SaveBar label={review ? "Save review" : "Add review"} pending={pending} result={state} />
      </form>
      {review ? (
        <DeleteCard title="Remove this review" body="It disappears from the home page." buttonLabel="Remove review" path="/api/office/reviews/delete" id={review.id} goTo={frame.closeHref} />
      ) : null}
    </EditorDrawer>
  );
}
