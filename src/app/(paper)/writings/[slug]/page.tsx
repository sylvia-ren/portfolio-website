import Link from "next/link";
import { notFound } from "next/navigation";
import { getWriting, getWritings } from "@/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getWritings().map((writing) => ({ slug: writing.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const writing = getWriting((await params).slug);
  return writing ? { title: writing.title } : {};
}

/*
 * a reading page. a poem keeps every line break exactly as written and
 * is given more air between lines; prose flows in measured paragraphs.
 */
export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const writing = getWriting((await params).slug);
  if (!writing) notFound();

  return (
    <article className="px-[var(--margin-page)] pb-[var(--space-section)]">
      <header className="mt-[var(--space-section)]">
        <h1 className="text-title">{writing.title}</h1>
        <p className="text-label ink-soft mt-[var(--space-hair)]">
          {writing.year}, {writing.kind}
        </p>
      </header>
      <div
        className={
          writing.kind === "poem"
            ? "mt-[var(--space-plate)] max-w-[var(--measure-prose)]"
            : "mt-[var(--space-block)] max-w-[var(--measure-prose)]"
        }
      >
        {writing.kind === "poem" ? (
          <p className="text-body whitespace-pre-line [line-height:var(--leading-poem)]">
            {writing.body}
          </p>
        ) : (
          <div className="wall-text whitespace-pre-line">{writing.body}</div>
        )}
      </div>
      <p className="mt-[var(--space-rest)]">
        <Link href="/writings" className="text-label quiet-link">
          writings
        </Link>
      </p>
    </article>
  );
}
