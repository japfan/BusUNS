import Link from "next/link";
import { Bus, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 mx-auto mt-4 flex w-[min(1180px,calc(100%-32px))] items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
      <Link className="flex items-center gap-3 font-black text-slate-950" href="/">
        <span className="grid size-10 place-items-center rounded-lg bg-blue-700 text-white">
          <Bus size={20} aria-hidden="true" />
        </span>
        <span>BusUNS</span>
      </Link>
      <nav className="flex items-center gap-1 overflow-x-auto text-sm font-semibold text-slate-500" aria-label="Navigasi utama">
        <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-950" href="/#peta">Peta</Link>
        <Link className="rounded-lg px-3 py-2 hover:bg-slate-100 hover:text-slate-950" href="/#pengumuman">Pengumuman</Link>
        <Link className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-100 hover:text-slate-950" href="/admin" aria-label="Dashboard admin">
          <LayoutDashboard size={18} aria-hidden="true" />
          Admin
        </Link>
      </nav>
    </header>
  );
}
