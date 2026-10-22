import { notFound, redirect } from "next/navigation";
import { frameFor } from "@/components/office/content/frame";
import { RecordList, type ListRecord } from "@/components/office/content/RecordList";
import { PostForm } from "@/components/office/PostForm";
import { PageHead } from "@/components/office/ui/PageHead";
import { getOfficeSession } from "@/lib/http/office-session";
import { getPost, getPosts } from "@/lib/http/site-content";

// The Blog list, with the editor open over it when openSlug is set. Adding a post is not in T-37.
export async function BlogScreen({ openSlug }: { openSlug?: string }) {
  const user = await getOfficeSession();
  if (!user?.canEditContent) redirect("/office");
  const [posts, open] = await Promise.all([getPosts(), openSlug ? getPost(openSlug) : null]);
  if (openSlug && !open) notFound();

  const hrefOf = (slug: string) => `/office/blog/${encodeURIComponent(slug)}`;
  const records: ListRecord[] = posts.map((post) => ({
    key: post.slug,
    href: hrefOf(post.slug),
    title: post.title,
    sub: `${post.author} · ${post.date}`,
    thumb: post.coverImage,
    note: `${post.content.length} ${post.content.length === 1 ? "section" : "sections"}`,
    search: `${post.title} ${post.author}`,
    sort: { name: post.title.toLowerCase(), date: post.date },
  }));
  const index = open ? posts.findIndex((post) => post.slug === open.slug) : -1;

  return (
    <>
      <PageHead title="Blog" description="Travel guides and stories on the website." />
      <RecordList
        records={records}
        currentKey={open?.slug}
        searchLabel="Search posts or authors"
        noun="posts"
        emptyIcon="file"
        emptyTitle="No posts yet"
        sorts={[
          { value: "", label: "Website order" },
          { value: "name:asc", label: "Title, A to Z" },
        ]}
      />
      {open ? <PostForm key={open.slug} post={open} frame={frameFor(posts, index, "/office/blog", (post) => hrefOf(post.slug))} /> : null}
    </>
  );
}
