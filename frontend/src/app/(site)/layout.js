import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Himalaya Treks',
  url: 'https://himalayan-legacy.vercel.app',
  logo: 'https://himalayan-legacy.vercel.app/logo.png',
  description:
    'Nepal trekking company offering Everest, Annapurna and Langtang treks.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Thamel',
    addressLocality: 'Kathmandu',
    addressCountry: 'NP',
  },
  telephone: '+977-9800000000',
  email: 'info@himalayatreks.com',
  sameAs: [
    'https://www.facebook.com/himalayatreks',
    'https://www.instagram.com/himalayatreks',
  ],
};

export default function SiteLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      <Navbar />

      <main className="min-h-screen">
        {children}
      </main>

      <Footer />
    </>
  );
}