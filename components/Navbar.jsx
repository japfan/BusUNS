import Link from "next/link";
import { Bus, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">
          <Bus size={20} aria-hidden="true" />
        </span>
        <span>BusUNS</span>
      </Link>
      <nav className="nav-links" aria-label="Navigasi utama">
        <Link href="/#jadwal">Jadwal</Link>
        <Link href="/#rute">Rute</Link>
        <Link href="/#pengumuman">Pengumuman</Link>
        <Link className="admin-link" href="/admin" aria-label="Dashboard admin">
          <LayoutDashboard size={18} aria-hidden="true" />
          Admin
        </Link>
      </nav>
    </header>
  );
}
