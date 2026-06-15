"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Bus, Clock, Info, MapPin, Search, Sparkles, X } from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";
import Navbar from "@/components/Navbar";
import StopSchedulePanel from "@/components/StopSchedulePanel";
import { useBusData } from "@/components/useBusData";

const RealLeafletMap = dynamic(() => import("@/components/RealLeafletMap"), {
  loading: () => (
    <div
      className="grid h-[540px] place-items-center rounded-2xl"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="size-10 rounded-full animate-gradient"
          style={{
            background: "var(--accent-gradient)",
            backgroundSize: "200% 200%",
          }}
        />
        <span className="text-sm font-bold" style={{ color: "var(--text-tertiary)" }}>
          Memuat peta...
        </span>
      </div>
    </div>
  ),
  ssr: false,
});

export default function HomePage() {
  const { stops, schedules, announcements, operationalStatus, stopMap, loading } = useBusData();
  const [query, setQuery] = useState("");
  const [selectedStopId, setSelectedStopId] = useState(""); // Default kosong, tidak ada halte terpilih
  const [isFocused, setIsFocused] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [mobilePanelClosing, setMobilePanelClosing] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const sortedStops = useMemo(
    () => stops.filter((stop) => stop.status === "active").sort((a, b) => Number(a.stop_order) - Number(b.stop_order)),
    [stops],
  );

  // ── PERBAIKAN LOGIKA: selectedStop akan null jika belum ada id terpilih ──
  const selectedStop = selectedStopId ? stopMap[selectedStopId] : null;

  // Jadwal hanya difilter jika ada halte yang dipilih, jika tidak ada, kosongkan
  const selectedSchedules = useMemo(() => {
    if (!selectedStop) return [];
    return schedules
      .filter((schedule) => schedule.status === "active" && schedule.stop_id === selectedStop.id)
      .sort((a, b) => a.departure_time.localeCompare(b.departure_time));
  }, [selectedStop, schedules]);

  const nextStop = selectedStop ? stopMap[selectedStop.next_stop_id] : null;

  const nextGlobalSchedule = useMemo(() => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const activeSchedules = schedules
      .filter((schedule) => schedule.status === "active" && stopMap[schedule.stop_id]?.status === "active")
      .map((schedule) => {
        const [hour, minute] = schedule.departure_time.split(":").map(Number);
        const scheduleMinutes = hour * 60 + minute;
        const minutesUntil =
          scheduleMinutes >= currentMinutes
            ? scheduleMinutes - currentMinutes
            : scheduleMinutes + 24 * 60 - currentMinutes;
        return { ...schedule, minutesUntil };
      })
      .sort((a, b) => a.minutesUntil - b.minutesUntil || a.departure_time.localeCompare(b.departure_time));

    return activeSchedules[0];
  }, [now, schedules, stopMap]);

  const nextGlobalStop = stopMap[nextGlobalSchedule?.stop_id];
  const nextGlobalNextStop = stopMap[nextGlobalStop?.next_stop_id];

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const matchingStopIds = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return new Set(sortedStops.map((stop) => stop.id));

    return new Set(
      sortedStops
        .filter((stop) => {
          const stopSchedules = schedules.filter((schedule) => schedule.stop_id === stop.id);
          const text = [
            stop.name,
            stop.location_description || "",
            ...stopSchedules.map((schedule) => schedule.departure_time),
          ]
            .join(" ")
            .toLowerCase();
          return text.includes(keyword);
        })
        .map((stop) => stop.id),
    );
  }, [query, schedules, sortedStops]);

  const matchingStops = useMemo(
    () => sortedStops.filter((stop) => matchingStopIds.has(stop.id)),
    [sortedStops, matchingStopIds],
  );

  const activeAnnouncements = announcements.filter((announcement) => announcement.status === "active");

  // Fungsi dipicu ketika pin halte di peta diklik langsung oleh user
  function selectStop(stopId) {
    setSelectedStopId(stopId);
    setMobilePanelClosing(false);
    setMobilePanelOpen(true);
  }

  function closeMobilePanel() {
    setMobilePanelClosing(true);
    window.setTimeout(() => {
      setMobilePanelOpen(false);
      setMobilePanelClosing(false);
    }, 380);
  }

  // Fungsi dipicu saat memilih hasil pencarian dari Search Bar
  const handleSelectFromSearch = (stopId) => {
    setSelectedStopId(stopId); // Set ID halte aktif (lingkaran kuning pindah ke sini)
    setQuery("");
    setIsFocused(false);

    setTimeout(() => {
      const mapElement = document.getElementById("peta");
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center antialiased" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-5">
          <div
            className="grid size-16 animate-float place-items-center rounded-2xl text-white"
            style={{
              background: "var(--accent-gradient)",
              boxShadow: "0 8px 32px var(--accent-glow-strong)",
            }}
          >
            <Bus size={32} strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <p className="text-gradient text-sm font-black uppercase tracking-widest">Sistem Informasi</p>
            <p className="mt-1 text-base font-bold animate-pulse" style={{ color: "var(--text-secondary)" }}>
              Sinkronisasi jadwal rute...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const showDropdown = query.trim().length > 0 || isFocused;

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--bg-hero-gradient)" }}>
          <div
            className="absolute top-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full animate-orb-1 opacity-80"
            style={{ background: "var(--bg-hero-orb-1)" }}
          />
          <div
            className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full animate-orb-2 opacity-70"
            style={{ background: "var(--bg-hero-orb-2)" }}
          />
          <div
            className="absolute bottom-[-10%] left-[30%] w-[35vw] h-[35vw] max-w-[450px] max-h-[450px] rounded-full animate-orb-3 opacity-60"
            style={{ background: "var(--bg-hero-orb-3)" }}
          />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-96px)] w-[min(1180px,calc(100%-32px))] items-center gap-8 py-14 md:grid-cols-[1fr_0.82fr]">
          <div className="animate-stagger-in">
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide" style={{ color: "var(--text-accent)" }}>
              <Sparkles size={16} aria-hidden="true" />
              Sistem Informasi Jadwal Bus UNS
            </p>
            <h1 className="text-gradient mt-3 text-6xl font-black leading-none tracking-normal md:text-8xl">
              BusUNS
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 md:text-xl" style={{ color: "var(--text-secondary)" }}>
              Demo UI peta rute interaktif untuk satu rute utama BusUNS. Klik titik halte untuk melihat
              jadwal keberangkatan dari halte tersebut.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl px-6 py-3 font-black text-white shadow-lg cursor-pointer transition-all duration-300 animate-gradient"
                style={{
                  background: "var(--accent-gradient)",
                  backgroundSize: "200% 200%",
                  boxShadow: "0 6px 24px var(--accent-glow-strong)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 36px var(--accent-glow-strong)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 24px var(--accent-glow-strong)";
                }}
                onClick={(e) => {
                  e.preventDefault();
                  const searchSection = document.getElementById("peta");
                  if (searchSection) {
                    searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }}
              >
                Buka peta rute
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <a
                className="inline-flex min-h-11 items-center rounded-xl px-5 py-3 font-black transition-all duration-300"
                href="#pengumuman"
                style={{
                  background: "var(--bg-surface-glass)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid var(--border-default)",
                  color: "var(--text-primary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-accent)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-default)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                Pengumuman
              </a>
            </div>
          </div>

          {/* ── Next Schedule Card ── */}
          <div
            className="rounded-2xl p-6 transition-card animate-stagger-in"
            style={{
              animationDelay: "0.15s",
              background: "var(--bg-surface-glass)",
              backdropFilter: "blur(20px) saturate(1.5)",
              WebkitBackdropFilter: "blur(20px) saturate(1.5)",
              border: "1px solid var(--border-accent)",
              boxShadow: "var(--card-shadow), var(--card-shadow-glow)",
            }}
          >
            {operationalStatus?.isOperating ? (
              <>
                <p className="text-sm font-black uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
                  Jadwal berikutnya
                </p>
                <h2 className="mt-2 text-4xl font-black" style={{ color: "var(--text-primary)" }}>
                  {nextGlobalStop?.name ?? "-"}
                </h2>
                <strong
                  className="mt-5 block text-7xl font-black leading-none text-gradient"
                >
                  {nextGlobalSchedule?.departure_time
                    ? nextGlobalSchedule.departure_time.slice(0, 5)
                    : "--.--"}
                </strong>
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold"
                    style={{
                      background: "var(--next-stop-bg)",
                      border: "1px solid var(--next-stop-border)",
                      color: "var(--next-stop-text)",
                    }}
                  >
                    <MapPin size={14} aria-hidden="true" />
                    Halte berikutnya: {nextGlobalNextStop?.name ?? "-"}
                  </span>
                </div>
                {nextGlobalSchedule?.minutesUntil != null && (
                  <p className="mt-3 flex items-center gap-2 text-sm font-bold" style={{ color: "var(--text-tertiary)" }}>
                    <Clock size={14} aria-hidden="true" />
                    {nextGlobalSchedule.minutesUntil} menit lagi
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-black uppercase tracking-wide text-red-400">Status operasional</p>
                <h2 className="mt-2 text-4xl font-black" style={{ color: "var(--text-primary)" }}>
                  Bus tidak beroperasi
                </h2>
                <p
                  className="mt-5 rounded-xl p-4 text-lg font-bold leading-7"
                  style={{
                    background: "rgba(239, 68, 68, 0.08)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "var(--text-primary)",
                  }}
                >
                  {operationalStatus?.message}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <div id="peta" className="scroll-mt-24">

        {/* ── SEARCH BAR ── */}
        <section className="mx-auto w-[min(1180px,calc(100%-32px))] pb-3">
          <div className="relative">
            <div
              className="flex min-h-16 items-center gap-3 px-5 transition-all duration-300"
              style={{
                background: "var(--bg-surface-glass)",
                backdropFilter: "blur(16px) saturate(1.5)",
                WebkitBackdropFilter: "blur(16px) saturate(1.5)",
                border: "1px solid var(--border-default)",
                borderRadius: showDropdown ? "16px 16px 0 0" : "16px",
                borderBottomColor: showDropdown ? "var(--border-subtle)" : undefined,
                boxShadow: isFocused
                  ? "var(--card-shadow), 0 0 24px var(--accent-glow)"
                  : "var(--card-shadow)",
              }}
            >
              <Search size={20} className="shrink-0" style={{ color: "var(--text-tertiary)" }} aria-hidden="true" />
              <input
                className="w-full border-0 bg-transparent text-base font-semibold outline-none"
                type="text"
                placeholder="Cari halte. Contoh: FISIP, Teknik, Rektorat"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                style={{
                  color: "var(--text-primary)",
                  caretColor: "var(--accent-1)",
                }}
              />
              {query && (
                <button
                  className="shrink-0 rounded-lg p-1.5 transition-all duration-200"
                  type="button"
                  onClick={() => setQuery("")}
                  style={{ color: "var(--text-tertiary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--accent-glow)";
                    e.currentTarget.style.color = "var(--text-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-tertiary)";
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Dropdown hasil search */}
            {showDropdown && (
              <div
                className="absolute left-0 right-0 z-50 overflow-hidden rounded-b-2xl shadow-lg"
                style={{
                  background: "var(--bg-elevated)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid var(--border-default)",
                  borderTop: "none",
                }}
              >
                {matchingStops.length > 0 ? (
                  matchingStops.map((stop, index) => (
                    <button
                      key={stop.id}
                      className="flex w-full items-center gap-3 px-5 py-3 text-left transition-all duration-200"
                      type="button"
                      onClick={() => handleSelectFromSearch(stop.id)}
                      style={{
                        borderBottom: index < matchingStops.length - 1 ? "1px solid var(--border-subtle)" : "none",
                        animationDelay: `${index * 30}ms`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--accent-glow)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-xl"
                        style={{
                          background: "var(--accent-glow)",
                          color: "var(--text-accent)",
                        }}
                      >
                        <Bus size={17} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <strong className="block font-black" style={{ color: "var(--text-primary)" }}>
                          {stop.name}
                        </strong>
                        <small className="flex items-center gap-1 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>
                          <MapPin size={12} aria-hidden="true" />
                          {stop.location_description}
                        </small>
                      </span>
                      <span className="ml-auto shrink-0 text-sm font-black" style={{ color: "var(--text-accent)" }}>
                        {schedules.filter((s) => s.status === "active" && s.stop_id === stop.id).length} jadwal
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-4 font-semibold" style={{ color: "var(--text-tertiary)" }}>
                    Halte &quot;{query}&quot; tidak ditemukan.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── AREA PETA INTERAKTIF ── */}
        <section className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 pb-16 md:grid-cols-[minmax(0,1fr)_360px]">
          <RealLeafletMap
            stops={sortedStops}
            selectedStopId={selectedStopId} // Kirim ID murni (bisa string kosong di awal agar tidak ada warna kuning bawaan)
            matchingStopIds={matchingStopIds}
            onSelectStop={selectStop}
          />
          <StopSchedulePanel
            stop={selectedStop}
            nextStop={nextStop}
            schedules={selectedSchedules}
            currentTime={now}
            operationalStatus={operationalStatus}
          />
        </section>
      </div>

      {/* ── MOBILE PANEL JADWAL POPUP ── */}
      {mobilePanelOpen && selectedStop && (
        <>
          <button
            className={`fixed inset-0 z-[900] md:hidden ${mobilePanelClosing ? "animate-fade-out" : "animate-fade-in"
              }`}
            type="button"
            aria-label="Tutup panel jadwal"
            onClick={closeMobilePanel}
            style={{ background: "var(--overlay-bg)", backdropFilter: "blur(4px)" }}
          />
          <StopSchedulePanel
            stop={selectedStop}
            nextStop={nextStop}
            schedules={selectedSchedules}
            currentTime={now}
            mobile
            closing={mobilePanelClosing}
            operationalStatus={operationalStatus}
            onClose={closeMobilePanel}
          />
        </>
      )}

      {/* ── PENGUMUMAN ── */}
      <section className="mx-auto w-[min(1180px,calc(100%-32px))] pb-20" id="pengumuman">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide" style={{ color: "var(--text-accent)" }}>
              <Info size={16} aria-hidden="true" />
              Pengumuman
            </p>
            <h2 className="mt-1 text-4xl font-black" style={{ color: "var(--text-primary)" }}>Info operasional</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {activeAnnouncements.map((announcement, index) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} index={index} />
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 text-center text-sm font-medium"
        style={{
          borderTop: "1px solid var(--border-subtle)",
          color: "var(--text-tertiary)",
        }}
      >
        <p>© {new Date().getFullYear()} BusUNS — Universitas Sebelas Maret</p>
      </footer>
    </main>
  );
}