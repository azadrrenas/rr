import type { Metadata } from "next";
import { Playfair_Display, Poppins, DM_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Bizim Koleksiyonumuz",
    template: "%s | Bizim Koleksiyonumuz",
  },
  description: "Sevdiklerinin en çok beğendiği şeylerin özenle hazırlanmış koleksiyonu.",
  openGraph: {
    title: "Bizim Koleksiyonumuz",
    description: "Sevdiklerinin en çok beğendiği şeylerin özenle hazırlanmış koleksiyonu.",
    url: siteUrl,
    siteName: "Bizim Koleksiyonumuz",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bizim Koleksiyonumuz",
    description: "Sevdiklerinin en çok beğendiği şeylerin özenle hazırlanmış koleksiyonu.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body
        className={`${playfair.variable} ${poppins.variable} ${dmSans.variable} font-body bg-background antialiased`}
      >
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#FFFFFF",
              color: "#2b2b2b",
              border: "1px solid #F5D6E3",
              borderRadius: "9999px",
              padding: "10px 18px",
              fontFamily: "var(--font-poppins)",
              fontSize: "14px",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
