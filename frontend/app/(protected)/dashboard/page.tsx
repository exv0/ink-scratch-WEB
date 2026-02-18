"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

// Mock data - replace with real API calls once manga backend is ready
const continueReading = [
  { id: "1", title: "One Piece", chapter: 1124, progress: 75, genre: "Adventure" },
  { id: "2", title: "Jujutsu Kaisen", chapter: 261, progress: 45, genre: "Action" },
  { id: "3", title: "Chainsaw Man", chapter: 170, progress: 90, genre: "Dark Fantasy" },
];

const myLibrary = [
  { id: "1", title: "Berserk" },
  { id: "2", title: "Vinland Saga" },
  { id: "3", title: "Attack on Titan" },
  { id: "4", title: "Demon Slayer" },
  { id: "5", title: "Solo Leveling" },
  { id: "6", title: "My Hero Academia" },
  { id: "7", title: "Tokyo Ghoul" },
  { id: "8", title: "Naruto" },
];

const GENRE_COLORS: Record<string, string> = {
  Adventure: "from-blue-400 to-cyan-500",
  Action: "from-orange to-red",
  "Dark Fantasy": "from-purple-500 to-pink-600",
};

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange/20 border-t-orange rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary font-medium">Loading your library...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Welcome Banner */}
      <div className="relative bg-linear-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16">
          <p className="text-orange/80 font-bold text-sm tracking-widest uppercase mb-2">
            {greeting()}
          </p>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight">
            {user?.fullName || user?.username} 👋
          </h1>
          <p className="text-white/50 text-base max-w-md">
            You have {continueReading.length} stories in progress. Keep the adventure going!
          </p>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {[
              { label: "Reading", value: continueReading.length, icon: "📖" },
              { label: "In Library", value: myLibrary.length, icon: "📚" },
              { label: "Chapters Read", value: "247", icon: "📄" },
              { label: "Hours Spent", value: "24h", icon: "⏱️" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{stat.icon}</span>
                  <span className="text-2xl font-black text-white">{stat.value}</span>
                </div>
                <p className="text-white/40 text-xs font-semibold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-14">

        {/* Continue Reading */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-text-primary">Continue Reading</h2>
              <p className="text-text-secondary text-sm mt-0.5">Pick up right where you left off</p>
            </div>
            <Link href="/manga" className="text-sm font-bold text-orange hover:underline underline-offset-4">
              Browse More →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {continueReading.map((item) => (
              <Link href={`/manga/${item.id}`} key={item.id}>
                <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer border border-divider">
                  {/* Cover placeholder with gradient */}
                  <div className={`relative h-52 bg-linear-to-br ${GENRE_COLORS[item.genre] ?? "from-gray-300 to-gray-400"} overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIG9wYWNpdHk9Ii4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRIMjJzMiAyIDIgNHYyYzAgMiAyIDQgMiA0aDhzMi0yIDItNHYtMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl opacity-30 select-none">📕</span>
                    </div>
                    {/* Genre badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-black text-white/90 bg-black/30 backdrop-blur px-2 py-0.5 rounded-full tracking-wide">
                        {item.genre}
                      </span>
                    </div>
                    {/* Progress overlay at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-black/20">
                      <div
                        className="h-full bg-white/70 rounded-full transition-all duration-500"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-black text-text-primary group-hover:text-orange transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm mt-0.5">Chapter {item.chapter}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-semibold text-text-secondary">{item.progress}% complete</span>
                      <span className="text-xs font-bold text-orange bg-orange/10 px-2.5 py-1 rounded-full">
                        Continue →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* My Library */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-text-primary">My Library</h2>
              <p className="text-text-secondary text-sm mt-0.5">Your saved titles</p>
            </div>
            <button className="text-sm font-bold text-orange hover:underline underline-offset-4">
              Manage →
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {myLibrary.map((item, i) => {
              const gradients = [
                "from-orange to-red",
                "from-purple-500 to-pink-600",
                "from-blue-400 to-cyan-500",
                "from-green-400 to-emerald-600",
                "from-yellow-400 to-orange",
                "from-pink-400 to-rose-600",
                "from-indigo-400 to-purple-600",
                "from-teal-400 to-green-500",
              ];
              return (
                <Link href={`/manga/${item.id}`} key={item.id}>
                  <div className="group cursor-pointer">
                    <div className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-linear-to-br ${gradients[i % gradients.length]} shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200`}>
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <span className="text-4xl">📕</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs font-bold text-text-primary truncate leading-tight">
                      {item.title}
                    </p>
                  </div>
                </Link>
              );
            })}

            {/* Add more placeholder */}
            <Link href="/manga">
              <div className="group cursor-pointer">
                <div className="aspect-[3/4] rounded-xl border-2 border-dashed border-divider flex items-center justify-center group-hover:border-orange/50 group-hover:bg-orange/5 transition-all duration-200">
                  <span className="text-2xl text-divider group-hover:text-orange/40 transition-colors">+</span>
                </div>
                <p className="mt-2 text-xs font-bold text-text-secondary truncate">Add More</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Browse CTA */}
        <section className="bg-linear-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative">
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Discover new stories</h3>
            <p className="text-white/40 mb-7 text-sm">Thousands of manga titles waiting for you</p>
            <Link href="/manga">
              <button className="px-8 py-3 bg-linear-to-r from-orange to-red text-white font-black rounded-xl shadow-lg shadow-orange/25 hover:scale-105 hover:shadow-orange/40 transition-all duration-200">
                Browse All Titles →
              </button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}