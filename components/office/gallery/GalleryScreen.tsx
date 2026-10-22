import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { frameFor } from "@/components/office/content/frame";
import { RecordList, type ListRecord } from "@/components/office/content/RecordList";
import { SavedNotice } from "@/components/office/content/SavedNotice";
import { PhotoForm } from "@/components/office/gallery/PhotoForm";
import { buttonClass } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";
import { getOfficeSession } from "@/lib/http/office-session";
import { getPhotos } from "@/lib/http/site-content";

const LIST = "/office/gallery";

// The gallery grid, with the editor open over it for ?edit=<id> or ?edit=new.
export async function GalleryScreen({ edit }: { edit?: string }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const photos = await getPhotos();
  const isNew = edit === "new";
  const open = edit && !isNew ? photos.find((photo) => String(photo.id) === edit) ?? null : null;
  if (edit && !isNew && !open) notFound();

  const hrefOf = (id: number) => `${LIST}?edit=${id}`;
  const records: ListRecord[] = photos.map((photo) => ({
    key: String(photo.id),
    href: hrefOf(photo.id),
    title: photo.alt || "No description",
    sub: `${photo.category === "group" ? "Group" : "Private"}${photo.homeOnly ? " · Home page only" : ""}`,
    thumb: photo.src,
    span: photo.span,
    search: photo.alt,
    filters: { category: photo.category },
  }));
  const index = open ? photos.findIndex((photo) => photo.id === open.id) : -1;

  return (
    <>
      <PageHead
        title="Gallery"
        description="Photos on the gallery page and the home page."
        actions={
          <Link className={buttonClass({ variant: "primary" })} href={`${LIST}?edit=new`} scroll={false}>
            <Icon name="plus" />
            Add photo
          </Link>
        }
      />
      {edit ? null : <SavedNotice />}
      <RecordList
        records={records}
        layout="grid"
        currentKey={open ? String(open.id) : undefined}
        searchLabel="Search descriptions"
        noun="photos"
        emptyIcon="image"
        emptyTitle="No photos yet"
        filters={[{ key: "category", label: "Group", options: [{ value: "", label: "Private and group" }, { value: "private", label: "Private" }, { value: "group", label: "Group" }] }]}
      />
      {open || isNew ? <PhotoForm key={edit} photo={open} frame={frameFor(photos, index, LIST, (photo) => hrefOf(photo.id))} /> : null}
    </>
  );
}
