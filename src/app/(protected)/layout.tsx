import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const user = (await (await createClient()).auth.getUser()).data.user;
  if (!user) {
    redirect("/auth/signin");
  }
  return <>{children}</>;
};

export default Layout;
