"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  ArrowRight, Bus, ChevronRight, Clock, Info,
  MapPin, Navigation, Route, Search, X,
} from "lucide-react";
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
        boxShadow: "var(--elevation-1)",
      }}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className="size-10 rounded-full"
          style={{
            background: "var(--accent-1)",
            animation: "pulse-dot 1.5s ease-in-out infinite",
          }}
        />
        <span className="text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>
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
  const [selectedStopId, setSelectedStopId] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [mobilePanelClosing, setMobilePanelClosing] = useState(false);
  const [now, setNow] = useState(() => new Date());

  // Parallax scroll for bus image
  const heroRef = useRef(null);
  const [busParallax, setBusParallax] = useState({ y: 0, opacity: 1, scale: 1 });

  // Photo slideshow
  const SLIDES = [
    "/images/campus1.jpg",
    "/images/campus2.jpg",
    "/images/campus3.jpg",
    "/images/campus4.jpg",
    "/images/campus5.jpg",
  ];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    function handleScroll() {
      if (!heroRef.current) return;
      const heroH = heroRef.current.offsetHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / heroH, 1); // 0 → 1 as hero scrolls out
      setBusParallax({
        y: scrollY * 0.38,                       // drift upward slower than page
        opacity: Math.max(1 - progress * 1.6, 0), // fade out as hero exits
        scale: 1 - progress * 0.06,              // very subtle shrink
      });
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const sortedStops = useMemo(
    () => stops.filter((stop) => stop.status === "active").sort((a, b) => Number(a.stop_order) - Number(b.stop_order)),
    [stops],
  );

  const selectedStop = selectedStopId ? stopMap[selectedStopId] : null;

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

  const activeScheduleCount = useMemo(
    () => schedules.filter((s) => s.status === "active").length,
    [schedules],
  );

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

  const handleSelectFromSearch = (stopId) => {
    setSelectedStopId(stopId);
    setQuery("");
    setIsFocused(false);

    setTimeout(() => {
      const mapElement = document.getElementById("peta");
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center" style={{ background: "var(--bg-base)" }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="grid size-14 place-items-center rounded-2xl text-white"
            style={{ background: "var(--accent-1)", boxShadow: "var(--elevation-3)" }}
          >
            <Bus size={28} strokeWidth={2.5} />
          </div>
          <p className="text-sm font-bold" style={{ color: "var(--text-tertiary)" }}>
            Memuat jadwal...
          </p>
        </div>
      </div>
    );
  }

  const showDropdown = query.trim().length > 0 || isFocused;

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-base)" }}>
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ background: "var(--bg-hero)" }}
      >
        {/* ── Photo slideshow background ── */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          {SLIDES.map((src, i) => (
            <div
              key={src}
              className={`hero-slide${i === activeSlide ? " active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}

          {/* Dark overlay: gradient dari atas gelap ke bawah lebih gelap */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(6,13,26,0.72) 0%, rgba(6,13,26,0.55) 40%, rgba(6,13,26,0.82) 100%)",
            }}
          />
          {/* Subtle cyan tint layer — brand color bleed */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(14,165,233,0.12) 0%, transparent 70%)",
            }}
          />
          {/* Bottom fade ke bg-base — seamless transition ke section berikutnya */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{
              background: "linear-gradient(to bottom, transparent, var(--bg-stats))",
            }}
          />
        </div>

        {/* Dot grid — subtle texture on top of photo */}
        <div className="dot-grid pointer-events-none absolute inset-0 z-[1] opacity-20" aria-hidden="true" />

        {/* ── BUS IMAGE RIGHT: z-index ABOVE slideshow, BELOW all text content ── */}
        <div
          className="pointer-events-none absolute bottom-0 hidden md:block"
          style={{
            right: 0,
            transform: `translateX(18%) translateY(${busParallax.y * 0.35}px) scale(${busParallax.scale})`,
            opacity: busParallax.opacity * 0.82,
            transition: "transform 0.05s linear, opacity 0.05s linear",
            willChange: "transform, opacity",
            width: "clamp(600px, 56vw, 920px)",
            zIndex: 2,
          }}
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "5%",
              width: "70%",
              height: "100px",
              background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(14,165,233,0.45) 0%, transparent 70%)",
              filter: "blur(24px)",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 2,
              left: "10%",
              width: "55%",
              height: "24px",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)",
              filter: "blur(10px)",
              zIndex: 0,
            }}
          />
          <Image
            src="/images/bus.png"
            alt="Bus kampus UNS"
            width={920}
            height={460}
            priority
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 32px 56px rgba(14,165,233,0.28)) drop-shadow(0 8px 24px rgba(0,0,0,0.6))",
            }}
          />
        </div>

        {/* ── BUS IMAGE LEFT: mirror of right bus ── */}
        <div
          className="pointer-events-none absolute bottom-0 hidden md:block"
          style={{
            left: 0,
            transform: `translateX(-18%) translateY(${busParallax.y * 0.35}px) scale(${busParallax.scale})`,
            opacity: busParallax.opacity * 0.82,
            transition: "transform 0.05s linear, opacity 0.05s linear",
            willChange: "transform, opacity",
            width: "clamp(600px, 56vw, 920px)",
            zIndex: 2,
          }}
          aria-hidden="true"
        >
          <div
            style={{
              position: "absolute",
              bottom: 0,
              right: "5%",
              width: "70%",
              height: "100px",
              background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(14,165,233,0.45) 0%, transparent 70%)",
              filter: "blur(24px)",
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 2,
              right: "10%",
              width: "55%",
              height: "24px",
              background: "radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)",
              filter: "blur(10px)",
              zIndex: 0,
            }}
          />
          <Image
            src="/images/bus2.png"
            alt="Bus kampus UNS 2"
            width={920}
            height={460}
            priority
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              position: "relative",
              zIndex: 1,
              filter: "drop-shadow(0 32px 56px rgba(14,165,233,0.28)) drop-shadow(0 8px 24px rgba(0,0,0,0.6))",
            }}
          />
        </div>

        <div className="relative z-[3] mx-auto w-[min(1180px,calc(100%-32px))]">

          {/* ── DESKTOP: 2-col text + card, bus absolute right-bottom ── */}
          <div className="grid items-center gap-8 py-24 pb-52 md:grid-cols-[1fr_400px] md:pb-60 md:pt-28">

            {/* ── LEFT: Text & CTAs ── */}
            <div className="animate-enter-up">
              <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              >
                <span
                  className="inline-block size-2 rounded-full"
                  style={{ background: "#22c55e", animation: "pulse-dot 2s ease-in-out infinite" }}
                />
                <span className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "#7dd3fc" }}>
                  Sistem Aktif · Real-time
                </span>
              </div>

              <h1 className="text-gradient text-6xl font-extrabold leading-[1.05] tracking-tight md:text-8xl">
                BusUNS
              </h1>
              <p className="mt-3 text-sm font-extrabold uppercase tracking-wider" style={{ color: "#7dd3fc" }}>
                Sistem Informasi Jadwal Bus Kampus UNS
              </p>
              <p className="mt-5 max-w-lg text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                Cek jadwal keberangkatan bus kampus dari{" "}
                <strong style={{ color: "#ffffff" }}>{sortedStops.length} halte</strong>{" "}
                aktif di seluruh UNS. Klik titik halte di peta untuk jadwal real-time.
              </p>

              {/* Quick stats row */}
              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: <MapPin size={14} />, label: `${sortedStops.length} Halte aktif` },
                  { icon: <Clock size={14} />, label: `${activeScheduleCount} Jadwal tersedia` },
                  { icon: <Route size={14} />, label: "1 Rute kampus" },
                ].map((stat) => (
                  <span
                    key={stat.label}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <span style={{ color: "#38bdf8" }}>{stat.icon}</span>
                    {stat.label}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl px-6 py-3 font-bold text-white transition-all duration-200"
                  style={{
                    background: "var(--accent-1)",
                    boxShadow: "0 4px 24px rgba(14,165,233,0.45)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(14,165,233,0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 24px rgba(14,165,233,0.45)";
                  }}
                  onClick={() => document.getElementById("peta")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  Buka peta rute
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
                <a
                  className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-xl px-5 py-3 font-bold transition-all duration-200"
                  href="#halte"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.25)",
                    color: "#ffffff",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <Bus size={16} aria-hidden="true" />
                  Daftar halte
                </a>
              </div>

              {/* Slide indicator dots — clickable */}
              <div className="mt-10 flex items-center gap-2" role="tablist" aria-label="Slide foto">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeSlide}
                    aria-label={`Foto ${i + 1}`}
                    onClick={() => setActiveSlide(i)}
                    className="cursor-pointer transition-all duration-300"
                    style={{
                      width: i === activeSlide ? "24px" : "6px",
                      height: "6px",
                      borderRadius: "999px",
                      background: i === activeSlide ? "var(--accent-1)" : "rgba(255,255,255,0.35)",
                      border: "none",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* ── RIGHT: Schedule Card ── */}
            <div
              className="animate-enter-up rounded-2xl p-6"
              style={{
                animationDelay: "80ms",
                background: "rgba(6,13,26,0.7)",
                backdropFilter: "blur(24px) saturate(1.4)",
                WebkitBackdropFilter: "blur(24px) saturate(1.4)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {operationalStatus?.isOperating ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block size-2 rounded-full animate-pulse-dot" style={{ background: "#22c55e" }} />
                      <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Jadwal berikutnya
                      </p>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-extrabold"
                      style={{ background: "rgba(34,197,94,0.15)", color: "#4ade80", border: "1px solid rgba(34,197,94,0.3)" }}
                    >
                      Beroperasi
                    </span>
                  </div>
                  <h2 className="mt-3 text-3xl font-extrabold" style={{ color: "#ffffff" }}>
                    {nextGlobalStop?.name ?? "-"}
                  </h2>
                  <strong className="mt-4 block text-6xl font-extrabold leading-none" style={{ color: "#38bdf8" }}>
                    {nextGlobalSchedule?.departure_time ? nextGlobalSchedule.departure_time.slice(0, 5) : "--.--"}
                  </strong>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-bold"
                      style={{ background: "rgba(14,165,233,0.15)", border: "1px solid rgba(14,165,233,0.25)", color: "#7dd3fc" }}
                    >
                      <Navigation size={14} aria-hidden="true" />
                      Berikutnya: {nextGlobalNextStop?.name ?? "-"}
                    </span>
                    {nextGlobalSchedule?.minutesUntil != null && (
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>
                        <Clock size={14} aria-hidden="true" />
                        {nextGlobalSchedule.minutesUntil} menit lagi
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-5 rounded-xl p-4"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p className="mb-3 text-xs font-extrabold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Jadwal hari ini
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {schedules
                        .filter((s) => s.status === "active" && s.stop_id === nextGlobalStop?.id)
                        .sort((a, b) => a.departure_time.localeCompare(b.departure_time))
                        .slice(0, 6)
                        .map((s) => {
                          const [h, m] = s.departure_time.split(":").map(Number);
                          const mins = h * 60 + m;
                          const cur = now.getHours() * 60 + now.getMinutes();
                          const isNext = s.id === nextGlobalSchedule?.id;
                          const passed = mins < cur;
                          return (
                            <span
                              key={s.id}
                              className="rounded-lg px-2.5 py-1 text-xs font-extrabold"
                              style={
                                isNext
                                  ? { background: "#0ea5e9", color: "#fff" }
                                  : passed
                                  ? { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }
                                  : { background: "rgba(14,165,233,0.2)", color: "#7dd3fc" }
                              }
                            >
                              {s.departure_time.slice(0, 5)}
                            </span>
                          );
                        })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#f87171" }}>Status operasional</p>
                  <h2 className="mt-3 text-3xl font-extrabold" style={{ color: "#ffffff" }}>Bus tidak beroperasi</h2>
                  <p
                    className="mt-4 rounded-xl p-4 text-base font-semibold leading-7"
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "rgba(255,255,255,0.8)" }}
                  >
                    {operationalStatus?.message}
                  </p>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 z-[3] -translate-x-1/2 flex flex-col items-center gap-1 opacity-40" aria-hidden="true">          <div className="h-8 w-5 rounded-full" style={{ border: "1.5px solid rgba(255,255,255,0.6)" }}>
            <div
              className="mx-auto mt-1.5 h-2 w-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.8)", animation: "enter-up 1.5s ease-in-out infinite" }}
            />
          </div>
        </div>
      </section>

      {/* ── ROUTE STOPS SECTION ── */}
      <section
        id="halte"
        className="scroll-mt-20 py-16"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider"
                style={{ color: "var(--text-accent)" }}
              >
                <Route size={15} aria-hidden="true" />
                Rute Kampus
              </p>
              <h2 className="mt-1 text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                Daftar halte
              </h2>
            </div>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200"
              style={{
                background: "var(--bg-inset)",
                border: "1px solid var(--border-default)",
                color: "var(--text-secondary)",
              }}
              onClick={() =>
                document.getElementById("peta")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-accent)";
                e.currentTarget.style.color = "var(--text-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border-default)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              Lihat di peta
              <ChevronRight size={15} aria-hidden="true" />
            </button>
          </div>

          {/* Stop timeline grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedStops.map((stop, index) => {
              const stopSchedules = schedules.filter(
                (s) => s.status === "active" && s.stop_id === stop.id,
              );
              const nextSchedule = stopSchedules
                .map((s) => {
                  const [h, m] = s.departure_time.split(":").map(Number);
                  const mins = h * 60 + m;
                  const cur = now.getHours() * 60 + now.getMinutes();
                  return { ...s, minutesUntil: mins >= cur ? mins - cur : mins + 1440 - cur };
                })
                .sort((a, b) => a.minutesUntil - b.minutesUntil)[0];

              return (
                <button
                  key={stop.id}
                  type="button"
                  className="cursor-pointer rounded-2xl p-4 text-left transition-all duration-200"
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-default)",
                    boxShadow: "var(--elevation-1)",
                  }}
                  onClick={() => {
                    selectStop(stop.id);
                    setTimeout(() => {
                      document.getElementById("peta")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }, 50);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-accent)";
                    e.currentTarget.style.boxShadow = "var(--elevation-2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-default)";
                    e.currentTarget.style.boxShadow = "var(--elevation-1)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className="grid size-8 shrink-0 place-items-center rounded-lg text-white text-sm font-extrabold"
                      style={{ background: "var(--accent-1)" }}
                    >
                      {index + 1}
                    </div>
                    <span
                      className="rounded-full px-2 py-0.5 text-xs font-extrabold"
                      style={{
                        background: "rgba(34, 197, 94, 0.1)",
                        color: "#16a34a",
                        border: "1px solid rgba(34, 197, 94, 0.18)",
                      }}
                    >
                      Aktif
                    </span>
                  </div>
                  <h3
                    className="mt-3 font-extrabold leading-snug"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {stop.name}
                  </h3>
                  <p
                    className="mt-1 flex items-center gap-1 text-xs"
                    style={{ color: "var(--text-tertiary)" }}
                  >
                    <MapPin size={10} aria-hidden="true" />
                    {stop.location_description || "UNS"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: "var(--text-tertiary)" }}>
                      {stopSchedules.length} jadwal
                    </span>
                    {nextSchedule && (
                      <span
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-extrabold"
                        style={{
                          background: "var(--next-stop-bg)",
                          color: "var(--next-stop-text)",
                        }}
                      >
                        <Clock size={10} aria-hidden="true" />
                        {nextSchedule.departure_time.slice(0, 5)}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── MAP SECTION ── */}
      <section
        id="peta"
        className="scroll-mt-20 py-16"
        style={{ background: "var(--bg-alt)" }}
      >
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="mb-8">
            <p
              className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider"
              style={{ color: "var(--text-accent)" }}
            >
              <MapPin size={15} aria-hidden="true" />
              Peta Interaktif
            </p>
            <h2 className="mt-1 text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
              Rute &amp; halte bus
            </h2>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <div
              className="flex min-h-14 items-center gap-3 px-5 transition-all duration-200"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                borderRadius: showDropdown ? "16px 16px 0 0" : "16px",
                borderBottomColor: showDropdown ? "var(--border-subtle)" : undefined,
                boxShadow: isFocused ? "var(--elevation-2), var(--focus-ring)" : "var(--elevation-1)",
              }}
            >
              <Search size={18} className="shrink-0" style={{ color: "var(--text-tertiary)" }} aria-hidden="true" />
              <input
                className="w-full border-0 bg-transparent text-base font-medium outline-none"
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
                  className="shrink-0 cursor-pointer rounded-lg p-1.5 transition-colors duration-150"
                  type="button"
                  onClick={() => setQuery("")}
                  style={{ color: "var(--text-tertiary)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--text-tertiary)";
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showDropdown && (
              <div
                className="absolute left-0 right-0 z-50 max-h-80 overflow-y-auto rounded-b-2xl"
                style={{
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border-default)",
                  borderTop: "none",
                  boxShadow: "var(--elevation-3)",
                }}
              >
                {matchingStops.length > 0 ? (
                  matchingStops.map((stop, index) => (
                    <button
                      key={stop.id}
                      className="flex w-full cursor-pointer items-center gap-3 px-5 py-3 text-left transition-colors duration-150"
                      type="button"
                      onClick={() => handleSelectFromSearch(stop.id)}
                      style={{
                        borderBottom: index < matchingStops.length - 1 ? "1px solid var(--border-subtle)" : "none",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--bg-surface-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <span
                        className="grid size-9 shrink-0 place-items-center rounded-lg"
                        style={{ background: "var(--bg-inset)", color: "var(--text-accent)" }}
                      >
                        <Bus size={16} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <strong className="block font-bold" style={{ color: "var(--text-primary)" }}>
                          {stop.name}
                        </strong>
                        <small className="flex items-center gap-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                          <MapPin size={11} aria-hidden="true" />
                          {stop.location_description}
                        </small>
                      </span>
                      <span className="ml-auto shrink-0 text-sm font-bold" style={{ color: "var(--text-accent)" }}>
                        {schedules.filter((s) => s.status === "active" && s.stop_id === stop.id).length}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-5 py-4 font-medium" style={{ color: "var(--text-tertiary)" }}>
                    Halte &quot;{query}&quot; tidak ditemukan.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Map + Panel */}
          <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_360px]">
            <RealLeafletMap
              stops={sortedStops}
              selectedStopId={selectedStopId}
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
          </div>
        </div>
      </section>

      {/* ── Mobile Panel ── */}
      {mobilePanelOpen && selectedStop && (
        <>
          <button
            className={`fixed inset-0 z-[900] md:hidden ${
              mobilePanelClosing ? "animate-fade-out" : "animate-fade-in"
            }`}
            type="button"
            aria-label="Tutup panel jadwal"
            onClick={closeMobilePanel}
            style={{ background: "var(--overlay-bg)" }}
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
      <section
        className="py-20"
        id="pengumuman"
        style={{ background: "var(--bg-base)" }}
      >
        <div className="mx-auto w-[min(1180px,calc(100%-32px))]">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p
                className="inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wider"
                style={{ color: "var(--text-accent)" }}
              >
                <Info size={15} aria-hidden="true" />
                Pengumuman
              </p>
              <h2 className="mt-1 text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>
                Info operasional
              </h2>
            </div>
            <span
              className="rounded-full px-3 py-1.5 text-sm font-bold"
              style={{
                background: "var(--bg-inset)",
                border: "1px solid var(--border-default)",
                color: "var(--text-tertiary)",
              }}
            >
              {activeAnnouncements.length} pengumuman aktif
            </span>
          </div>

          {activeAnnouncements.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeAnnouncements.map((announcement, index) => (
                <AnnouncementCard key={announcement.id} announcement={announcement} index={index} />
              ))}
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-4 rounded-2xl py-16 text-center"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div
                className="grid size-14 place-items-center rounded-2xl"
                style={{ background: "var(--bg-inset)", color: "var(--text-accent)" }}
              >
                <Info size={24} aria-hidden="true" />
              </div>
              <div>
                <p className="font-extrabold" style={{ color: "var(--text-primary)" }}>
                  Tidak ada pengumuman saat ini
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--text-tertiary)" }}>
                  Bus beroperasi normal sesuai jadwal
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-default)",
          background: "var(--bg-alt)",
        }}
      >
        {/* Footer top */}
        <div className="mx-auto w-[min(1180px,calc(100%-32px))] py-10">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <span
                  className="grid size-9 place-items-center rounded-lg text-white"
                  style={{ background: "var(--accent-1)" }}
                >
                  <Bus size={18} aria-hidden="true" />
                </span>
                <span className="text-lg font-extrabold" style={{ color: "var(--text-accent)" }}>BusUNS</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-tertiary)" }}>
                Sistem informasi jadwal dan rute bus kampus Universitas Sebelas Maret Surakarta.
              </p>
            </div>
            {/* Links */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Navigasi
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  { label: "Peta rute", href: "#peta" },
                  { label: "Daftar halte", href: "#halte" },
                  { label: "Pengumuman", href: "#pengumuman" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm font-semibold transition-colors duration-150"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-accent)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Status */}
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>
                Status layanan
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block size-2 rounded-full"
                    style={{
                      background: operationalStatus?.isOperating ? "#22c55e" : "#ef4444",
                      animation: operationalStatus?.isOperating ? "pulse-dot 2s ease-in-out infinite" : "none",
                    }}
                  />
                  <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Bus {operationalStatus?.isOperating ? "beroperasi normal" : "tidak beroperasi"}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--text-tertiary)" }}>
                  {sortedStops.length} halte · {activeScheduleCount} jadwal
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom bar */}
        <div
          style={{ borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="mx-auto flex w-[min(1180px,calc(100%-32px))] flex-wrap items-center justify-between gap-2 py-5">
            <p className="text-sm font-medium" style={{ color: "var(--text-tertiary)" }}>
              © {new Date().getFullYear()} BusUNS — Universitas Sebelas Maret
            </p>
            <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
              Data diperbarui secara real-time
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
