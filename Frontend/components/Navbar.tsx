"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { RootState } from "@/redux/store";
import { Moon, Sun, Menu, LogOut } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/hooks/auth/useAuth"; // Add this import
import { toast } from "sonner";

export function Navbar() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  // Replace Redux user state with useAuth hook
  const { user, loading, logout } = useAuth();

  const handleSignOut = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const ThemeToggle = () => (
    <Button
      variant={isDark ? "ghost" : "outline"}
      size="icon"
      onClick={() => dispatch(toggleTheme())}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );

  const NavItems = ({ mobile = false }) => (
    <>
      {loading ? (
        <span className="text-muted-foreground">Loading...</span>
      ) : user ? (
        <>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            asChild
          >
            <Link href="/explorer" onClick={() => mobile && setIsOpen(false)}>
              Explorer
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            asChild
          >
            <Link href="/profile" onClick={() => mobile && setIsOpen(false)}>
              Profile
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            onClick={() => {
              handleSignOut();
              if (mobile) setIsOpen(false);
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            asChild
          >
            <Link href="/login" onClick={() => mobile && setIsOpen(false)}>
              Log in
            </Link>
          </Button>
          <Button className={mobile ? "w-full" : ""} asChild>
            <Link href="/signup" onClick={() => mobile && setIsOpen(false)}>
              Sign up
            </Link>
          </Button>
        </>
      )}
      {mobile && <ThemeToggle />}
    </>
  );

  return (
    <nav className="bg-background border-b fixed top-0 w-full z-10 shadow-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide hover:tracking-wider transition-all duration-300">
                YASH
                <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                  BLOG
                </span>
              </span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
            <ThemeToggle />
          </div>
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Menu size={24} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] sm:w-[300px]">
                <div className="flex flex-col space-y-4 mt-4">
                  <NavItems mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
