import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Project AWS-Transcribe',
  description: 'Created by Group-22',
  generator: 'VedantT',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
