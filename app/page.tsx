import { Button } from "@/components/ui/button";
import Link from "next/link";
const Home = async () => {
  return (
    <div className="relative min-h-[85vh] flex items-center">
      <div className="w-full  mx-auto px-6">
        <div className="text-center">
          <h1 className="text-[85px] leading-[1] tracking-tight mb-8">
            Human stories & ideas
          </h1>
          <p className="text-xl mb-8 opacity-85 ">
            A place to read, write, and deepen your understanding
          </p>
          <Button asChild className="px-6 py-2  text-lg">
            <Link href="/start-reading">Start reading</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};
export default Home;
