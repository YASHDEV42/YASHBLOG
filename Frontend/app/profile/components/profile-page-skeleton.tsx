import { ProfileHeaderSkeleton } from "./profile-header-skeleton";
import { ProfileTabsSkeleton } from "./profile-tabs-skeleton";

export function ProfilePageSkeleton() {
  return (
    <div className="max-w-[80vw] mx-auto px-4 py-8 animate-pulse">
      <ProfileHeaderSkeleton />
      <ProfileTabsSkeleton />
    </div>
  );
}
