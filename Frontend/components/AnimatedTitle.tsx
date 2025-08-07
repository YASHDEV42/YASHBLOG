"use client";

import { useState, useEffect } from "react";

const words = [
  "ideas",
  "perspectives",
  "experiences",
  "insights",
  "stories",
  "thoughts",
];

export function AnimatedTitle() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let timeoutId: NodeJS.Timeout;

    if (isTyping) {
      if (displayText.length < currentWord.length) {
        timeoutId = setTimeout(() => {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        }, 100);
      } else {
        timeoutId = setTimeout(() => {
          setIsTyping(false);
        }, 1500);
      }
    } else {
      if (displayText.length > 0) {
        timeoutId = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, 50);
      } else {
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeoutId);
  }, [displayText, isTyping, currentWordIndex]);

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl opacity-30 animate-pulse" />

      <h1 className="relative text-4xl sm:text-6xl lg:text-[85px] font-bold leading-tight tracking-tight mb-6 mx-auto">
        {/* Static text with subtle animation */}
        <span className="inline-block">
          <span className="inline-block animate-fade-in-up">Human</span>{" "}
          <span className="inline-block animate-fade-in-up animation-delay-200">
            stories
          </span>{" "}
          <span className="inline-block animate-fade-in-up animation-delay-400">
            &
          </span>
        </span>

        <br />

        {/* Animated word container */}
        <span className="inline-block overflow-hidden">
          {/* Main animated text */}
          <span className="inline-block min-w-[300px] sm:min-w-[400px] lg:min-w-[500px]">
            <span
              className="inline-block text-primary bg-[length:200%_100%] animate-gradient-x"
              style={{ minHeight: "1.2em" }}
            >
              {displayText}
            </span>

            {/* Typing cursor */}
            <span className="inline-block w-1 h-[0.8em] bg-gradient-to-b from-primary to-secondary ml-1 animate-blink" />
          </span>

          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary/30 rounded-full animate-ping" />
          <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-secondary/30 rounded-full animate-pulse" />
        </span>

        {/* Floating particles */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/20 rounded-full animate-float" />
          <div className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-secondary/20 rounded-full animate-float-delayed" />
          <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-primary/30 rounded-full animate-float-slow" />
        </div>
      </h1>
    </div>
  );
}
