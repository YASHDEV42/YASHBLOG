import { useEffect, useState } from "react";

/**
 * Hook to prevent hydration mismatches by ensuring code only runs on client
 */
export function useHydration() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
}
