"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { RootState } from "@/redux/store";
import { Moon, Sun, Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { user, isLoading, signOut } = useAuth();
  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const dispatch = useDispatch();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    setIsOpen(false);
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
      {isLoading ? (
        <span className="text-muted-foreground">Loading...</span>
      ) : user ? (
        <>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            onClick={() => {
              router.push("/explorer");
              if (mobile) setIsOpen(false);
            }}
          >
            Explorer
          </Button>
          <Button
            variant="ghost"
            className={mobile ? "w-full justify-start" : ""}
            onClick={() => {
              router.push("/profile");
              if (mobile) setIsOpen(false);
            }}
          >
            Profile
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
              router.push("/login");
              if (mobile) setIsOpen(false);
            }}
          >
            Log in
          </Button>
          <Button
            className={mobile ? "w-full" : ""}
            onClick={() => {
              router.push("/signup");
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
              <span className="text-2xl sm:text-3xl font-bold tracking-wide hover:tracking-wider transition-all text-primary">
                YASHBLOG
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
