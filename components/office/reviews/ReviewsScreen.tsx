import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { frameFor } from "@/components/office/content/frame";
import { RecordList, type ListRecord } from "@/components/office/content/RecordList";
import { SavedNotice } from "@/components/office/content/SavedNotice";
import { ReviewForm } from "@/components/office/reviews/ReviewForm";
import { buttonClass } from "@/components/office/ui/Button";
import { Icon } from "@/components/office/ui/Icon";
import { PageHead } from "@/components/office/ui/PageHead";
import { savedByText } from "@/components/office/activity";
import { requestTime } from "@/components/office/format";
import { getOfficeSession, getSavedBy } from "@/lib/http/office-session";
import { getReviews } from "@/lib/http/site-content";

const LIST = "/office/reviews";

// The reviews list, with the editor open over it for ?edit=<id> or ?edit=new.
export async function ReviewsScreen({ edit }: { edit?: string }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const reviews = await getReviews();
  const isNew = edit === "new";
  const open = edit && !isNew ? reviews.find((review) => String(review.id) === edit) ?? null : null;
  if (edit && !isNew && !open) notFound();

  const hrefOf = (id: number) => `${LIST}?edit=${id}`;
  const records: ListRecord[] = reviews.map((review) => ({
    key: String(review.id),
    href: hrefOf(review.id),
    title: review.name,
    sub: review.text.length > 90 ? `${review.text.slice(0, 90)}…` : review.text,
    note: review.location,
    stars: review.rating,
    search: `${review.name} ${review.location} ${review.text}`,
    sort: { name: review.name.toLowerCase(), rating: review.rating },
  }));
  const index = open ? reviews.findIndex((review) => review.id === open.id) : -1;

  const savedBy = open ? savedByText((await getSavedBy("review", [open.id]))[String(open.id)], requestTime()) : "";
  return (
    <>
      <PageHead
        title="Reviews"
        description="Guest reviews shown on the home page."
        actions={
          <Link className={buttonClass({ variant: "primary" })} href={`${LIST}?edit=new`} scroll={false}>
            <Icon name="plus" />
            Add review
          </Link>
        }
      />
      {edit ? null : <SavedNotice />}
      <RecordList
        records={records}
        currentKey={open ? String(open.id) : undefined}
        searchLabel="Search reviews"
        noun="reviews"
        emptyIcon="star"
        emptyTitle="No reviews yet"
        sorts={[
          { value: "", label: "Website order" },
          { value: "name:asc", label: "Name, A to Z" },
          { value: "rating:desc", label: "Highest rating" },
          { value: "rating:asc", label: "Lowest rating" },
        ]}
      />
      {open || isNew ? <ReviewForm key={edit} review={open} savedBy={savedBy} frame={frameFor(reviews, index, LIST, (review) => hrefOf(review.id))} /> : null}
    </>
  );
}
