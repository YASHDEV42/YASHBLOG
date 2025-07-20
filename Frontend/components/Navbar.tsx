"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { RootState } from "@/redux/store";
import { Moon, Sun, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { clearUser } from "@/redux/slices/userSlice";
import { UserService } from "@/lib/services/user.service";

export function Navbar() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { user, loading } = useSelector(
    (state: RootState) => state.user,
    shallowEqual
  );

  // Handle sign out with proper API call and state cleanup
  const handleSignOut = async () => {
    try {
      await UserService.logout();
      dispatch(clearUser());
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      // Still clear local state even if API call fails
      dispatch(clearUser());
      window.location.href = "/login";
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
            onClick={() => {
              if (mobile) setIsOpen(false);
            }}
          >
            <Link href="/explorer" className="text-base">
              Explorer
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            onClick={() => {
              if (mobile) setIsOpen(false);
            }}
          >
            <Link href="/profile" className="text-base">
              Profile
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            onClick={handleSignOut}
          >
            Log out
          </Button>
        </>
      ) : (
        <>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            onClick={() => {
              window.location.href = "/login";
              if (mobile) setIsOpen(false);
            }}
          >
            Log in
          </Button>
          <Button
            className={mobile ? "w-full" : ""}
            onClick={() => {
              window.location.href = "/signup";
              if (mobile) setIsOpen(false);
            }}
          >
            Sign up
          </Button>
        </>
      )}
      {mobile && <ThemeToggle />}
    </>
  );

  return (
    <nav className="bg-background border-b fixed top-0 w-full z-10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="qsm:text-3xl lg:text-4xl font-bold tracking-wide hover:tracking-wider transition-all duration-300">
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
