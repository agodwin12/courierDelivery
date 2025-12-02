import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'MovingCargo - Real-Time Delivery Tracking',
    description: 'Track your deliveries in real-time with precision. Professional logistics and delivery tracking system.',
    keywords: ['delivery tracking', 'logistics', 'real-time tracking', 'GPS tracking', 'shipping', 'freight'],
    authors: [{ name: 'MovingCargo' }],
    openGraph: {
        title: 'MovingCargo - Real-Time Delivery Tracking',
        description: 'Track your deliveries in real-time with precision',
        type: 'website',
    },
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body className="antialiased">
        {children}
        </body>
        </html>
    )
}