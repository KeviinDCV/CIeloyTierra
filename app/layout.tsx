import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cielo y Tierra - Restaurante',
  description: 'Menú digital del restaurante Cielo y Tierra. Escanea y descubre nuestra deliciosa carta.',
  keywords: 'restaurante, menú digital, comida, Cielo y Tierra',
  authors: [{ name: 'Cielo y Tierra' }],
  creator: 'Cielo y Tierra',
  publisher: 'Cielo y Tierra',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://cielo-y-tierra.vercel.app' : 'http://localhost:3001'),
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cielo y Tierra',
  },
  openGraph: {
    type: 'website',
    siteName: 'Cielo y Tierra',
    title: 'Cielo y Tierra - Menú Digital',
    description: 'Descubre nuestra deliciosa carta digital',
    locale: 'es_ES',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#e61d25',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet" />
        <link rel="icon" href="/Logo.png" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-black text-white antialiased">
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
          {children}
        </div>
      </body>
    </html>
  )
}
