import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Search, Tag } from 'lucide-react';
import { articles, type Article } from '../lib/articles';
import { PageHeader } from '../components/Layout';

const categories = ['All', 'Wellness', 'Nutrition', 'Mental Health', 'Fitness', 'Prevention'] as const;

export function Articles() {
  const [category, setCategory] = useState<(typeof categories)[number]>('All');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Article | null>(null);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat = category === 'All' || a.category === category;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.body.some((p) => p.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
  }, [category, query]);

  if (active) {
    return <ArticleReader article={active} onBack={() => setActive(null)} />;
  }

  return (
    <div className="container-page py-10">
      <PageHeader
        eyebrow="Knowledge Library"
        title="Health articles, explained clearly"
        subtitle="Curated, evidence-informed articles to help you live well — written by clinicians."
        icon={<BookOpen className="h-3.5 w-3.5" />}
      />

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            className="input pl-10"
            placeholder="Search articles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`chip transition-all ${
                category === c
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center text-ink-500">
          No articles match your search. Try a different keyword or category.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a, i) => (
            <button
              key={a.id}
              onClick={() => setActive(a)}
              className="card-hover group animate-fade-up overflow-hidden text-left"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2">
                  <span className="chip bg-primary-50 text-primary-700">
                    <Tag className="h-3 w-3" /> {a.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-ink-400">
                    <Clock className="h-3 w-3" /> {a.readTime} min
                  </span>
                </div>
                <h3 className="mt-3 font-display text-base font-bold leading-snug text-ink-900">
                  {a.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-ink-500">{a.excerpt}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-ink-400">
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-100 text-primary-700 font-bold">
                    {a.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </span>
                  {a.author} · {new Date(a.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ArticleReader({ article, onBack }: { article: Article; onBack: () => void }) {
  return (
    <div className="container-page py-10">
      <button onClick={onBack} className="btn-ghost mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to articles
      </button>

      <article className="mx-auto max-w-3xl animate-fade-up">
        <div className="overflow-hidden rounded-2xl">
          <img src={article.image} alt={article.title} className="aspect-[16/9] w-full object-cover" />
        </div>
        <div className="mt-6 flex items-center gap-2">
          <span className="chip bg-primary-50 text-primary-700">
            <Tag className="h-3 w-3" /> {article.category}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-ink-400">
            <Clock className="h-3 w-3" /> {article.readTime} min read
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          {article.title}
        </h1>
        <div className="mt-4 flex items-center gap-2 text-sm text-ink-500">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-primary-700 font-bold">
            {article.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </span>
          {article.author} · {new Date(article.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <div className="mt-8 space-y-5">
          {article.body.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-ink-700">
              {p}
            </p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-primary-50 p-5 text-sm leading-relaxed text-primary-800">
          <strong className="font-bold">Disclaimer:</strong> This article is for educational purposes only
          and is not a substitute for professional medical advice. Always consult a qualified healthcare
          provider for personal guidance.
        </div>

        <button onClick={onBack} className="btn-secondary mt-8">
          <ArrowLeft className="h-4 w-4" /> More articles <ArrowRight className="h-4 w-4" />
        </button>
      </article>
    </div>
  );
}
