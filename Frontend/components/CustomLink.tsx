"use client";

import { useState, useEffect, ReactNode, MouseEvent, useRef } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// Define the props interface
interface CustomLinkProps {
  href: string;
  children: ReactNode;
}

export default function CustomLink({ href, children }: CustomLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const isFirstNavigation = useRef(true);

  useEffect(() => {
    if (isFirstNavigation.current) {
      setIsLoading(false);
      isFirstNavigation.current = false;
    }
  }, [pathname, searchParams]);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isFirstNavigation.current) {
      e.preventDefault();
      setIsLoading(true);
      window.location.href = href;
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
