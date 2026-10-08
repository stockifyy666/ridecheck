import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import ThemeProvider from '@/components/ThemeProvider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'RideChecks – Professional Vehicle History Reports',
  description: 'Check any vehicle by VIN and uncover important vehicle history, specifications, and potential red flags before you buy. Professional, trusted, fast.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#0e1628', color: '#faf8f4', border: '1px solid rgba(196,149,58,0.3)', fontFamily: 'var(--font-body)' },
            success: { iconTheme: { primary: '#c4953a', secondary: '#faf8f4' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#faf8f4' } },
          }}
        />
      </body>
    </html>
  )
}
