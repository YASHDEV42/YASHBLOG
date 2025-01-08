import { AnimatedTitle } from "@/components/AnimatedTitle";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
const Home = async () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -right-1/4 -bottom-1/4 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center">
          <AnimatedTitle />
          <p className="text-lg sm:text-xl mb-8 text-muted-foreground max-w-3xl mx-auto">
            A place to read, write, and deepen your understanding of the world
            around us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" className="text-lg group">
              <Link href="/explorer">
                Start reading
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg">
              <Link href="/profile/create-post">Start writing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Home;
