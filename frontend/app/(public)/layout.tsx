// app/(public)/layout.tsx
import Header from "./_components/Header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header />
      {/*
        pt-[57px] offsets the fixed header:
          2.5px  — brand accent line
          54.5px — nav row (0.625rem top + bottom padding + content)
        Adjust this value if the header height ever changes.
      */}
      <main style={{ paddingTop: "57px" }}>
        {children}
      </main>
    </div>
  );
}