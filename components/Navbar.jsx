import Link from "next/link";
import { Bus, LayoutDashboard, Map, Megaphone, Route } from "lucide-react";

export default function Navbar() {
  return (
    <header
      className="sticky top-0 z-40 transition-all duration-200"
      style={{
        background: "var(--bg-surface-glass)",
        backdropFilter: "blur(20px) saturate(1.6)",
        WebkitBackdropFilter: "blur(20px) saturate(1.6)",
        borderBottom: "1px solid var(--border-subtle)",
        boxShadow: "var(--elevation-1)",
      }}
    >
      <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4 py-3">
        {/* Brand */}
        <Link
          className="flex items-center gap-2.5 font-extrabold no-underline"
          href="/"
          style={{ color: "var(--text-primary)" }}
        >
          <span
            className="grid size-9 place-items-center rounded-xl text-white"
            style={{
              background: "var(--accent-1)",
              boxShadow: "0 2px 8px rgba(14, 165, 233, 0.35)",
            }}
          >
            <Bus size={18} aria-hidden="true" />
          </span>
          <span className="hidden text-lg font-extrabold sm:block" style={{ color: "var(--text-accent)" }}>
            Bus<span style={{ color: "var(--text-primary)" }}>UNS</span>
          </span>
        </Link>

        {/* Center nav links */}
        <nav
          className="flex items-center gap-0.5 text-sm font-semibold"
          aria-label="Navigasi utama"
        >
          <Link
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition-colors duration-150"
            href="/#halte"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-inset)";
              e.currentTarget.style.color = "var(--text-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Route size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Halte</span>
          </Link>
          <Link
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition-colors duration-150"
            href="/#peta"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-inset)";
              e.currentTarget.style.color = "var(--text-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Map size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Peta</span>
          </Link>
          <Link
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 transition-colors duration-150"
            href="/#pengumuman"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-inset)";
              e.currentTarget.style.color = "var(--text-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Megaphone size={15} aria-hidden="true" />
            <span className="hidden sm:inline">Pengumuman</span>
          </Link>
        </nav>

        {/* Admin CTA */}
        <Link
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-150"
          href="/admin"
          aria-label="Dashboard admin"
          style={{
            background: "var(--bg-inset)",
            border: "1px solid var(--border-default)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent-1)";
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "transparent";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(14, 165, 233, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-inset)";
            e.currentTarget.style.color = "var(--text-secondary)";
            e.currentTarget.style.borderColor = "var(--border-default)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <LayoutDashboard size={15} aria-hidden="true" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>
    </header>
  );
}
