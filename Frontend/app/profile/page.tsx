import { Metadata } from "next";
import { Suspense } from "react";
import ProfileHeader from "./components/profile-header";
import ProfileTabs from "./components/profile-tabs";

// SEO Metadata
export const metadata: Metadata = {
  title: "User Profile | YASHBLOG",
  description: "View and manage your personal profile, published blog posts, liked content, and account settings on YASHBLOG.",
  keywords: [
    "user profile",
    "blog author",
    "personal dashboard",
    "blog posts",
    "user content",
    "blogging platform",
    "YASHBLOG"
  ],
  authors: [{ name: "YASHBLOG" }],
  creator: "YASHBLOG",
  publisher: "YASHBLOG",
  robots: {
    index: false, // Profile pages should not be indexed for privacy
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  openGraph: {
    title: "User Profile | YASHBLOG",
    description: "Manage your blog profile, posts, and settings on YASHBLOG.",
    type: "profile",
    siteName: "YASHBLOG",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "User Profile | YASHBLOG",
    description: "Manage your blog profile, posts, and settings on YASHBLOG.",
    creator: "@yashblog",
  },
  alternates: {
    canonical: "/profile",
  },
  other: {
    "referrer": "origin-when-cross-origin",
  },
};

export default function ProfilePage() {
  return (
    <>
      {/* Structured Data for Profile Page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            "mainEntity": {
              "@type": "Person",
              "name": "User Profile",
              "description": "Blog author profile page",
              "url": typeof window !== 'undefined' ? window.location.origin + "/profile" : "/profile",
            },
            "about": {
              "@type": "WebSite",
              "name": "YASHBLOG",
              "description": "A place to read, write, and deepen your understanding of the world around us.",
              "url": typeof window !== 'undefined' ? window.location.origin : "https://yashblog.com",
            },
            "inLanguage": "en-US",
            "isAccessibleForFree": true,
          }),
        }}
      />

      {/* Main Content with proper semantic HTML */}
      <main className="max-w-[80vw] mx-auto px-4 py-8 bg-background" role="main">
        <header>
          <h1 className="sr-only">User Profile Dashboard</h1>
        </header>
        
        <Suspense 
          fallback={
            <div className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg mb-6"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
            </div>
          }
        >
          <ProfileHeader />
        </Suspense>
        
        <section aria-label="Profile content and user posts">
          <Suspense 
            fallback={
              <div className="animate-pulse mt-6">
                <div className="h-12 bg-muted rounded-lg mb-4"></div>
                <div className="h-96 bg-muted rounded-lg"></div>
              </div>
            }
          >
            <ProfileTabs />
          </Suspense>
        </section>
      </main>
    </>
  );
}
