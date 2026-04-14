import type { Metadata } from 'next';
import './globals.css';
import { ApolloWrapper } from '@/lib/apollo';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Slooze Food Ordering',
  description: 'Role-based food ordering app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ApolloWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
