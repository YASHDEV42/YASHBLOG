"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { Moon, Sun } from "lucide-react";
import Spinner from "./Spinner";

export function Navbar() {
  const [isLoaded, setIsLoaded] = useState(false);
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const dispatch = useDispatch();
  useEffect(() => {
    setIsLoaded(true);
  }, []);
  if (!isLoaded) return <Spinner />;
  return (
    <nav className="bg-background border-b absolute top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className=" tracking-wide hover:tracking-wider transition-all text-3xl">
                YASHBLOG
              </span>
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/login" passHref>
              <Button variant="ghost" className="mr-2">
                Log in
              </Button>
            </Link>
            <Link href="/signup" passHref>
              <Button>Sign up</Button>
            </Link>
            <Button
              variant={isDark ? "ghost" : "outline"}
              className="ml-2 w-12"
              onClick={() => dispatch(toggleTheme())}
            >
              {isDark ? <Sun size={36} /> : <Moon size={36} />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
