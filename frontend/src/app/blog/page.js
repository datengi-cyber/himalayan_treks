import Link from 'next/link';

export const metadata = {
  title: 'Trekking Blog | Nepal Hiking Guides & Tips',
  description: 'Expert trekking guides, packing lists, altitude sickness tips and Nepal travel advice from our experienced Himalayan guides.',
};

// Static blog posts (later you can move these to your DB)
const blogPosts = [
  {
    slug: 'everest-base-camp-packing-list',
    title: 'The Complete Everest Base Camp Packing List (2025)',
    excerpt: 'Everything you need to pack for the EBC trek — from base layers to altitude medication. Updated guide from our lead guides.',
    category: 'Packing Guides',
    readTime: '8 min read',
    date: '2025-03-10',
    image: '🎒'
  },
  {
    slug: 'altitude-sickness-prevention-guide',
    title: 'Altitude Sickness: Prevention, Symptoms & Treatment',
    excerpt: 'Acute Mountain Sickness affects 75% of trekkers above 3,000m. Learn how to prevent it, recognize symptoms, and what to do if it hits.',
    category: 'Safety',
    readTime: '10 min read',
    date: '2025-02-20',
    image: '🏥'
  },
  {
    slug: 'best-time-to-trek-nepal',
    title: 'Best Time to Trek in Nepal: Month-by-Month Guide',
    excerpt: 'October and November are peak season, but spring has stunning rhododendrons. Here\'s our complete seasonal guide.',
    category: 'Planning',
    readTime: '6 min read',
    date: '2025-01-15',
    image: '📅'
  },
  {
    slug: 'annapurna-vs-everest-trek',
    title: 'Annapurna Circuit vs Everest Base Camp: Which Trek is Right for You?',
    excerpt: 'Both are bucket-list treks but they offer completely different experiences. We break down difficulty, cost, scenery and logistics.',
    category: 'Trek Comparisons',
    readTime: '12 min read',
    date: '2024-12-05',
    image: '⚖️'
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-14">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Trekking Blog</h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Expert guides, safety tips, and insider knowledge from our Himalayan trekking team
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <article className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group">
              <div className="h-48 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-8xl">
                {post.image}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-gray-400 text-xs">{post.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition leading-snug">
                  {post.title}
                </h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {new Date(post.date).toLocaleDateString('en-US')}
                  </span>
                  <span className="text-emerald-600 text-sm font-semibold group-hover:underline">
                    Read More →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}