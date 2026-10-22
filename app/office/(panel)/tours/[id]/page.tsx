import { ToursScreen } from "@/components/office/tours/ToursScreen";

export default async function OfficeTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ToursScreen openId={id} />;
}
