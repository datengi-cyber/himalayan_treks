import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata = {
  // metadataBase: new URL('https://www.himalayatreks.com'),
  metadataBase: new URL('https://himalayan-legacy.vercel.app'),

  verification: {
    google: 'Zj0nvSWyL3ch19JsW0YCZDmk2KV5LZMa4wEM7dd019c',
  },


  title: {
    default: 'Himalaya Treks | Nepal Trekking & Tour Packages',
    template: '%s | Himalaya Treks',
  },

  applicationName: 'Himalaya Treks',

  icons: {
    icon: '/newLOgofor-removebg-preview.webp',
    shortcut: '/newLOgofor-removebg-preview.webp',
    apple: '/newLOgofor-removebg-preview.webp',
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
    url: 'https://himalayan-legacy.vercel.app',
    siteName: 'Himalaya Treks',
    title: 'Himalaya Treks | Nepal Trekking & Tour Packages',
    description: 'Book world-class trekking adventures in Nepal.',
    images: [
      {
        url: 'https://himalayan-legacy.vercel.app/og-image.jpg',
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
    images: ['https://himalayan-legacy.vercel.app/og-image.jpg'],
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
