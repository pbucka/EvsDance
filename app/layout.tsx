import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Ev's Dance",
  description: 'An interactive dance studio adventure',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
