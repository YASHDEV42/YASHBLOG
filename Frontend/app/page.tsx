import type { Metadata } from "next";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, BookOpen, PenTool } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | YASHBLOG",
  description:
    "A place to read, write, and deepen your understanding of the world around us.",
};

const Home = async () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.1),transparent_50%)]" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-float" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-secondary/40 rounded-full animate-float-delayed" />
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-primary/20 rounded-full animate-float-slow" />

        {/* Geometric Shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-primary/10 rounded-full animate-spin-slow hidden lg:block" />
        <div className="absolute bottom-20 left-20 w-24 h-24 border border-secondary/10 rotate-45 animate-pulse hidden lg:block" />

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Content */}
      <section className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Welcome to the future of blogging
              </span>
            </div>

            {/* Animated Title */}
            <div className="space-y-4">
              <AnimatedTitle />
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
            </div>

            {/* Enhanced Description */}
            <div className="max-w-4xl mx-auto space-y-4">
              <p className="text-xl sm:text-2xl text-muted-foreground leading-relaxed">
                A place to read, write, and deepen your understanding of the
                world around us.
              </p>
            </div>

            {/* Enhanced Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-4">
              <Button
                asChild
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground border-0 px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              >
                <Link href="/explorer" className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  Start Reading
                  <div className="relative overflow-hidden w-5 h-5">
                    <ArrowRight className="w-5 h-5 transition-all duration-300 ease-out transform group-hover:translate-x-6 group-hover:opacity-0" />
                    <ArrowRight className="w-5 h-5 absolute top-0 left-0 transition-all duration-300 ease-out transform -translate-x-6 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                  </div>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="group relative overflow-hidden bg-background/50 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-primary/5"
              >
                <Link
                  href="/profile/create-post"
                  className="flex items-center gap-3"
                >
                  <PenTool className="w-5 h-5" />
                  Start Writing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default Home;
