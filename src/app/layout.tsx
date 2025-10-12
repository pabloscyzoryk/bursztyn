// imports
import type { Metadata, Viewport } from 'next';
import { Layout } from '@/lib/layout';

// chakra - ui
import { Provider } from '@/components/ui/provider';

type RootLayoutProps = {
  children: React.ReactNode;
};

const APP_NAME = 'Bursztyn';

export const metadata: Metadata = {
  title: { default: APP_NAME, template: '%s | Bursztyn' },
  description: 'Generator krzyżówek',
  applicationName: APP_NAME,
  appleWebApp: {
    capable: true,
    title: APP_NAME,
    statusBarStyle: 'default',
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Layout>{children}</Layout>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;
