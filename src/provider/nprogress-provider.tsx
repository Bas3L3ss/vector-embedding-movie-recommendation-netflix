"use client";

import NProgress from "nprogress";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import "nprogress/nprogress.css"; // Import default styles

export default function NProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const parsedSearchParams = searchParams.toString();
  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => NProgress.done(), 500); // Fake delay for smooth transition
    return () => clearTimeout(timeout);
  }, [pathname, parsedSearchParams]); // Trigger NProgress on pathname and searchParams change

  return <>{children}</>;
}
