"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { EditorDrawer } from "@/components/office/content/EditorDrawer";
import type { EditorFrame } from "@/components/office/content/frame";
import { photoStyle, rememberSaved } from "@/components/office/content/media";
import { FileField } from "@/components/office/content/PhotoField";
import { SaveBar } from "@/components/office/content/SaveBar";
import { SectionsEditor } from "@/components/office/content/SectionsEditor";
import { Card } from "@/components/office/ui/Card";
import { Field } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { Destination } from "@/data/destinations";

const SECTIONS = [
  { id: "place-basics", label: "Basics" },
  { id: "place-tours", label: "Tours" },
  { id: "place-banner", label: "Banner" },
  { id: "place-sections", label: "Sections" },
];

export function PlaceForm({ place, frame }: { place: Destination; frame: EditorFrame }) {
  const [title, setTitle] = useState(place.title);
  const [excerpt, setExcerpt] = useState(place.excerpt);
  const [location, setLocation] = useState(place.location ?? "");
  const [banner, setBanner] = useState(place.bannerImage);
  const [bannerPreview, setBannerPreview] = useState("");
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm("/api/office/places", formData);
    if (result.ok) {
      rememberSaved(result.message ?? "Place saved.");
      window.location.reload();
    }
    return result;
  }, null as ActionResult | null);
  const linked = place.tours ?? [];

  const preview = (
    <div className="pv-card">
      <span className="pv-img tall" style={photoStyle(bannerPreview || banner)}>
        <b className="pv-over">{title || "Place title"}</b>
      </span>
      <div className="pv-body">
        <small>
          <Icon name="pin" />
          {location || "Location"}
        </small>
        <p>{excerpt}</p>
      </div>
    </div>
  );

  return (
    <EditorDrawer
      title={place.title}
      description={place.location}
      closeHref={frame.closeHref}
      previousHref={frame.previousHref}
      nextHref={frame.nextHref}
      position={frame.position}
      viewHref={`/destinations/${encodeURIComponent(place.slug)}`}
      sections={SECTIONS}
      preview={preview}
    >
      <form action={action} className="stack">
        <input type="hidden" name="slug" value={place.slug} />
        <Card id="place-basics" title="Basics">
          <div className="form-grid">
            <div className="field full">
              <label className="label" htmlFor="place-title">
                Title
              </label>
              <input className="input" id="place-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <div className="field full">
              <label className="label" htmlFor="place-excerpt">
                Short text
              </label>
              <textarea className="textarea" id="place-excerpt" name="excerpt" rows={4} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} aria-describedby="place-excerpt-help" />
              <p className="help" id="place-excerpt-help">
                Shown on the place card.
              </p>
            </div>
            <Field id="place-location" label="Location">
              <input className="input" id="place-location" name="location" value={location} onChange={(event) => setLocation(event.target.value)} />
            </Field>
          </div>
        </Card>

        <Card
          id="place-tours"
          title="Tours at this place"
          description="These tours point here, and their pages show this title. To change the list, choose this place on a tour. If a tour uses only this place and its location line is this title, a new title updates that line."
        >
          {linked.length > 0 ? (
            <ul className="link-list" aria-label="Open a linked tour">
              {linked.map((tour) => (
                <li key={tour.id}>
                  <Link className="btn btn-secondary btn-sm" href={`/office/tours/${encodeURIComponent(tour.id)}`}>
                    <Icon name="map" />
                    {tour.name}
                    <span className="muted">
                      {" "}
                      · {tour.duration} {tour.duration === 1 ? "day" : "days"} · {tour.transport}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="help">No tour points here yet. Choose this place on a tour.</p>
          )}
        </Card>

        <Card id="place-banner" title="Banner photo" description="The wide photo at the top of the place page.">
          <FileField label="Banner" pathName="bannerImage" fileName="bannerPhoto" value={banner} onChange={setBanner} onFile={setBannerPreview} />
        </Card>

        <Card id="place-sections" title="Sections" description="The page body, top to bottom.">
          <SectionsEditor sections={place.content} />
        </Card>

        <SaveBar label="Save place" pending={pending} result={state} />
      </form>
    </EditorDrawer>
  );
}
