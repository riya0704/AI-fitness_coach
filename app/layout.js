import './globals.css'

export const metadata = {
  title: 'AI Fitness Coach',
  description: 'Your personalized AI-powered fitness assistant',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
