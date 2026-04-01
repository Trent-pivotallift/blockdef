import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BlockDef — Practice SysML. Master MBSE.',
  description:
    'Interactive SysML diagram exercises graded against OMG standards. Practice Package Diagrams, BDDs, IBDs, and Activity Diagrams in your browser.',
  keywords: ['SysML', 'MBSE', 'OCSMP', 'systems modeling', 'diagram practice', 'BlockDef'],
  openGraph: {
    title: 'BlockDef — Practice SysML. Master MBSE.',
    description: 'Interactive SysML exercises graded against OMG standards.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
