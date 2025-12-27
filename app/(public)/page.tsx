// app/(public)/page.tsx
import Link from "next/link";
import Header from "./_components/Header";

export default function HomePage() {
  return (
    <>
      {/* Standout Top Navigation Bar */}
      <Header />

      {/* Add top padding to account for fixed header */}
      <div className="pt-24 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Hero Section */}
        <section className="px-6 py-16 md:py-24 lg:py-32 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="logo-gradient">Ink Scratch</span>
            </h1>
            <p className="mt-8 text-xl md:text-2xl text-text-primary font-medium">
              Your instant gateway to mangas, comics, and novels
            </p>
            <p className="mt-4 text-lg md:text-xl text-text-secondary max-w-3xl mx-auto">
              No downloads. No apps. Just open your browser and dive into thousands of stories. 
              Your reading progress syncs seamlessly across all your devices.
            </p>

            <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/register">
                <button className="btn-primary text-lg px-12 py-5">
                  Start Reading Free
                </button>
              </Link>
              <Link href="/login">
                <button className="px-12 py-5 bg-white text-orange font-semibold rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 border border-divider">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-6 py-20 bg-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-16">
              Why readers love Ink Scratch
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-6 bg-gradient-to-r from-orange to-red rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">⚡</span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">Instant Access</h3>
                <p className="text-text-secondary">
                  Start reading in seconds — no waiting for downloads
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-6 bg-gradient-to-r from-orange to-red rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">☁️</span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">Cloud Sync</h3>
                <p className="text-text-secondary">
                  Pick up exactly where you left off, on any device
                </p>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-6 bg-gradient-to-r from-orange to-red rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-4xl">📱</span>
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-3">Anywhere, Anytime</h3>
                <p className="text-text-secondary">
                  Read on your phone, tablet, or computer
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-20 text-center bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary">
              Ready to lose yourself in a great story?
            </h2>
            <p className="mt-6 text-xl text-text-secondary">
              Join thousands of readers enjoying Ink Scratch today
            </p>
            <Link href="/register">
              <button className="mt-10 btn-primary text-xl px-14 py-6">
                Get Started — It's Free
              </button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}