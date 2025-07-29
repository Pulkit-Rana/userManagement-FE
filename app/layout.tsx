// app/layout.tsx
import '@/app/global.css';
import { ReactNode } from 'react';
import { Providers } from '@/app/ui/components/providers';

export const metadata = {
  title: 'Veersa Nest',
  description: 'AI agent that logs bugs, stories and queries ADO via natural language.',
  openGraph: {
    title: 'Veersa Nest',
    url: 'https://your-app.com',
    siteName: 'Pulkit AI Agent',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Veersa Nest',
    description: 'Automate DevOps with LangGraph and Qdrant.',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
