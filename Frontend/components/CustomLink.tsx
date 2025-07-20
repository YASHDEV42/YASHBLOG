"use client"; // This component must be a Client Component

import { useState, useEffect, ReactNode, MouseEvent, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation"; // Use `next/navigation` for App Router

// Define the props interface
interface CustomLinkProps {
  href: string; // `href` must be a string
  children: ReactNode; // `children` can be any valid React node
}

export default function CustomLink({ href, children }: CustomLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const isFirstNavigation = useRef(true); // Track first navigation

  // Detect route changes using `pathname` and `searchParams`
  useEffect(() => {
    if (isFirstNavigation.current) {
      setIsLoading(false); // Reset loading state after first navigation
      isFirstNavigation.current = false; // Mark first navigation as complete
    }
  }, [pathname, searchParams]);

  // Type-safe click handler
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isFirstNavigation.current) {
      e.preventDefault();
      setIsLoading(true); // Show loading spinner only during first navigation
      window.location.href = href; // Navigate using full page reload (or use `router.push` if available)
    }
  };

  return (
    <>
      <Link href={href} onClick={handleClick} passHref>
        {children}
      </Link>

      {isLoading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </>
  );
}
