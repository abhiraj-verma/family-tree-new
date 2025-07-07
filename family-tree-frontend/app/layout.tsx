import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'KnowYourFamilyTree - Build and Share Your Family Tree',
  description: 'Create, build, and share beautiful family trees with KnowYourFamilyTree. Connect with your roots and preserve your family history for future generations.',
  keywords: 'family tree, genealogy, family history, ancestry, family connections, family builder',
  authors: [{ name: 'KnowYourFamilyTree Team' }],
  creator: 'KnowYourFamilyTree',
  publisher: 'KnowYourFamilyTree',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'KnowYourFamilyTree - Build and Share Your Family Tree',
    description: 'Create, build, and share beautiful family trees with KnowYourFamilyTree. Connect with your roots and preserve your family history.',
    url: '/',
    siteName: 'KnowYourFamilyTree',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KnowYourFamilyTree - Family Tree Builder',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KnowYourFamilyTree - Build and Share Your Family Tree',
    description: 'Create, build, and share beautiful family trees with KnowYourFamilyTree.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#10b981" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "KnowYourFamilyTree",
              "description": "Create, build, and share beautiful family trees",
              "url": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
              "applicationCategory": "LifestyleApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}