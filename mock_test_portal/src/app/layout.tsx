import type { Metadata } from "next";
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
  metadataBase: new URL("https://missionvardiapp.vercel.app"),
  alternates: {
    canonical: "/",
  },
  title: {
    default: "Mission Vardi | Best Site for Police Bharti & Talathi Mock Test in Marathi",
    template: "%s | Mission Vardi Mock Test Portal"
  },
  description: "महाराष्ट्रातील सर्वोत्तम मोफत ऑनलाइन सराव परीक्षा (Free Mock Tests). Police Bharti, Talathi Bharti, MPSC, ZP Bharti व आरोग्य विभाग परीक्षेसाठी TCS/IBPS पॅटर्ननुसार सराव प्रश्नपत्रिका.",
  keywords: [
    "best site for police bharti mock test in marathi",
    "free talathi bharti online test tcs pattern",
    "maharashtra zp bharti free mock test",
    "police bharti question paper 2026",
    "mpsc mock test free in marathi",
    "tcs ibps pattern mock test marathi",
    "police bharti syllabus and test series",
    "majhi naukri mock test alternative",
    "mission vardi online test",
    "पोलीस भरती मोफत सराव परीक्षा",
    "तलाठी भरती ऑनलाइन टेस्ट"
  ],
  authors: [{ name: "Mission Vardi Portal Team" }],
  openGraph: {
    title: "Mission Vardi - Maharashtra's #1 Free Mock Test Portal",
    description: "पोलीस भरती, तलाठी, MPSC व ZP परीक्षेसाठी मोफत ऑनलाइन सराव टेस्ट सोडवा आणि लगेच निकाल व सविस्तर स्पष्टीकरण पहा.",
    url: "https://missionvardiapp.vercel.app", // Target SEO authority link structure
    siteName: "Mission Vardi Mock Test Portal",
    locale: "mr_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mission Vardi Free Mock Test Portal",
    description: "पोलीस भरती व तलाठी भरती मोफत सराव परीक्षा २०२६ - TCS/IBPS Pattern",
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
        {/* Google AdSense Main Script - Commented out until domain is ready */}
        {/* <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        ></script> */}
      </head>
      <body>
        <Navbar />
        <main className="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
