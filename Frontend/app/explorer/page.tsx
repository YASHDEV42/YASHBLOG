import { Explorer } from "./components/explorer";

export default async function ExplorerPage() {
  return (
    <div className="w-[80vw] mt-10 mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Blog Explorer</h1>
      <Explorer />
    </div>
  );
}
