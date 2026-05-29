"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRight, Info, Search } from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";
import Navbar from "@/components/Navbar";
import StopSchedulePanel from "@/components/StopSchedulePanel";
import { useBusData } from "@/components/useBusData";

const RealLeafletMap = dynamic(() => import("@/components/RealLeafletMap"), {
  loading: () => (
    <div className="grid h-[540px] place-items-center rounded-2xl border border-slate-200 bg-white font-bold text-slate-500 shadow-xl shadow-slate-200/70">
      Memuat peta...
    </div>
  ),
  ssr: false,
});

export default function HomePage() {
  const { stops, schedules, announcements, operationalStatus, stopMap } = useBusData();
  const [query, setQuery] = useState("");
  const [selectedStopId, setSelectedStopId] = useState("");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [mobilePanelClosing, setMobilePanelClosing] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const sortedStops = useMemo(
    () => stops.filter((stop) => stop.status === "active").sort((a, b) => Number(a.order) - Number(b.order)),
    [stops],
  );
  const selectedStop = stopMap[selectedStopId] ?? sortedStops[0];
  const selectedSchedules = schedules
    .filter((schedule) => schedule.status === "active" && schedule.stopId === selectedStop?.id)
    .sort((a, b) => a.time.localeCompare(b.time));
  const nextStop = stopMap[selectedSchedules[0]?.nextStopId];
  const nextGlobalSchedule = useMemo(() => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const activeSchedules = schedules
      .filter((schedule) => schedule.status === "active" && stopMap[schedule.stopId]?.status === "active")
      .map((schedule) => {
        const [hour, minute] = schedule.time.split(".").map(Number);
        const scheduleMinutes = hour * 60 + minute;
        const minutesUntil =
          scheduleMinutes >= currentMinutes
            ? scheduleMinutes - currentMinutes
            : scheduleMinutes + 24 * 60 - currentMinutes;

        return { ...schedule, minutesUntil };
      })
      .sort((a, b) => a.minutesUntil - b.minutesUntil || a.time.localeCompare(b.time));

    return activeSchedules[0];
  }, [now, schedules, stopMap]);
  const nextGlobalStop = stopMap[nextGlobalSchedule?.stopId];
  const nextGlobalNextStop = stopMap[nextGlobalSchedule?.nextStopId];

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
          const stopSchedules = schedules.filter((schedule) => schedule.stopId === stop.id);
          const text = [
            stop.name,
            stop.area,
            ...stopSchedules.map((schedule) => schedule.time),
          ]
            .join(" ")
            .toLowerCase();
          return text.includes(keyword);
        })
        .map((stop) => stop.id),
    );
  }, [query, schedules, sortedStops]);

  const activeAnnouncements = announcements.filter((announcement) => announcement.status === "active");

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

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="mx-auto grid min-h-[calc(100vh-96px)] w-[min(1180px,calc(100%-32px))] items-center gap-8 py-14 md:grid-cols-[1fr_0.82fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">Sistem Informasi Jadwal Bus UNS</p>
          <h1 className="mt-3 text-6xl font-black leading-none tracking-normal text-slate-950 md:text-8xl">BusUNS</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">
            Demo UI peta rute interaktif untuk satu rute utama BusUNS. Klik titik halte untuk melihat
            jadwal keberangkatan dari halte tersebut.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-black text-white shadow-lg shadow-blue-200" href="#peta">
              Buka peta rute
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a className="inline-flex min-h-11 items-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-700" href="#pengumuman">
              Pengumuman
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-xl shadow-slate-200/70">
          {operationalStatus?.isOperating ? (
            <>
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">Jadwal berikutnya</p>
              <h2 className="mt-2 text-4xl font-black text-slate-950">{nextGlobalStop?.name ?? "-"}</h2>
              <strong className="mt-5 block text-7xl font-black leading-none text-blue-700">{nextGlobalSchedule?.time ?? "--.--"}</strong>
              <p className="mt-4 text-lg font-bold text-slate-600">Halte berikutnya: {nextGlobalNextStop?.name ?? "-"}</p>
            </>
          ) : (
            <>
              <p className="text-sm font-black uppercase tracking-wide text-red-700">Status operasional</p>
              <h2 className="mt-2 text-4xl font-black text-slate-950">Bus tidak beroperasi</h2>
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-lg font-bold leading-7 text-red-900">
                {operationalStatus?.message}
              </p>
            </>
          )}
        </div>
      </section>

      {!operationalStatus?.isOperating ? (
        <section className="mx-auto w-[min(1180px,calc(100%-32px))] pb-6">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-900">
            <strong className="block text-lg">Bus sedang tidak beroperasi.</strong>
            <p className="mt-1 font-semibold">{operationalStatus?.message}</p>
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-[min(1180px,calc(100%-32px))] pb-6">
        <div className="flex min-h-16 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 shadow-sm">
          <Search size={20} className="text-slate-400" aria-hidden="true" />
          <input
            className="w-full border-0 bg-transparent text-base font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            type="search"
            placeholder="Cari halte. Contoh: Teknik, Rektorat, FSRD"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </section>

      <section className="mx-auto grid w-[min(1180px,calc(100%-32px))] gap-5 pb-16 md:grid-cols-[minmax(0,1fr)_360px]">
        <RealLeafletMap
          stops={sortedStops}
          selectedStopId={selectedStop?.id}
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

      {mobilePanelOpen ? (
        <>
          <button
            className={`fixed inset-0 z-[900] bg-slate-950/30 backdrop-blur-sm md:hidden ${
              mobilePanelClosing ? "animate-fade-out" : "animate-fade-in"
            }`}
            type="button"
            aria-label="Tutup panel jadwal"
            onClick={closeMobilePanel}
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
      ) : null}

      <section className="mx-auto w-[min(1180px,calc(100%-32px))] pb-20" id="pengumuman">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">Pengumuman</p>
            <h2 className="mt-1 text-4xl font-black text-slate-950">Info operasional</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {activeAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </section>
    </main>
  );
}
