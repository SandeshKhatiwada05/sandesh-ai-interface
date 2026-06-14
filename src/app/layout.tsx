import type { Metadata } from 'next';
import { Inter, Instrument_Serif } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter'
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['italic', 'normal'],
  variable: '--font-instrument-serif'
});

export const metadata: Metadata = {
  title: 'सन्देश',
  description: 'A monochrome personal portal with a secure AI chat gateway.',
  icons: {
    icon: '/images/favicon.png'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}