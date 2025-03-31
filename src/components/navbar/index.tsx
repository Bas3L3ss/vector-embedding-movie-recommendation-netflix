"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Menu, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signout } from "@/actions/auth";

import useUser from "@/hooks/use-user";
import Loading from "../reusable/loading";
import { navItems as navData } from "@/constants";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const { isLoading, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const navItems = navData(user);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      startTransition(() => {
        router.push(`/film?q=${encodeURIComponent(searchQuery)}`);
      });
    }
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black bg-opacity-90"
          : "bg-gradient-to-b from-black to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={navItems[0].path} className="flex-shrink-0">
              <div className="w-28 h-8 relative">
                <svg
                  viewBox="0 0 111 30"
                  className="fill-red-600 h-full w-full"
                >
                  <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"></path>
                </svg>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-2 text-sm font-medium ${
                      pathname === item.path
                        ? "text-white"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search"
                  className={cn(
                    "bg-black  bg-opacity-50 border border-gray-700 text-white pl-10 pr-4 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-white focus:border-transparent w-48 disabled:opacity-100",
                    isPending && "animate-pulse"
                  )}
                  value={searchQuery}
                  disabled={isPending}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  disabled={isPending}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                >
                  <Search className=" h-4 w-4 text-gray-400" />
                </button>
              </form>
            )}

            {isLoading ? (
              <Loading size={7} />
            ) : (
              <>
                {user ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="relative h-8 w-8 rounded-sm"
                        >
                          <Avatar className="h-8 w-8 rounded-sm">
                            <AvatarImage
                              src={
                                user.user_metadata?.picture ??
                                "/placeholder-user.jpg"
                              }
                              alt={user.user_metadata?.name ?? user.email}
                            />
                            <AvatarFallback className="rounded-sm bg-red-700">
                              {user.user_metadata?.name?.[0]?.toUpperCase() ||
                                "U"}
                            </AvatarFallback>
                          </Avatar>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-fit  bg-black border-red-600  text-white"
                        align="end"
                        forceMount
                      >
                        <DropdownMenuLabel className="font-normal ">
                          <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {user.user_metadata?.name ?? user.email}
                            </p>
                          </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-red-700 " />
                        <DropdownMenuItem
                          className="hover:bg-red-800! hover:text-white! cursor-pointer"
                          asChild
                        >
                          <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-red-800! hover:text-white! cursor-pointer"
                          asChild
                        >
                          <Link href="/my-list">My List</Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator className="bg-red-700" />
                        <DropdownMenuItem
                          className="hover:bg-red-800! hover:text-white! cursor-pointer"
                          onClick={() => signout()}
                        >
                          Sign out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-white hover:text-white hover:bg-red-700 bg-red-700"
                    onClick={() => router.push("/auth/signin")}
                  >
                    Sign In
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-95 backdrop-blur-sm">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path
                    ? "text-white bg-gray-900"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {user && (
              <form onSubmit={handleSearch} className="px-4 mb-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search"
                    className="bg-black bg-opacity-50 border border-gray-700 text-white pl-10 pr-4 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-white focus:border-transparent w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                <Button variant={"destructive"} className="w-full mt-2 ">
                  Search
                </Button>
              </form>
            )}
            {user ? (
              <div className="px-4 space-y-2">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Avatar className="h-10 w-10 rounded-sm">
                      <AvatarImage
                        src={
                          user.user_metadata?.picture ?? "/placeholder-user.jpg"
                        }
                        alt={user.user_metadata?.name ?? user.email}
                      />
                      <AvatarFallback className="rounded-sm bg-red-700">
                        {user.user_metadata?.name[0].toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {user.user_metadata?.name ?? user.email}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/my-list"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My List
                  </Link>

                  <button
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
                    onClick={() => {
                      signout();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-4">
                <Button
                  className="w-full bg-red-700 hover:bg-red-700 text-white"
                  onClick={() => {
                    router.push("/auth/signin");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
