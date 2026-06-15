import Link from "next/link";
import { Bus, LayoutDashboard, Map, Megaphone } from "lucide-react";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-40 mx-auto mt-4 flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4 rounded-2xl px-5 py-3 shadow-lg transition-card"
      style={{
        background: "var(--bg-surface-glass)",
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <Link className="flex items-center gap-3 font-black no-underline" href="/" style={{ color: "var(--text-primary)" }}>
        <span
          className="grid size-10 place-items-center rounded-xl text-white animate-gradient"
          style={{
            background: "var(--accent-gradient)",
            backgroundSize: "200% 200%",
            boxShadow: "0 4px 16px var(--accent-glow-strong)",
          }}
        >
          <Bus size={20} aria-hidden="true" />
        </span>
        <span className="text-gradient font-black text-lg">BusUNS</span>
      </Link>
      <nav className="flex items-center gap-1 overflow-x-auto text-sm font-semibold" style={{ color: "var(--text-secondary)" }} aria-label="Navigasi utama">
        <Link
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200"
          href="/#peta"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-glow)";
            e.currentTarget.style.color = "var(--text-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <Map size={16} aria-hidden="true" />
          Peta
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200"
          href="/#pengumuman"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-glow)";
            e.currentTarget.style.color = "var(--text-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <Megaphone size={16} aria-hidden="true" />
          Pengumuman
        </Link>
        <Link
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200"
          href="/admin"
          aria-label="Dashboard admin"
          style={{
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-glow)";
            e.currentTarget.style.color = "var(--text-accent)";
            e.currentTarget.style.borderColor = "var(--border-accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--border-default)";
          }}
        >
          <LayoutDashboard size={16} aria-hidden="true" />
          Admin
        </Link>
      </nav>
    </header>
  );
}
