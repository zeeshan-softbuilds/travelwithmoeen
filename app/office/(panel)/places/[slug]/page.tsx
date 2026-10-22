import { PlacesScreen } from "@/components/office/places/PlacesScreen";

export default async function OfficePlacePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PlacesScreen openSlug={slug} />;
}
