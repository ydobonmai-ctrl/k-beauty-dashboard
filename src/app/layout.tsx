import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'K-Beauty Demand Intelligence',
  description: 'Track beauty keyword demand by country using Google Trends data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-black text-white min-h-screen antialiased`}>
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
