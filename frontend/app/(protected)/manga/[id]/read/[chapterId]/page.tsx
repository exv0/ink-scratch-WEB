"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { mangaService, ChapterWithPages, ChapterPage, Chapter } from "@/lib/services/manga.service";

type ReadMode = "vertical" | "paged";
type FitMode  = "width" | "height" | "original";

const ChevronLeft  = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>;
const ChevronRight = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>;
const VerticalIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>;
const PagedIcon    = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" /></svg>;
const SettingsIcon = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HomeIcon     = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;

// ── Page image component ───────────────────────────────────────────────────────
function MangaPageImage({ page, fitMode }: { page: ChapterPage; fitMode: FitMode }) {
  const [loaded,   setLoaded]   = useState(false);
  const [imgError, setImgError] = useState(false);

  const fitClass =
    fitMode === "width"    ? "w-full h-auto"       :
    fitMode === "height"   ? "h-screen w-auto"     :
    "max-w-full max-h-screen w-auto";

  return (
    <div className={`flex items-center justify-center bg-[#111] ${fitMode === "height" ? "min-h-screen" : ""}`}>
      {!imgError ? (
        <>
          {!loaded && (
            <div
              className={`${fitMode === "width" ? "w-full" : "w-[600px] max-w-full"} bg-[#1a1a1a] animate-pulse flex items-center justify-center`}
              style={{ aspectRatio: "2/3", minHeight: 400 }}
            >
              <span className="text-white/10 text-sm font-bold">Loading page {page.index + 1}…</span>
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.imageUrl}
            alt={`Page ${page.index + 1}`}
            className={`${fitClass} select-none ${loaded ? "block" : "hidden"}`}
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setImgError(true)}
          />
        </>
      ) : (
        <div
          className={`${fitMode === "width" ? "w-full" : "w-[600px] max-w-full"} bg-[#1a1a1a] flex flex-col items-center justify-center border border-white/5`}
          style={{ aspectRatio: "2/3", minHeight: 400 }}
        >
          <span className="text-4xl opacity-20 mb-3">⚠️</span>
          <p className="text-white/20 text-sm font-bold">Page {page.index + 1} failed to load</p>
        </div>
      )}
    </div>
  );
}

