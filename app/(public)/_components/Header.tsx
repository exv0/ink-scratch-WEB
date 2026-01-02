// app/(public)/_components/Header.tsx
"use client";  // ← ADD THIS LINE AT THE TOP!

import Link from "next/link";
import { usePathname } from "next/navigation"; // To highlight active link

export default function Header() {
  const pathname = usePathname();

  // Simulate logged-in state (replace with real auth later)
  const isLoggedIn = pathname.startsWith("/dashboard");

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md border-b border-divider">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center">
            <h1 className="logo-gradient text-3xl md:text-4xl font-bold">
              Ink Scratch
            </h1>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-lg font-medium transition ${
                pathname === "/" 
                  ? "text-orange font-bold" 
                  : "text-text-primary hover:text-orange"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-lg font-medium transition ${
                pathname === "/about" 
                  ? "text-orange font-bold" 
                  : "text-text-primary hover:text-orange"
              }`}
            >
              About Us
            </Link>
            {isLoggedIn && (
              <Link
                href="/dashboard"
                className={`text-lg font-medium transition ${
                  pathname.startsWith("/dashboard")
                    ? "text-orange font-bold"
                    : "text-text-primary hover:text-orange"
                }`}
              >
                Continue Reading
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="px-6 py-3 text-orange font-semibold rounded-xl hover:bg-orange/5 transition">
                  Log In
                </button>
              </Link>
              <Link href="/register">
                <button className="btn-primary px-6 py-3">
                  Sign Up Free
                </button>
              </Link>
            </>
          ) : (
            <Link href="/dashboard">
              <button className="btn-primary px-8 py-3">
                Dashboard
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}