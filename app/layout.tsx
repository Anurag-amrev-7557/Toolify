import './globals.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'
import ServiceWorkerRegistration from './components/ServiceWorkerRegistration'

export const metadata = {
  title: 'Toolify',
  description: 'Fast, free, and integrated online utilities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#0ea5a6" />
  <link rel="manifest" href="/manifest.json" />
  <link rel="icon" href="/icons/icon-192.svg" />
  <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* iOS splash screen placeholders - update these with real splash images sized for devices */}
        <link rel="apple-touch-startup-image" href="/icons/icon-512.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/icon-512.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
      </head>
      <body className="flex flex-col min-h-screen">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ServiceWorkerRegistration />
        </ThemeProvider>
      </body>
    </html>
  )
}
