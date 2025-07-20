"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Geist, Geist_Mono } from "next/font/google";
import { RootState } from "@/redux/store";
import Spinner from "./Spinner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Theme = ({ children }: { children: React.ReactNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const isDark = useSelector((state: RootState) => state.theme.isDark);
  const theme = isDark ? "dark" : "light";

  return (
    <div
      className={`${geistSans.variable} ${geistMono.variable} antialiased ${theme} bg-background text-foreground`}
    >
      {isLoaded ? children : <Spinner />}
    </div>
  );
};

export default Theme;