// ── Main Reader ───────────────────────────────────────────────────────────────
export default function ChapterReaderPage() {
  const params = useParams();
  const router = useRouter();
  const mangaId   = params.id as string;
  const chapterId = params.chapterId as string;

  // Chapter metadata comes from our backend; pages come directly from MangaDex
  const [chapter,      setChapter]      = useState<Omit<ChapterWithPages, "pages"> | null>(null);
  const [pages,        setPages]        = useState<ChapterPage[]>([]);
  const [allChapters,  setAllChapters]  = useState<Chapter[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [readMode,     setReadMode]     = useState<ReadMode>("vertical");
  const [fitMode,      setFitMode]      = useState<FitMode>("width");
  const [currentPage,  setCurrentPage]  = useState(1);
  const [uiVisible,    setUiVisible]    = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load chapter metadata + fresh image URLs + chapter list ──────────────
  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setCurrentPage(1);
      setPages([]);
      try {
        // 1. Get chapter metadata (sourceId, chapterNumber, title…) from our backend
        // 2. Get sibling chapters for prev/next nav
        const [chapterRes, chaptersRes] = await Promise.all([
          mangaService.getChapterPages(chapterId),
          mangaService.getChapters(mangaId),
        ]);

        const chapterData = chapterRes.data;
        setChapter(chapterData);
        setAllChapters(chaptersRes.data);

        // 3. Fetch brand-new image URLs directly from MangaDex using sourceId.
        //    Done client-side so URLs are always fresh — they can't expire
        //    between the backend fetching them and the browser rendering them.
        const freshPages = await mangaService.getFreshPages(chapterData.sourceId);
        setPages(freshPages);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [chapterId, mangaId]);

  // ── Prev / next chapter ───────────────────────────────────────────────────
  const currentIndex = allChapters.findIndex(c => c._id === chapterId);
  const prevChapter  = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const nextChapter  = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  const totalPages = pages.length;

  // ── Auto-hide UI ──────────────────────────────────────────────────────────
  const resetHideTimer = useCallback(() => {
    setUiVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setUiVisible(false), 3500);
  }, []);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [resetHideTimer]);

  // ── Keyboard nav ──────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (readMode !== "paged") return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") setCurrentPage(p => Math.min(p + 1, totalPages));
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   setCurrentPage(p => Math.max(p - 1, 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [readMode, totalPages]);

  // ── Scroll tracking (vertical mode) ──────────────────────────────────────
  useEffect(() => {
    if (readMode !== "vertical") return;
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          setCurrentPage(parseInt(entry.target.getAttribute("data-page") || "1", 10));
        }
      }),
      { threshold: 0.5 }
    );
    document.querySelectorAll("[data-page]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [readMode, pages]);

  const goNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
    else if (nextChapter) router.push(`/manga/${mangaId}/read/${nextChapter._id}`);
  };
  const goPrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const progressPct = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm font-bold">Loading chapter…</p>
      </div>
    </div>
  );

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !chapter) return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <p className="text-white font-black text-xl mb-2">Failed to load chapter</p>
        <p className="text-white/40 text-sm mb-6">{error}</p>
        <Link href={`/manga/${mangaId}`}>
          <button className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-sm rounded-xl">
            Back to Manga
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative" onMouseMove={resetHideTimer} onTouchStart={resetHideTimer}>

      {/* Top bar */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
        {/* Progress bar */}
        <div className="h-[3px] bg-white/10">
          <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
        </div>
        {/* Nav */}
        <div className="bg-[#111]/95 backdrop-blur border-b border-white/8 px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href={`/manga/${mangaId}`}>
              <button className="flex items-center gap-1.5 text-white/60 hover:text-white transition-colors shrink-0 text-sm font-bold">
                <ChevronLeft /><span className="hidden sm:block">Back</span>
              </button>
            </Link>
            <div className="w-px h-5 bg-white/15 shrink-0" />
            <div className="min-w-0">
              <p className="text-white font-black text-sm truncate">
                Chapter {chapter.chapterNumber}{chapter.title ? `: ${chapter.title}` : ""}
              </p>
              <p className="text-white/40 text-[11px]">Page {currentPage} of {totalPages}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/8 px-4 py-1.5 rounded-xl border border-white/10">
            <span className="text-white font-black text-sm">{currentPage}</span>
            <span className="text-white/30 text-xs">/</span>
            <span className="text-white/50 text-sm">{totalPages}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/dashboard">
              <button className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-all"><HomeIcon /></button>
            </Link>
            <button
              onClick={() => setSettingsOpen(v => !v)}
              className={`p-2 rounded-xl transition-all ${settingsOpen ? "text-orange-500 bg-orange-500/15" : "text-white/50 hover:text-white hover:bg-white/10"}`}
            >
              <SettingsIcon />
            </button>
          </div>
        </div>

        {/* Settings panel */}
        {settingsOpen && (
          <div className="bg-[#1a1a1a]/98 backdrop-blur border-b border-white/8 px-6 py-4">
            <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <p className="text-[10px] font-black text-white/40 tracking-widest uppercase mb-2.5">Reading Mode</p>
                <div className="flex gap-2">
                  {([
                    { value: "vertical", label: "Vertical Scroll", icon: <VerticalIcon /> },
                    { value: "paged",    label: "Page by Page",    icon: <PagedIcon /> },
                  ] as const).map(opt => (
                    <button key={opt.value} onClick={() => { setReadMode(opt.value); setCurrentPage(1); }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        readMode === opt.value
                          ? "bg-orange-500/15 border-orange-500/40 text-orange-500"
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white"
                      }`}
                    >{opt.icon}{opt.label}</button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-white/40 tracking-widest uppercase mb-2.5">Image Fit</p>
                <div className="flex gap-2">
                  {([
                    { value: "width",    label: "Fit Width"  },
                    { value: "height",   label: "Fit Height" },
                    { value: "original", label: "Original"   },
                  ] as const).map(opt => (
                    <button key={opt.value} onClick={() => setFitMode(opt.value)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        fitMode === opt.value
                          ? "bg-white/15 border-white/30 text-white"
                          : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                      }`}
                    >{opt.label}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reader content */}
      {readMode === "vertical" ? (
        <div className="pt-[57px]">
          {pages.map(page => (
            <div key={page.index} data-page={page.index}>
              <MangaPageImage page={page} fitMode={fitMode} />
            </div>
          ))}
          {/* End of chapter */}
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-[#111] border-t border-white/8">
            <p className="text-3xl mb-4">🎉</p>
            <p className="text-white font-black text-xl mb-1">End of Chapter {chapter.chapterNumber}</p>
            {chapter.title && <p className="text-white/40 text-sm mb-8">{chapter.title}</p>}
            <div className="flex gap-3">
              {prevChapter && (
                <Link href={`/manga/${mangaId}/read/${prevChapter._id}`}>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-xl border border-white/10 transition-all">
                    <ChevronLeft /> Previous
                  </button>
                </Link>
              )}
              {nextChapter ? (
                <Link href={`/manga/${mangaId}/read/${nextChapter._id}`}>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm rounded-xl shadow-lg hover:scale-105 transition-all">
                    Next Chapter <ChevronRight />
                  </button>
                </Link>
              ) : (
                <Link href={`/manga/${mangaId}`}>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm rounded-xl shadow-lg hover:scale-105 transition-all">
                    Back to Manga <ChevronRight />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-screen flex items-center justify-center relative pt-[57px]">
          <button onClick={goPrev} className="absolute left-0 top-0 bottom-0 w-1/3 z-10 opacity-0" aria-label="Previous page" />
          <button onClick={goNext} className="absolute right-0 top-0 bottom-0 w-1/3 z-10 opacity-0" aria-label="Next page" />
          <div className="w-full h-full flex items-center justify-center overflow-hidden">
            {pages[currentPage - 1] && (
              <MangaPageImage page={pages[currentPage - 1]} fitMode={fitMode} />
            )}
          </div>
          <button onClick={goPrev} disabled={currentPage === 1}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-black/60 backdrop-blur border border-white/10 text-white transition-all hover:bg-black/80 hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed ${uiVisible ? "opacity-100" : "opacity-0"}`}>
            <ChevronLeft />
          </button>
          <button onClick={goNext} disabled={currentPage === totalPages && !nextChapter}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-2xl bg-black/60 backdrop-blur border border-white/10 text-white transition-all hover:bg-black/80 hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed ${uiVisible ? "opacity-100" : "opacity-0"}`}>
            <ChevronRight />
          </button>
        </div>
      )}

      {/* Bottom bar (paged mode) */}
      {readMode === "paged" && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${uiVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full pointer-events-none"}`}>
          <div className="bg-[#111]/95 backdrop-blur border-t border-white/8 px-6 py-3">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4">
                <span className="text-white/40 text-xs font-bold w-6 text-right shrink-0">1</span>
                <input type="range" min={1} max={totalPages} value={currentPage}
                  onChange={e => setCurrentPage(Number(e.target.value))}
                  className="flex-1 h-1.5 accent-orange-500 cursor-pointer"
                />
                <span className="text-white/40 text-xs font-bold w-6 shrink-0">{totalPages}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <div className="flex gap-2">
                  {prevChapter && (
                    <Link href={`/manga/${mangaId}/read/${prevChapter._id}`}>
                      <button className="flex items-center gap-1 text-white/50 hover:text-white text-xs font-bold transition-colors">
                        <ChevronLeft /> Prev Ch.
                      </button>
                    </Link>
                  )}
                </div>
                <p className="text-white/30 text-xs font-semibold">Page {currentPage} of {totalPages}</p>
                <div className="flex gap-2">
                  {nextChapter && (
                    <Link href={`/manga/${mangaId}/read/${nextChapter._id}`}>
                      <button className="flex items-center gap-1 text-white/50 hover:text-white text-xs font-bold transition-colors">
                        Next Ch. <ChevronRight />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}