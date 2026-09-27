import { notFound } from 'next/navigation';
import Link from 'next/link';
import JsonLd from '@/components/JsonLd';
import Breadcrumb from '@/components/Breadcrumb';


// In production, fetch this from your DB or a CMS
const blogPosts = {
  'everest-base-camp-packing-list': {
    title: 'The Complete Everest Base Camp Packing List (2025)',
    description: 'Everything you need to pack for the EBC trek — from base layers to altitude medication.',
    category: 'Packing Guides',
    date: '2025-03-10',
    readTime: '8 min read',
    content: `
## Clothing Layers (Most Important)

The Everest region has massive temperature swings — warm at lower elevations, bitterly cold above Namche Bazaar. Layering is everything.

**Base Layer:** Merino wool or synthetic moisture-wicking shirts and leggings. Pack 2-3 sets.

**Mid Layer:** A quality fleece jacket. This will be your most-used piece.

**Outer Shell:** A waterproof, windproof jacket and pants. Non-negotiable above 4,000m.

**Down Jacket:** Essential from Namche Bazaar upward. Rated to at least -10°C.

## Footwear

Your boots are the most critical piece of gear. They must be:
- Waterproof (Gore-Tex or equivalent)
- Broken in BEFORE the trek — blisters at 5,000m are serious
- Ankle-supporting for rocky terrain

Bring thick trekking socks (wool) and liner socks to prevent blisters.

## Altitude & Medical Kit

Pack the following medications (consult your doctor first):
- Diamox (Acetazolamide) for AMS prevention
- Ibuprofen for headaches
- Oral rehydration salts
- Blister treatment kit
- Antiseptic cream and bandages
    `
  }
};
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const post = blogPosts[slug];

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;

  const post = blogPosts[slug];

  if (!post) notFound();
// export async function generateMetadata({ params }) {
//   const post = blogPosts[params.slug];
//   if (!post) return { title: 'Post Not Found' };
//   return {
//     title: post.title,
//     description: post.description,
//     openGraph: {
//       title: post.title,
//       description: post.description,
//       type: 'article',
//       publishedTime: post.date,
//     }
//   };
// }

// export default function BlogPostPage({ params }) {
//   const post = blogPosts[params.slug];
//   if (!post) notFound();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'Himalaya Treks' },
    publisher: {
      '@type': 'Organization',
      name: 'Himalaya Treks',
      logo: { '@type': 'ImageObject', url: 'https://www.himalayatreks.com/logo.png' }
    }
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Home', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: post.title }
        ]} />
        

        {/* Header */}
        <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
          {post.category}
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 mt-4 mb-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-10 pb-6 border-b">
          <span>📅 {new Date(post.date).toLocaleDateString('en-US')}</span>
          <span>⏱️ {post.readTime}</span>
        </div>

        {/* Content */}
        <div className="prose prose-lg prose-emerald max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>

        {/* CTA */}
        <div className="mt-16 bg-emerald-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Trek?</h3>
          <p className="text-gray-600 mb-6">Browse our curated Nepal trekking packages</p>
          <Link
            href="/treks"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl transition"
          >
            View All Treks →
          </Link>
        </div>
      </div>
    </>
  );
}