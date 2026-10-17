// export default async function sitemap() {
//   const baseUrl = 'https://www.himalayatreks.com';

//   let trekUrls = [];
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/treks?limit=100`);
//     const data = await res.json();
//     trekUrls = data.data.map(trek => ({
//       url: `${baseUrl}/treks/${trek.slug}`,
//       lastModified: new Date(trek.updated_at || Date.now()),
//       changeFrequency: 'weekly',
//       priority: 0.9,
//     }));
//   } catch {
//     trekUrls = [];
//   }

//   // Static pages
//   const staticPages = [
//     { url: baseUrl,               priority: 1.0,  changeFrequency: 'daily' },
//     { url: `${baseUrl}/treks`,    priority: 0.95, changeFrequency: 'daily' },
//     // { url: `${baseUrl}/blog`,     priority: 0.8,  changeFrequency: 'weekly' },
//     // { url: `${baseUrl}/about`,    priority: 0.7,  changeFrequency: 'monthly' },
//     // { url: `${baseUrl}/contact`,  priority: 0.6,  changeFrequency: 'monthly' },
//   ].map(page => ({ ...page, lastModified: new Date() }));

//   return [...staticPages, ...trekUrls];
// }



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
