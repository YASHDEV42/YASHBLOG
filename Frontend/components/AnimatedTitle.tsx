"use client";

import React, { useState, useEffect } from "react";

const words = ["ideas", "perspectives", "experiences", "insights"];

export function AnimatedTitle() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsAnimating(false);
      }, 500);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <h1 className="text-4xl sm:text-6xl lg:text-[85px] font-bold leading-tight tracking-tight mb-6 mx-auto">
      Human stories & <br />
      <span className="relative top-4 inline-block overflow-hidden">
        <span
          className={`inline-block transition-all duration-1000 
                text-transparent bg-gradient-to-r from-accent to-accent-foreground bg-clip-text
            ${
              isAnimating
                ? "opacity-0 -translate-y-2"
                : "opacity-100 translate-y-0"
            }`}
          aria-hidden={isAnimating}
        >
          {words[currentWordIndex]}
        </span>
      </span>
    </h1>
  );
}
