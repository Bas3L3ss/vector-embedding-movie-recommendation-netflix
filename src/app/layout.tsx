import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Toaster } from "sonner";
import { Separator } from "../components/ui/separator";
import NProgressLayout from "@/provider/nprogress-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Netflix",
  description: "Watch your movies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <NProgressLayout>
          <main className="min-h-screen   bg-black">
            <Navbar />
            <Toaster />
            {children}
          </main>
          <Separator className="bg-red-500" />
          <Footer />
        </NProgressLayout>
      </body>
    </html>
  );
}
