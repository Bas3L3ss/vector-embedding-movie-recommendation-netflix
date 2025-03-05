"use client";

import NProgress from "nprogress";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import "nprogress/nprogress.css"; // Import default styles

export default function NProgressLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.start();
    const timeout = setTimeout(() => NProgress.done(), 500); // Fake delay for smooth transition
    return () => clearTimeout(timeout);
  }, [pathname]);

  return <>{children}</>;
}
