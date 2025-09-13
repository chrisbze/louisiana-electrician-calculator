import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Louisiana Electrician Quote Calculator',
  description: 'Professional electrical service quotes for Louisiana electricians with Louisiana pricing and permit tracking',
  keywords: 'electrician quotes, electrical services, Louisiana electrician, outlet installation, panel upgrade',
  manifest: '/manifest.json',
  themeColor: '#eab308',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Electrician Quotes'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#eab308" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Electrician Quotes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className={inter.className}>
        <div id="root">
          {children}
        </div>
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js')
                  .then(function(registration) {
                    console.log('PWA: Service Worker registered successfully:', registration.scope);
                  }, function(err) {
                    console.log('PWA: Service Worker registration failed: ', err);
                  });
              });
            }
          `
        }} />
      </body>
    </html>
  )
}