import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { getProjects } from '@/lib/services/projects';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'iMerge Solutions - Project Management',
  description: 'Comprehensive project and employee management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This will trigger the initialization of projects
  if (typeof window !== 'undefined') {
    getProjects();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen bg-background">
            <div className="border-b">
              <div className="flex h-16 items-center px-4">
                <MainNav />
                <div className="ml-auto flex items-center space-x-4">
                  <UserNav />
                </div>
              </div>
            </div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}