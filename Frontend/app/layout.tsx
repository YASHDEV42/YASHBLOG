import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Theme from "@/components/Theme";
import { Toaster } from "sonner";

import ProviderComponent from "@/components/ProviderComponent";

export const metadata: Metadata = {
  title: {
    default: "YASHBLOG | A place to read, write, and deepen understanding",
    template: "%s | YASHBLOG",
  },
  description:
    "A place to read, write, and deepen your understanding of the world around us. Discover insightful blog posts, share your thoughts, and connect with a community of readers and writers.",
  keywords: [
    "blog",
    "blogging platform",
    "writing",
    "reading",
    "articles",
    "thoughts",
    "community",
    "knowledge sharing",
    "YASHBLOG",
  ],
  authors: [{ name: "YASHBLOG Team" }],
  creator: "YASHBLOG",
  publisher: "YASHBLOG",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_BASE_URL || "https://yashblog.com",
    siteName: "YASHBLOG",
    title: "YASHBLOG | A place to read, write, and deepen understanding",
    description:
      "A place to read, write, and deepen your understanding of the world around us.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "YASHBLOG - A place to read, write, and deepen understanding",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YASHBLOG | A place to read, write, and deepen understanding",
    description:
      "A place to read, write, and deepen your understanding of the world around us.",
    creator: "@yashblog",
    images: ["/og-image.png"],
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://yashblog.com"
  ),
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "your-google-verification-code", // Replace with actual verification code
  },
  other: {
    "theme-color": "#1e293b",
    "color-scheme": "dark light",
    referrer: "origin-when-cross-origin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "YASHBLOG",
              description:
                "A place to read, write, and deepen your understanding of the world around us.",
              url: process.env.NEXT_PUBLIC_BASE_URL || "https://yashblog.com",
              inLanguage: "en-US",
              isAccessibleForFree: true,
              author: {
                "@type": "Organization",
                name: "YASHBLOG",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: `${
                  process.env.NEXT_PUBLIC_BASE_URL || "https://yashblog.com"
                }/explorer?search={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <ProviderComponent>
          <Theme>
            <Navbar />
            <main id="main-content">{children}</main>
            <Toaster />
          </Theme>
        </ProviderComponent>
      </body>
    </html>
  );
}
