import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import WhatsAppWidget from "@/components/storefront/WhatsAppWidget";
import ThemeInit from "@/components/storefront/ThemeInit";
import { ThemeProvider } from "@/lib/ThemeProvider";
import FreeDeliveryBanner from "@/components/storefront/FreeDeliveryBanner";

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "Arcure Pharma - Your Trusted Online Pharmacy in Pakistan",
    template: "%s | Arcure Pharma",
  },
  description:
      "Arcure Pharma offers premium dermatological skincare in Pakistan. Shop original Arcu Gleam Face Wash, Arcu Shield Sunscreen, Arcu Glow, and Arcu Derm Serum with fast delivery in Karachi and across Pakistan.",
  keywords: [
    "pharmacy",
    "online pharmacy Pakistan",
    "medicated products",
    "skincare",
    "haircare",
    "health products",
    "Arcure Pharma",
    "Karachi pharmacy",
    "doorstep delivery",
      "Arcu Gleam Face Wash",
      "Arcu Shield Sunscreen",
      "Arcu Glow",
      "Arcu Derm Serum",

  ],
  authors: [{ name: "Arcure Pharma" }],
  creator: "Arcure Pharma",
  metadataBase: new URL("https://arcurepharma.com"),
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://www.arcurepharma.com",
    siteName: "Arcure Pharma",
    title: "Arcure Pharma - Your Trusted Online Pharmacy in Pakistan",
    description:
      "Quality medicated products delivered to your doorstep. Skincare, haircare & health essentials across Pakistan.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arcure Pharma - Your Trusted Online Pharmacy",
    description:
      "Quality medicated products delivered to your doorstep with care and reliability.",
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
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${montserrat.variable} antialiased`}>
        
        <ThemeProvider>
          <WhatsAppWidget />
          <FreeDeliveryBanner />
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: "var(--color-teal-600)",
                color: "#fff",
                borderRadius: "12px",
              },
            }}
          />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}



