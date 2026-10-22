"use client";

import { lines } from "@/components/office/content/media";
import { FileField } from "@/components/office/content/PhotoField";
import { RepeatItem, useKeyedList } from "@/components/office/content/Repeat";
import { Button } from "@/components/office/ui/Button";
import { Field } from "@/components/office/ui/Field";

type StoredSection = { heading?: string; body: string; image?: string; highlight?: string[] };
type SectionDraft = { heading: string; body: string; image: string; highlights: string };

function toDraft(section: StoredSection): SectionDraft {
  return {
    heading: section.heading ?? "",
    body: section.body,
    image: section.image ?? "",
    highlights: (section.highlight ?? []).join("\n"),
  };
}

// The page body of a place or a post, top to bottom. It sends the sections as one JSON field,
// and each new section photo as sectionPhoto_<position>, which the save matches by position.
export function SectionsEditor({ sections }: { sections: StoredSection[] }) {
  const list = useKeyedList(sections.map(toDraft));
  const content = list.items.map((item) => ({
    heading: item.value.heading,
    body: item.value.body,
    image: item.value.image,
    highlight: lines(item.value.highlights),
  }));

  return (
    <>
      <input type="hidden" name="content" value={JSON.stringify(content)} />
      <div className="repeat">
        {list.items.map((item, index) => (
          <RepeatItem key={item.key} label="Section" index={index} count={list.items.length} onMove={(step) => list.move(item.key, step)} onRemove={() => list.remove(item.key)}>
            <Field id={`section-${item.key}-heading`} label="Heading" optional>
              <input className="input" id={`section-${item.key}-heading`} value={item.value.heading} onChange={(event) => list.update(item.key, { heading: event.target.value })} />
            </Field>
            <Field id={`section-${item.key}-body`} label="Text">
              <textarea className="textarea" id={`section-${item.key}-body`} rows={4} value={item.value.body} onChange={(event) => list.update(item.key, { body: event.target.value })} />
            </Field>
            <FileField
              label="Section photo"
              fileName={`sectionPhoto_${index}`}
              value={item.value.image}
              onChange={(image) => list.update(item.key, { image })}
              removeLabel="Remove photo"
            />
            <Field id={`section-${item.key}-highlights`} label="Highlights, one per line" optional>
              <textarea className="textarea" id={`section-${item.key}-highlights`} rows={3} value={item.value.highlights} onChange={(event) => list.update(item.key, { highlights: event.target.value })} />
            </Field>
          </RepeatItem>
        ))}
      </div>
      <div>
        <Button variant="ghost" icon="plus" onClick={() => list.add({ heading: "", body: "", image: "", highlights: "" })}>
          Add section
        </Button>
      </div>
    </>
  );
}
