"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BackButton({ to }: { to?: string }) {
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!to ? (
        <button
          onClick={() => router.back()}
          className={`flex items-center gap-1 text-sm font-medium text-red-600 transition-all duration-300 hover:translate-x-[-2px] hover:underline ${
            show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          }`}
        >
          <span>&lt; Back</span>
        </button>
      ) : (
        <Link
          href={to}
          className={`flex items-center gap-1 text-sm w-fit  font-medium text-red-600 transition-all duration-300 hover:translate-x-[-2px] hover:underline ${
            show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
          }`}
        >
          <span>&lt; Back</span>
        </Link>
      )}
    </>
  );
}
