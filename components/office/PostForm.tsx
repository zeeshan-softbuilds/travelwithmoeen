"use client";

import { useActionState, useState } from "react";
import { EditorDrawer } from "@/components/office/content/EditorDrawer";
import type { EditorFrame } from "@/components/office/content/frame";
import { photoStyle, rememberSaved } from "@/components/office/content/media";
import { FileField } from "@/components/office/content/PhotoField";
import { SaveBar } from "@/components/office/content/SaveBar";
import { SectionsEditor } from "@/components/office/content/SectionsEditor";
import { Card } from "@/components/office/ui/Card";
import { Field } from "@/components/office/ui/Field";
import { Icon } from "@/components/office/ui/Icon";
import { postOfficeForm } from "@/lib/http/office-client";
import type { ActionResult } from "@/lib/http/result";
import type { Blog } from "@/data/blog";

const SECTIONS = [
  { id: "post-basics", label: "Basics" },
  { id: "post-cover", label: "Cover" },
  { id: "post-sections", label: "Sections" },
];

export function PostForm({ post, frame }: { post: Blog; frame: EditorFrame }) {
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [author, setAuthor] = useState(post.author);
  const [cover, setCover] = useState(post.coverImage);
  const [coverPreview, setCoverPreview] = useState("");
  const [state, action, pending] = useActionState(async (previous: ActionResult | null, formData: FormData) => {
    const result = await postOfficeForm("/api/office/posts", formData);
    if (result.ok) {
      rememberSaved(result.message ?? "Post saved.");
      window.location.reload();
    }
    return result;
  }, null as ActionResult | null);

  const preview = (
    <div className="pv-card">
      <span className="pv-img" style={photoStyle(coverPreview || cover)} />
      <div className="pv-body">
        <small>By {author || "Author"}</small>
        <b>{title || "Post title"}</b>
        <p>{excerpt}</p>
        <span className="pv-link">
          Read more <Icon name="chevR" />
        </span>
      </div>
    </div>
  );

  return (
    <EditorDrawer
      title={post.title}
      description={`${post.author} · ${post.date}`}
      closeHref={frame.closeHref}
      previousHref={frame.previousHref}
      nextHref={frame.nextHref}
      position={frame.position}
      viewHref={`/blog/${encodeURIComponent(post.slug)}`}
      sections={SECTIONS}
      preview={preview}
    >
      <form action={action} className="stack">
        <input type="hidden" name="slug" value={post.slug} />
        <Card id="post-basics" title="Basics">
          <div className="form-grid">
            <div className="field full">
              <label className="label" htmlFor="post-title">
                Title
              </label>
              <input className="input" id="post-title" name="title" value={title} onChange={(event) => setTitle(event.target.value)} required />
            </div>
            <div className="field full">
              <label className="label" htmlFor="post-excerpt">
                Short text
              </label>
              <textarea className="textarea" id="post-excerpt" name="excerpt" rows={3} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} aria-describedby="post-excerpt-help" />
              <p className="help" id="post-excerpt-help">
                Shown on the blog card and in search results.
              </p>
            </div>
            <Field id="post-author" label="Author">
              <input className="input" id="post-author" name="author" value={author} onChange={(event) => setAuthor(event.target.value)} />
            </Field>
            <Field id="post-date" label="Date">
              <input className="input" id="post-date" name="date" defaultValue={post.date} />
            </Field>
          </div>
        </Card>

        <Card id="post-cover" title="Cover photo" description="The photo on the blog card and at the top of the post.">
          <FileField label="Cover" pathName="coverImage" fileName="coverPhoto" value={cover} onChange={setCover} onFile={setCoverPreview} />
        </Card>

        <Card id="post-sections" title="Sections" description="The post body, top to bottom.">
          <SectionsEditor sections={post.content} />
        </Card>

        <SaveBar label="Save post" pending={pending} result={state} />
      </form>
    </EditorDrawer>
  );
}
