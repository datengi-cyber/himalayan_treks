

import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

const siteUrl = "https://www.himalayatreks.com";

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'TravelAgency',
  name: 'Himalaya Treks',
  url: 'https://www.himalayatreks.com',
  logo: 'https://www.himalayatreks.com/logo.png',
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

export const metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: 'Himalaya Treks | Nepal Trekking & Tour Packages',
    template: '%s | Himalaya Treks',
  },

  description:
    'Book world-class treks in Nepal — Everest Base Camp, Annapurna Circuit, Langtang Valley and more.',

  keywords: [
    'Nepal trekking',
    'Everest Base Camp trek',
    'Annapurna Circuit',
    'Himalaya tours',
    'trekking packages Nepal',
    'Nepal hiking',
    'Langtang Valley trek',
    'Nepal adventure travel',
  ],

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'Himalaya Treks',
    title: 'Himalaya Treks | Nepal Trekking & Tour Packages',
    description: 'Book world-class trekking adventures in Nepal.',
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Himalaya Treks - Nepal Trekking',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Himalaya Treks | Nepal Trekking',
    description: 'Book world-class treks in Nepal.',
    images: [`${siteUrl}/og-image.jpg`],
  },

  alternates: {
    canonical: siteUrl,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />

        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}