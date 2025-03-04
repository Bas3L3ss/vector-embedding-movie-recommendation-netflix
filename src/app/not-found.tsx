import Link from "next/link";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="max-w-md text-center">
        <h1 className="text-[#E50914] text-4xl md:text-6xl font-bold mb-6">
          Lost your way?
        </h1>

        <div className="mb-8">
          <p className="text-xl mb-4">
            Sorry, we can&apos;t find that page. You&apos;ll find lots to
            explore on the home page.
          </p>
          <p className="text-gray-400">Error Code: NSES-404</p>
        </div>

        <Button
          asChild
          className="bg-[#E50914] hover:bg-[#E50914]/90 text-white px-6 py-2 rounded"
        >
          <Link href="/" className="flex items-center gap-2">
            <Home size={18} />
            Netflix Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
