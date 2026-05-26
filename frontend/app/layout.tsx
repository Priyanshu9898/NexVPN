import type { Metadata } from 'next'
import { Bebas_Neue, Manrope, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  variable: '--font-bebas',
  weight: ['400'],
  display: 'swap',
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NexVPN — AI-Powered Privacy',
  description: 'AI-powered VPN that automatically routes your traffic through the fastest, safest exit node.',
  keywords: ['VPN', 'privacy', 'AI routing', 'WireGuard', 'secure'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${bebasNeue.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased" style={{ fontFamily: 'var(--font-manrope), system-ui, sans-serif' }}>
        {children}
      </body>
    </html>
  )
}
