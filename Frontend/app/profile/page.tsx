import { Suspense } from "react";
import ProfileHeader from "./components/profile-header";
import ProfileTabs from "./components/profile-tabs";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <main
        className="max-w-[80vw] mx-auto px-4 py-8 bg-background"
        role="main"
      >
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
    </ProtectedRoute>
  );
}
