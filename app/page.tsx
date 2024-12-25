import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <div className="h-screen flex items-center justify-center container relative font-semiblod tracking-wider">
      <h1 className=" text-6xl">WELLCOME IN YASHBLOG</h1>
      <span className="absolute bottom-10 flex items-center justify-center flex-col">
        <ArrowDown size={32} className=" animate-bounce" />
      </span>
    </div>
  );
}
