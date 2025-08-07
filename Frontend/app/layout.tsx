import "./globals.css";
import { Navbar } from "@/components/Navbar";
import Theme from "@/components/Theme";
import { Toaster } from "sonner";
import ProviderComponent from "@/components/ProviderComponent";

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
         </head>
      <body className="antialiased ">
        <ProviderComponent>
          <Theme>
            <Navbar />
            <main id="main-content" className="min-h-screen w-full">
              {children}
            </main>
            <Toaster />
          </Theme>
        </ProviderComponent>
      </body>
    </html>
  );
}
