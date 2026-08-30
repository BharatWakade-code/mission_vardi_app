import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ParikshaSetu - Online Mock Test Portal & Mission Vardi',
  description: 'Comprehensive Mock Test & Exam Preparation Platform for MPSC, Police Bharti, and Competitive Exams.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="antialiased font-sans bg-gray-100 text-gray-900">
        {children}
      </body>
    </html>
  );
}
