// app/(public)/_components/Header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Simulate logged-in state (replace with real auth later)
  const isLoggedIn = pathname.startsWith("/dashboard");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl shadow-lg border-b border-orange/10">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <h1 className="bg-gradient-to-r from-orange via-red to-orange bg-clip-text text-transparent text-3xl md:text-4xl font-black tracking-tight group-hover:scale-105 transition-transform">
              Ink Scratch
            </h1>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`relative px-5 py-2.5 text-base font-bold rounded-xl transition-all duration-200 ${
                pathname === "/" 
                  ? "text-orange bg-orange/10" 
                  : "text-gray-700 hover:text-orange hover:bg-orange/5"
              }`}
            >
              Home
              {pathname === "/" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-orange to-red rounded-full"></span>
              )}
            </Link>
            
            <Link
              href="/about"
              className={`relative px-5 py-2.5 text-base font-bold rounded-xl transition-all duration-200 ${
                pathname === "/about" 
                  ? "text-orange bg-orange/10" 
                  : "text-gray-700 hover:text-orange hover:bg-orange/5"
              }`}
            >
              About Us
              {pathname === "/about" && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-orange to-red rounded-full"></span>
              )}
            </Link>
            
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className={`relative px-5 py-2.5 text-base font-bold rounded-xl transition-all duration-200 ${
                  pathname.startsWith("/dashboard")
                    ? "text-orange bg-orange/10"
                    : "text-gray-700 hover:text-orange hover:bg-orange/5"
                }`}
              >
                Continue Reading
                {pathname.startsWith("/dashboard") && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-orange to-red rounded-full"></span>
                )}
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="px-6 py-2.5 text-gray-800 font-bold text-sm rounded-xl hover:bg-gray-100 transition-all duration-200">
                  Log In
                </button>
              </Link>
              <Link href="/register">
                <button className="relative px-6 py-2.5 bg-gradient-to-r from-orange to-red text-white font-bold text-sm rounded-xl shadow-lg shadow-orange/30 hover:shadow-xl hover:shadow-orange/40 transition-all duration-200 hover:scale-105 overflow-hidden group">
                  <span className="relative z-10">Sign Up Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <button className="relative px-8 py-2.5 bg-gradient-to-r from-orange to-red text-white font-bold text-sm rounded-xl shadow-lg shadow-orange/30 hover:shadow-xl hover:shadow-orange/40 transition-all duration-200 hover:scale-105 overflow-hidden group">
                <span className="relative z-10 flex items-center gap-2">
                  <span>Dashboard</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red to-orange opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}