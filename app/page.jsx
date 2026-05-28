"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Search, ShieldCheck } from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";
import Navbar from "@/components/Navbar";
import RouteCard from "@/components/RouteCard";
import ScheduleTable from "@/components/ScheduleTable";
import { useBusData } from "@/components/useBusData";

export default function HomePage() {
  const { routes, schedules, announcements, routeMap } = useBusData();
  const [query, setQuery] = useState("");

  const activeSchedules = schedules.filter((schedule) => schedule.status === "active");
  const filteredSchedules = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return activeSchedules;

    return activeSchedules.filter((schedule) => {
      const route = routeMap[schedule.routeId];
      const haystack = [
        route?.name,
        ...(route?.stops ?? []),
        schedule.time,
        schedule.from,
        schedule.to,
        schedule.days,
        schedule.note,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(keyword);
    });
  }, [activeSchedules, query, routeMap]);

  const nextSchedule = filteredSchedules
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))[0];
  const activeAnnouncements = announcements.filter((item) => item.status === "active");

  return (
    <main>
      <Navbar />

      <section className="hero-section">
        <div className="hero-content">
          <p className="eyebrow">Sistem Informasi Bus Kampus</p>
          <h1>BusUNS</h1>
          <p className="hero-copy">
            Cek jadwal keberangkatan, rute, halte, dan pengumuman operasional bus kampus dalam
            satu halaman yang ringan.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#jadwal">
              Lihat jadwal
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="secondary-button" href="#rute">
              Detail rute
            </a>
          </div>
        </div>
        <div className="route-visual" aria-label="Visualisasi rute BusUNS">
          {routes.map((route) => (
            <div className="visual-route" key={route.id}>
              <span style={{ backgroundColor: route.color }}>{route.name}</span>
              <div className="visual-line">
                {route.stops.map((stop) => (
                  <i key={stop} title={stop} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="quick-panel" aria-label="Ringkasan jadwal berikutnya">
        <div className="search-box">
          <Search size={20} aria-hidden="true" />
          <input
            type="search"
            placeholder="Cari rute, halte, tujuan, atau jam. Contoh: Teknik, Rute B, 06.30"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div className="next-card">
          <div>
            <p className="muted-small">Jadwal berikutnya</p>
            <h2>{nextSchedule ? nextSchedule.time : "--.--"}</h2>
          </div>
          {nextSchedule ? (
            <div>
              <strong>{routeMap[nextSchedule.routeId]?.name}</strong>
              <p>{nextSchedule.from} ke {nextSchedule.to}</p>
            </div>
          ) : (
            <p>Tidak ada jadwal yang cocok dengan pencarian.</p>
          )}
        </div>
      </section>

      <section className="content-section" id="jadwal">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Jadwal Bus</p>
            <h2>Keberangkatan aktif</h2>
          </div>
          <span className="section-badge">
            <CalendarDays size={16} aria-hidden="true" />
            {filteredSchedules.length} jadwal
          </span>
        </div>
        <ScheduleTable schedules={filteredSchedules} routeMap={routeMap} compact />
      </section>

      <section className="content-section" id="rute">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Rute dan Halte</p>
            <h2>Urutan halte tiap rute</h2>
          </div>
          <span className="section-badge">
            <ShieldCheck size={16} aria-hidden="true" />
            Tanpa GPS
          </span>
        </div>
        <div className="route-grid">
          {routes.map((route) => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </section>

      <section className="content-section" id="pengumuman">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Pengumuman</p>
            <h2>Info operasional terbaru</h2>
          </div>
        </div>
        <div className="announcement-grid">
          {activeAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </section>
    </main>
  );
}
