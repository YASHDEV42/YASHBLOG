"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { clearUser } from "@/redux/slices/userSlice";
import type { RootState } from "@/redux/store";
import { Moon, Sun, Menu, LogOut } from "lucide-react";
import { UserAvatar } from "@/components/UserAvatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useLogout } from "@/lib/hooks/auth/useLogout";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function Navbar() {
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const { user, initialized } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const { mutateAsync: logoutUser } = useLogout();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      dispatch(clearUser());

      await logoutUser();

      toast.success("Logged out successfully!");

      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const ThemeToggle = ({ mobile = false }: { mobile?: boolean }) => (
    <Button
      variant="ghost"
      size={mobile ? "default" : "icon"}
      onClick={handleThemeToggle}
      className={mobile ? "w-full justify-start" : ""}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <>
          <Sun className={mobile ? "h-4 w-4 mr-2" : "h-5 w-5"} />
          {mobile && "Light Mode"}
        </>
      ) : (
        <>
          <Moon className={mobile ? "h-4 w-4 mr-2" : "h-5 w-5"} />
          {mobile && "Dark Mode"}
        </>
      )}
    </Button>
  );

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {!initialized ? (
        <span className="text-muted-foreground px-3 py-2">Loading...</span>
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
            <Link
              href="/profile"
              onClick={() => mobile && setIsOpen(false)}
              className="flex items-center space-x-2"
            >
              {mobile && <UserAvatar user={user} size="sm" />}
              Profile
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={
              mobile
                ? "w-full justify-start text-destructive hover:text-destructive"
                : ""
            }
            onClick={() => {
              handleSignOut();
              if (mobile) setIsOpen(false);
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </Button>
          {mobile && (
            <>
              <div className="border-t my-2" />
              <ThemeToggle mobile />
            </>
          )}
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
          {mobile && (
            <>
              <div className="border-t my-2" />
              <ThemeToggle mobile />
            </>
          )}
        </>
      )}
    </>
  );

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b fixed top-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wide hover:tracking-wider transition-all duration-300">
                YASH
                <span className="text-primary">BLOG</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
            <ThemeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[320px] bg-background border-l"
              >
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <span className="text-xl font-bold">
                      YASH
                      <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                        BLOG
                      </span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-2 mt-6">
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
