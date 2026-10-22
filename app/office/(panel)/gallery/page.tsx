import { GalleryScreen } from "@/components/office/gallery/GalleryScreen";

export default async function OfficeGalleryPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  return <GalleryScreen edit={edit} />;
}
