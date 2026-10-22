import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { frameFor } from "@/components/office/content/frame";
import { RecordList, type ListRecord } from "@/components/office/content/RecordList";
import { SavedNotice } from "@/components/office/content/SavedNotice";
import { SlideForm } from "@/components/office/slides/SlideForm";
import { buttonClass } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";
import { getOfficeSession } from "@/lib/http/office-session";
import { getSlides } from "@/lib/http/site-content";

const LIST = "/office/slides";

// The home slides in order, with the editor open over them for ?edit=<id> or ?edit=new.
export async function SlidesScreen({ edit }: { edit?: string }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const slides = await getSlides();
  const isNew = edit === "new";
  const open = edit && !isNew ? slides.find((slide) => String(slide.id) === edit) ?? null : null;
  if (edit && !isNew && !open) notFound();

  const hrefOf = (id: number) => `${LIST}?edit=${id}`;
  const records: ListRecord[] = slides.map((slide, index) => ({
    key: String(slide.id),
    href: hrefOf(slide.id),
    title: slide.title,
    sub: `Position ${index + 1} · tilt ${slide.rotation}°`,
    thumb: slide.image,
    search: slide.title,
  }));
  const index = open ? slides.findIndex((slide) => slide.id === open.id) : -1;

  return (
    <>
      <PageHead
        title="Home slides"
        description="The tilted photo cards at the top of the home page, in order."
        actions={
          <Link className={buttonClass({ variant: "primary" })} href={`${LIST}?edit=new`} scroll={false}>
            <Icon name="plus" />
            Add slide
          </Link>
        }
      />
      {edit ? null : <SavedNotice />}
      <RecordList records={records} currentKey={open ? String(open.id) : undefined} searchLabel="Search slides" noun="slides" emptyIcon="slides" emptyTitle="No slides yet" />
      {open || isNew ? (
        <SlideForm
          key={edit}
          slide={open}
          position={open ? index + 1 : slides.length + 1}
          frame={frameFor(slides, index, LIST, (slide) => hrefOf(slide.id))}
        />
      ) : null}
    </>
  );
}
