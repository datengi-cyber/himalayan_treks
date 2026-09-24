export default async function sitemap() {
  const baseUrl = 'https://www.himalayatreks.com';

  let trekUrls = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/treks?limit=100`);
    const data = await res.json();
    trekUrls = data.data.map(trek => ({
      url: `${baseUrl}/treks/${trek.slug}`,
      lastModified: new Date(trek.updated_at || Date.now()),
      changeFrequency: 'weekly',
      priority: 0.9,
    }));
  } catch {
    trekUrls = [];
  }

  // Static pages
  const staticPages = [
    { url: baseUrl,               priority: 1.0,  changeFrequency: 'daily' },
    { url: `${baseUrl}/treks`,    priority: 0.95, changeFrequency: 'daily' },
    // { url: `${baseUrl}/blog`,     priority: 0.8,  changeFrequency: 'weekly' },
    // { url: `${baseUrl}/about`,    priority: 0.7,  changeFrequency: 'monthly' },
    // { url: `${baseUrl}/contact`,  priority: 0.6,  changeFrequency: 'monthly' },
  ].map(page => ({ ...page, lastModified: new Date() }));

  return [...staticPages, ...trekUrls];
}