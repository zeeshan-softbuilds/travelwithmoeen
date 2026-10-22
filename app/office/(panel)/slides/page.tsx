import { SlidesScreen } from "@/components/office/slides/SlidesScreen";

export default async function OfficeSlidesPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit } = await searchParams;
  return <SlidesScreen edit={edit} />;
}
