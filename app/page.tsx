import { Metadata } from "next";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { Button } from "@/components/ui/button";
import { ArrowRight, Waves } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home | YASHBLOG",
  description:
    "A place to read, write, and deepen your understanding of the world around us.",
};

const Home = async () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden ">
      <Waves
        size={300}
        className="absolute top-40 right-20 text-primary/90 hidden lg:block"
      />
      <Waves
        size={300}
        className="absolute top-40 left-20 text-primary/90 hidden lg:block"
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center">
          <AnimatedTitle />
          <p className="text-lg sm:text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            A place to read, write, and deepen your understanding of the world
            around us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
              asChild
              size="lg"
              className="text-lg group relative overflow-hidden hover:-translate-y-[4px] transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
            >
              <Link href="/explorer" className="flex items-center">
                Start reading
                {/* First Arrow (moves out and disappears) */}
                <ArrowRight className="ml-2 h-4 w-4 transition-all duration-300 ease-in-out transform group-hover:translate-x-[calc(100%+8px)] group-hover:opacity-0" />
                {/* Second Arrow (starts outside and moves into the original position) */}
                <ArrowRight className="ml-2 h-4 w-4 absolute transition-all duration-300 ease-in-out transform -translate-x-[calc(100%)] opacity-0 group-hover:translate-x-16 group-hover:opacity-100" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg hover:-translate-y-[4px] transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105"
            >
              <Link href="/profile/create-post">Start writing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
