"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { DeleteCard } from "@/components/office/content/DeleteCard";
import { EditorDrawer } from "@/components/office/content/EditorDrawer";
import type { EditorFrame } from "@/components/office/content/frame";
import { lines, photoStyle, rememberSaved } from "@/components/office/content/media";
import { FileField } from "@/components/office/content/PhotoField";
import { RepeatItem, useKeyedList } from "@/components/office/content/Repeat";
import { SaveBar } from "@/components/office/content/SaveBar";
import { Badge } from "@/components/office/ui/Badge";
import { Button } from "@/components/office/ui/Button";
import { Card } from "@/components/office/ui/Card";
import { Field } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { Tour } from "@/data/tours";

type DayDraft = { title: string; description: string; highlights: string };

const SECTIONS = [
  { id: "tour-basics", label: "Basics" },
  { id: "tour-photos", label: "Photos" },
  { id: "tour-pdf", label: "PDF" },
  { id: "tour-days", label: "Day plan" },
  { id: "tour-included", label: "Included" },
  { id: "tour-places", label: "Places" },
  { id: "tour-visibility", label: "Visibility" },
];

function daysLabel(days: number) {
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function TourForm({
  tour,
  canDelete,
  places,
  mode,
  frame,
  savedBy,
}: {
  tour: Tour;
  canDelete: boolean;
  places: { slug: string; title: string }[];
  mode: "create" | "edit";
  frame?: EditorFrame;
  savedBy?: string;
}) {
  const [name, setName] = useState(tour.name);
  const [description, setDescription] = useState(tour.description);
  const [location, setLocation] = useState(tour.location);
  const [duration, setDuration] = useState(String(tour.duration));
  const [image, setImage] = useState(tour.image);
  const [photoPreview, setPhotoPreview] = useState("");
  const [featured, setFeatured] = useState(Boolean(tour.featured));
  const [extras, setExtras] = useState(tour.galleryImages);
  const [pdf, setPdf] = useState(tour.pdf);
  const days = useKeyedList<DayDraft>(
    tour.itinerary.map((day) => ({ title: day.title, description: day.description, highlights: day.highlights.join("\n") })),
  );
  const savePath = mode === "create" ? "/api/office/tours/create" : "/api/office/tours";
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm(savePath, formData);
    if (result.ok) {
      rememberSaved(result.message ?? "Tour saved.");
      if (result.href) window.location.assign(result.href);
      else window.location.reload();
    }
    return result;
  }, null as ActionResult | null);

  const selectedPlaces = new Set((tour.places ?? []).map((place) => place.slug));
  const itinerary = days.items.map((day, index) => ({
    day: index + 1,
    title: day.value.title,
    description: day.value.description,
    highlights: lines(day.value.highlights),
  }));

  const form = (
    <>
      <form action={action} className="stack">
        {mode === "edit" ? <input type="hidden" name="id" value={tour.id} /> : null}
        <input type="hidden" name="itinerary" value={JSON.stringify(itinerary)} />
        <input type="hidden" name="placeSet" value="1" />
        <input type="hidden" name="galleryImageSet" value="1" />

        <Card id="tour-basics" title="Basics" description={mode === "edit" ? `Code ${tour.code}. Shown on the tour card and at the top of the tour page.` : "A code is assigned when you save."}>
          <div className="form-grid">
            <div className="field full">
              <label className="label" htmlFor="tour-name">
                Title
              </label>
              <input className="input" id="tour-name" name="name" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="field full">
              <label className="label" htmlFor="tour-description">
                Description
              </label>
              <textarea className="textarea" id="tour-description" name="description" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} />
            </div>
            <Field id="tour-location" label="Location">
              <input className="input" id="tour-location" name="location" value={location} onChange={(event) => setLocation(event.target.value)} />
            </Field>
            <Field id="tour-region" label="Region">
              <input className="input" id="tour-region" name="region" defaultValue={tour.region} required />
            </Field>
            <Field id="tour-duration" label="Days">
              <input className="input" id="tour-duration" name="duration" type="number" min={1} value={duration} onChange={(event) => setDuration(event.target.value)} />
            </Field>
            <Field id="tour-transport" label="Road or air">
              <select className="select" id="tour-transport" name="transport" defaultValue={tour.transport}>
                <option value="By Road">By Road</option>
                <option value="By Air">By Air</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card id="tour-photos" title="Photos" description="The main photo is on the tour card. More photos show on the tour page.">
          <FileField label="Main photo" pathName="image" fileName="photo" value={image} onChange={setImage} onFile={setPhotoPreview} />
          <div className="field">
            <span className="label">More photos</span>
            {extras.length === 0 ? <p className="help">No more photos yet.</p> : null}
            {extras.map((photo, index) => (
              <div className="extra-row" key={index}>
                <span className="row-thumb" style={photoStyle(photo)} aria-hidden="true" />
                <label className="sr-only" htmlFor={`tour-extra-${index}`}>
                  Photo {index + 1} path
                </label>
                <input
                  className="input path-input"
                  id={`tour-extra-${index}`}
                  name="galleryImage"
                  value={photo}
                  onChange={(event) => setExtras((current) => current.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)))}
                />
                <Button variant="danger-outline" size="sm" icon="trash" onClick={() => setExtras((current) => current.filter((item, itemIndex) => itemIndex !== index))}>
                  Remove<span className="sr-only"> photo {index + 1}</span>
                </Button>
              </div>
            ))}
            <div>
              <Button variant="ghost" size="sm" icon="plus" onClick={() => setExtras((current) => [...current, ""])}>
                Add a path
              </Button>
            </div>
          </div>
          <FileField label="Add a photo" fileName="extraPhoto" help="It joins the photos on the tour page when you save. JPEG, PNG, or WebP. 5 MB or less." />
        </Card>

        <Card id="tour-pdf" title="PDF" description="The tour plan guests can download.">
          <FileField label="Tour PDF" kind="pdf" pathName="pdf" fileName="pdfFile" value={pdf} onChange={setPdf} removeLabel="Remove PDF" />
        </Card>

        <Card id="tour-days" title="Day plan" description="One block per day, top to bottom.">
          <div className="repeat">
            {days.items.map((day, index) => (
              <RepeatItem key={day.key} label="Day" index={index} count={days.items.length} onMove={(step) => days.move(day.key, step)} onRemove={() => days.remove(day.key)}>
                <Field id={`day-${day.key}-title`} label="Title">
                  <input className="input" id={`day-${day.key}-title`} value={day.value.title} onChange={(event) => days.update(day.key, { title: event.target.value })} />
                </Field>
                <Field id={`day-${day.key}-text`} label="What happens">
                  <textarea className="textarea" id={`day-${day.key}-text`} rows={2} value={day.value.description} onChange={(event) => days.update(day.key, { description: event.target.value })} />
                </Field>
                <Field id={`day-${day.key}-highlights`} label="Highlights, one per line" optional>
                  <textarea className="textarea" id={`day-${day.key}-highlights`} rows={3} value={day.value.highlights} onChange={(event) => days.update(day.key, { highlights: event.target.value })} />
                </Field>
              </RepeatItem>
            ))}
          </div>
          <div>
            <Button variant="ghost" icon="plus" onClick={() => days.add({ title: "", description: "", highlights: "" })}>
              Add day
            </Button>
          </div>
        </Card>

        <Card id="tour-included" title="What's included">
          <div className="form-grid">
            <Field id="tour-included-list" label="Included, one per line">
              <textarea className="textarea" id="tour-included-list" name="included" rows={4} defaultValue={tour.included.join("\n")} />
            </Field>
            <Field id="tour-not-included" label="Not included, one per line">
              <textarea className="textarea" id="tour-not-included" name="notIncluded" rows={4} defaultValue={tour.notIncluded.join("\n")} />
            </Field>
            <Field id="tour-categories" label="Categories, one per line" optional>
              <textarea className="textarea" id="tour-categories" name="categories" rows={3} defaultValue={tour.categories.join("\n")} />
            </Field>
            <Field id="tour-packages" label="Package types, one per line" optional>
              <textarea className="textarea" id="tour-packages" name="packageTypes" rows={3} defaultValue={tour.packageTypes.join("\n")} />
            </Field>
          </div>
        </Card>

        <Card id="tour-places" title="Places" description="The tour page lists these places, and each place page lists this tour. Saving a tour does not change the place guide.">
          <fieldset className="place-picks">
            <legend className="sr-only">Places for this tour</legend>
            {places.map((place) => (
              <label className="check" key={place.slug}>
                <input type="checkbox" name="placeSlug" value={place.slug} defaultChecked={selectedPlaces.has(place.slug)} />
                <span>{place.title}</span>
              </label>
            ))}
          </fieldset>
          {mode === "edit" ? (
            (tour.places ?? []).length > 0 ? (
              <ul className="link-list" aria-label="Open a linked place">
                {(tour.places ?? []).map((place) => (
                  <li key={place.slug}>
                    <Link className="btn btn-secondary btn-sm" href={`/office/places/${place.slug}`}>
                      <Icon name="pin" />
                      {place.title}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="help">No place is linked yet.</p>
            )
          ) : null}
        </Card>

        <Card id="tour-visibility" title="Visibility">
          <label className="check">
            <input name="featured" type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />
            <span>
              Featured on the home page
              <small>Shows in the home page tour row.</small>
            </span>
          </label>
        </Card>

        <SaveBar label={mode === "create" ? "Add tour" : "Save tour"} pending={pending} result={state} />
      </form>

      {mode === "edit" && canDelete ? (
        <DeleteCard
          title="Delete this tour"
          body="Removes the tour page from the website. Saved bookings stay in Requests."
          buttonLabel="Delete tour"
          path="/api/office/tours/delete"
          id={tour.id}
          goTo="/office/tours"
        />
      ) : null}
    </>
  );

  if (!frame) return form;

  const previewDays = Number(duration) || tour.duration;
  const preview = (
    <div className="pv-card">
      <span className="pv-img" style={photoStyle(photoPreview || image)}>
        {featured ? <Badge tone="accent">★ Featured</Badge> : null}
      </span>
      <div className="pv-body">
        <b>{name || "Tour title"}</b>
        <small>
          <Icon name="pin" />
          {location || "Location"} · {daysLabel(previewDays)}
        </small>
        <p>{description}</p>
        <span className="pv-link">
          View details <Icon name="chevR" />
        </span>
      </div>
    </div>
  );

  return (
    <EditorDrawer
      title={tour.name}
      description={`Code ${tour.code} · ${daysLabel(tour.duration)} · ${tour.transport}`}
      badge={tour.featured ? <Badge tone="accent">Featured</Badge> : null}
      closeHref={frame.closeHref}
      previousHref={frame.previousHref}
      nextHref={frame.nextHref}
      position={frame.position}
      viewHref={`/tours/${encodeURIComponent(tour.id)}`}
      sections={SECTIONS}
      preview={preview}
      savedBy={savedBy}
    >
      {form}
    </EditorDrawer>
  );
}
