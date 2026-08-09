import type { Metadata } from "next";
import Script from "next/script";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://edusaasweb.in"),
  alternates: {
    canonical: "/",
  },
  generator: "Next.js",
  applicationName: "EduSaaS Web",
  referrer: "origin-when-cross-origin",
  creator: "EduSaaS Web Team",
  publisher: "EduSaaS Web",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    default: "EduSaaS Web | Best Site for Police Bharti & Talathi Mock Test in Marathi",
    template: "%s | EduSaaS Web Portal"
  },
  description: "Globalातील सर्वोत्तम मोफत ऑनलाइन Mock Exam (Free Mock Tests). Police Bharti, Talathi Bharti, MPSC, ZP Bharti व आरोग्य विभाग परीक्षेसाठी TCS/IBPS पॅटर्ननुसार Mock Question Paper.",
  keywords: [
    "best site for police EduSaaS Web in marathi",
    "free talathi bharti online test tcs pattern",
    "maharashtra zp bharti free mock test",
    "police bharti question paper 2026",
    "mpsc mock test free in marathi",
    "tcs ibps pattern mock test marathi",
    "police bharti syllabus and test series",
    "majhi naukri mock test alternative",
    "EduSaaS Web online",
    "Competitive Exams मोफत Mock Exam",
    "Aptitude Tests भरती ऑनलाइन टेस्ट",
    "mpsc rajyaseva mock test free",
    "mh cet mock test",
    "maharashtra competitive exams mock test",
    "maharashtra police bharti mock test",
    "mpsc rajyaseva free test",
    "edusaasweb.in",
    "edusaasweb",
    "free mock test for maharashtra police"
  ],
  authors: [{ name: "EduSaaS Web Team", url: "https://edusaasweb.in" }],
  openGraph: {
    title: "EduSaaS Web - Maharashtra's #1 Free Mock Test Portal",
    description: "Competitive Exams, Aptitude Tests, MPSC व ZP परीक्षेसाठी मोफत ऑनलाइन सराव टेस्ट सोडवा आणि लगेच निकाल व सविस्तर स्पष्टीकरण पहा.",
    url: "https://edusaasweb.in",
    siteName: "EduSaaS Web Portal",
    locale: "mr_IN",
    type: "website",
    images: [
      {
        url: "https://edusaasweb.in/logo.png",
        width: 1200,
        height: 630,
        alt: "EduSaaS Web Official Logo",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "EduSaaS Web Portal",
    description: "Competitive Exams व Aptitude Tests भरती मोफत Mock Exam २०२६ - TCS/IBPS Pattern",
    images: ["https://edusaasweb.in/logo.png"],
  },
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_TAG_HERE", // IMPORTANT FOR SEO
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mr" className={outfit.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/logo.png" />
      </head>
      <body>
        {/* Google AdSense Script - Requires next/script for proper hydration */}
        <Script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5035062638976485"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Navbar />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
