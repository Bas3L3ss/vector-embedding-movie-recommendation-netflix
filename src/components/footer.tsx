"use client";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-black text-gray-300 pt-20 pb-8 mt-20">
      {/* Wave effect */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <div className="relative h-20">
          <div
            className="absolute bottom-0 left-0 w-[200%] h-20"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2342&q=80')",
              backgroundSize: "50% 100%",
              animation: "wave 15s linear infinite",
              opacity: 0.1,
              filter: "blur(5px)",
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Social Icons */}
          <div className="flex space-x-6 mb-8">
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="h-6 w-6" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Youtube className="h-6 w-6" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl mb-8">
            <div>
              <h3 className="text-gray-400 font-semibold mb-4">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tv-shows"
                    className="hover:text-white transition-colors"
                  >
                    TV Shows
                  </Link>
                </li>
                <li>
                  <Link
                    href="/movies"
                    className="hover:text-white transition-colors"
                  >
                    Movies
                  </Link>
                </li>
                <li>
                  <Link
                    href="/my-list"
                    className="hover:text-white transition-colors"
                  >
                    My List
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-semibold mb-4">Genres</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/genre/action"
                    className="hover:text-white transition-colors"
                  >
                    Action
                  </Link>
                </li>
                <li>
                  <Link
                    href="/genre/comedy"
                    className="hover:text-white transition-colors"
                  >
                    Comedy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/genre/drama"
                    className="hover:text-white transition-colors"
                  >
                    Drama
                  </Link>
                </li>
                <li>
                  <Link
                    href="/genre/sci-fi"
                    className="hover:text-white transition-colors"
                  >
                    Sci-Fi
                  </Link>
                </li>
                <li>
                  <Link
                    href="/genre/horror"
                    className="hover:text-white transition-colors"
                  >
                    Horror
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-gray-400 font-semibold mb-4">Account</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/account"
                    className="hover:text-white transition-colors"
                  >
                    Account
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/settings"
                    className="hover:text-white transition-colors"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Netflix Clone. All rights reserved.</p>
            <p className="mt-2">
              This is a demo project and not affiliated with Netflix.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </footer>
  );
}
