import type { Metadata } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Referency Barber - Agendamento Online',
  description: 'Barbearia de qualidade com agendamento online. Cortes, barbas e mais com os melhores profissionais.',
  metadataBase: new URL('https://referencybarber.com.br'),
  openGraph: {
    title: 'Referency Barber - Agendamento Online',
    description: 'Barbearia de qualidade com agendamento online.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${montserrat.variable} h-full antialiased`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen flex flex-col bg-rb-bg text-rb-charcoal antialiased">
        {children}
      </body>
    </html>
  )
}
