import type { Metadata } from "next";
import Script from "next/script";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ConditionalNavbar, ConditionalFooter } from "@/components/ConditionalLayout";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mhmocktest.in"),
  alternates: {
    canonical: "/",
  },
  generator: "Next.js",
  applicationName: "MH Mock Test",
  referrer: "origin-when-cross-origin",
  creator: "MH Mock Test Team",
  publisher: "MH Mock Test",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    default: "MH Mock Test | Best Site for Police Bharti & Talathi Mock Test in Marathi",
    template: "%s | MH Mock Test Portal"
  },
  description: "महाराष्ट्रातील सर्वोत्तम मोफत ऑनलाइन सराव परीक्षा (Free Mock Tests). Police Bharti, Talathi Bharti, MPSC, ZP Bharti व आरोग्य विभाग परीक्षेसाठी TCS/IBPS पॅटर्ननुसार सराव प्रश्नपत्रिका.",
  keywords: [
    "best site for police MH Mock Test in marathi",
    "free talathi bharti online test tcs pattern",
    "maharashtra zp bharti free mock test",
    "police bharti question paper 2026",
    "mpsc mock test free in marathi",
    "tcs ibps pattern mock test marathi",
    "police bharti syllabus and test series",
    "majhi naukri mock test alternative",
    "MH Mock Test online",
    "पोलीस भरती मोफत सराव परीक्षा",
    "तलाठी भरती ऑनलाइन টেস্ট",
    "mpsc rajyaseva mock test free",
    "mh cet mock test",
    "maharashtra competitive exams mock test",
    "maharashtra police bharti mock test",
    "mpsc rajyaseva free test",
    "mhmocktest.in",
    "mhmocktest",
    "free mock test for maharashtra police"
  ],
  authors: [{ name: "MH Mock Test Team", url: "https://mhmocktest.in" }],
  openGraph: {
    title: "MH Mock Test - Maharashtra's #1 Free Mock Test Portal",
    description: "पोलीस भरती, तलाठी, MPSC व ZP परीक्षेसाठी मोफत ऑनलाइन सराव टेस्ट सोडवा आणि लगेच निकाल व सविस्तर स्पष्टीकरण पहा.",
    url: "https://mhmocktest.in",
    siteName: "MH Mock Test Portal",
    locale: "mr_IN",
    type: "website",
    images: [
      {
        url: "https://mhmocktest.in/logo.png",
        width: 1200,
        height: 630,
        alt: "MH Mock Test Official Logo",
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "MH Mock Test Portal",
    description: "पोलीस भरती व तलाठी भरती मोफत सराव परीक्षा २०२६ - TCS/IBPS Pattern",
    images: ["https://mhmocktest.in/logo.png"],
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
        {/* Google AdSense Script */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5035062638976485"
          crossOrigin="anonymous"
        ></script>
        <ConditionalNavbar />
        <main className="main-content" style={{ padding: 0, margin: 0, width: "100%", overflowX: "hidden" }}>
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  );
}
