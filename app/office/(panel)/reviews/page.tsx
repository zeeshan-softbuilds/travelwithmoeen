import { ReviewsScreen } from "@/components/office/reviews/ReviewsScreen";

export default async function OfficeReviewsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  return <ReviewsScreen edit={edit} />;
}
