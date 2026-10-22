import { BlogScreen } from "@/components/office/blog/BlogScreen";

export default async function OfficePostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogScreen openSlug={slug} />;
}
