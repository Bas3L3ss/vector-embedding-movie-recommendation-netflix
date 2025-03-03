import { NextRequest, NextResponse } from "next/server";
import { supabase } from "./lib/supabase";

export async function middleware(req: NextRequest) {
  const protectedRoutes = ["/profile", "/mylist"];
  const { pathname } = req.nextUrl;

  if (protectedRoutes.includes(pathname)) {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile", "/mylist"], // Protect these routes
};
