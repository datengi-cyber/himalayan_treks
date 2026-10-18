
const baseUrl = 'https://himalayan-legacy.vercel.app';

export default async function sitemap() {
  let trekUrls = [];

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (apiUrl) {
      const res = await fetch(`${apiUrl.replace(/\/$/, '')}/treks?limit=100`, {
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        const treks = Array.isArray(data.data) ? data.data : [];

        trekUrls = treks
          .filter((trek) => trek.slug)
          .map((trek) => ({
            url: `${baseUrl}/treks/${trek.slug}`,
            lastModified: trek.updated_at
              ? new Date(trek.updated_at)
              : new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
          }));
      }
    }
  } catch (error) {
    console.error('Failed to fetch treks for sitemap:', error);
  }

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/treks`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
  ];

  return [...staticPages, ...trekUrls];
}
