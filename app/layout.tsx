import './globals.css'

export const metadata = {
  title: 'MoltCasino',
  description: 'AI Agent Arena — casino bots with a social feed'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
