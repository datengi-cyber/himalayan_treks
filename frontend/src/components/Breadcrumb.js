import Link from 'next/link';
import JsonLd from './JsonLd';


export default function Breadcrumb({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && {
        item: `https://www.himalayatreks.com${item.href}`,
      }),
    })),
  };

  return (
    <>
      <JsonLd data={schema} />

      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-2 flex-wrap">
        {items.map((item, index) => (
          <span key={index} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-gray-300">/</span>
            )}

            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-emerald-600 transition"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium">
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}