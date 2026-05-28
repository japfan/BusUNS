"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bus, LogIn, MapPin, Megaphone, Save, Trash2 } from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";
import ScheduleTable from "@/components/ScheduleTable";
import StopCard from "@/components/StopCard";
import { useBusData } from "@/components/useBusData";

const blankSchedule = {
  id: "",
  stopId: "",
  nextStopId: "",
  time: "06.30",
  days: "Senin-Jumat",
  note: "",
  status: "active",
};

const blankStop = {
  id: "",
  name: "",
  area: "",
  order: 1,
  x: 50,
  y: 50,
  status: "active",
};

const blankAnnouncement = {
  id: "",
  title: "",
  content: "",
  status: "active",
  createdAt: "2026-05-29",
};

export default function AdminPage() {
  const { stops, schedules, announcements, stopMap, setStops, setSchedules, setAnnouncements } = useBusData();
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [scheduleForm, setScheduleForm] = useState(blankSchedule);
  const [stopForm, setStopForm] = useState(blankStop);
  const [announcementForm, setAnnouncementForm] = useState(blankAnnouncement);
  const [selectedManageStopId, setSelectedManageStopId] = useState("");
  const [error, setError] = useState("");

  const sortedStops = useMemo(
    () => stops.slice().sort((a, b) => Number(a.order) - Number(b.order)),
    [stops],
  );
  const manageStop = stopMap[selectedManageStopId] ?? sortedStops[0];
  const manageSchedules = schedules
    .filter((schedule) => schedule.stopId === manageStop?.id)
    .sort((a, b) => a.time.localeCompare(b.time));
  const activeAnnouncements = announcements.filter((item) => item.status === "active");

  function defaultNextStopId(stopId) {
    const index = sortedStops.findIndex((stop) => stop.id === stopId);
    return sortedStops[index + 1]?.id ?? sortedStops[0]?.id ?? "";
  }

  function handleLogin(event) {
    event.preventDefault();
    if (credentials.username === "admin" && credentials.password === "admin123") {
      setLoggedIn(true);
      setError("");
      return;
    }
    setError("Username atau password salah. Demo: admin / admin123.");
  }

  function saveSchedule(event) {
    event.preventDefault();
    const stopId = scheduleForm.stopId || manageStop?.id || sortedStops[0]?.id || "";
    const id = scheduleForm.id || `schedule_${Date.now()}`;
    const payload = {
      ...scheduleForm,
      id,
      stopId,
      nextStopId: scheduleForm.nextStopId || defaultNextStopId(stopId),
    };
    setSchedules((items) =>
      items.some((item) => item.id === id)
        ? items.map((item) => (item.id === id ? payload : item))
        : [payload, ...items],
    );
    setSelectedManageStopId(stopId);
    setScheduleForm({ ...blankSchedule, stopId, nextStopId: defaultNextStopId(stopId) });
  }

  function saveStop(event) {
    event.preventDefault();
    const id = stopForm.id || stopForm.name.toLowerCase().replaceAll(" ", "_");
    const payload = {
      ...stopForm,
      id,
      order: Number(stopForm.order) || sortedStops.length + 1,
      x: Number(stopForm.x) || 50,
      y: Number(stopForm.y) || 50,
    };
    setStops((items) =>
      items.some((item) => item.id === id)
        ? items.map((item) => (item.id === id ? payload : item))
        : [payload, ...items],
    );
    setStopForm({ ...blankStop, order: sortedStops.length + 2 });
  }

  function saveAnnouncement(event) {
    event.preventDefault();
    const id = announcementForm.id || `announcement_${Date.now()}`;
    const payload = { ...announcementForm, id };
    setAnnouncements((items) =>
      items.some((item) => item.id === id)
        ? items.map((item) => (item.id === id ? payload : item))
        : [payload, ...items],
    );
    setAnnouncementForm(blankAnnouncement);
  }

  function getScheduleCount(stopId) {
    return schedules.filter((schedule) => schedule.status === "active" && schedule.stopId === stopId).length;
  }

  if (!loggedIn) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <Link className="fixed left-5 top-5 inline-flex items-center gap-2 font-bold text-slate-500" href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Kembali
        </Link>
        <form className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl" onSubmit={handleLogin}>
          <div className="grid size-12 place-items-center rounded-xl bg-blue-700 text-white">
            <Bus size={24} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-slate-950">Login Admin BusUNS</h1>
          <p className="mt-2 leading-6 text-slate-600">Kelola halte, jadwal berbasis halte, dan pengumuman operasional.</p>
          <label className="mt-5 block font-bold text-slate-600">
            Username
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} placeholder="admin" />
          </label>
          <label className="mt-4 block font-bold text-slate-600">
            Password
            <input className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} placeholder="admin123" />
          </label>
          {error ? <p className="mt-3 font-bold text-red-700">{error}</p> : null}
          <button className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-black text-white" type="submit">
            <LogIn size={18} aria-hidden="true" />
            Masuk dashboard
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 z-30 flex gap-2 border-b border-slate-200 bg-white p-4 lg:h-screen lg:flex-col lg:border-b-0 lg:border-r">
        <Link className="mb-2 flex items-center gap-3 font-black text-slate-950" href="/">
          <span className="grid size-10 place-items-center rounded-lg bg-blue-700 text-white"><Bus size={20} /></span>
          BusUNS Admin
        </Link>
        <a className="rounded-lg px-3 py-2 font-bold text-slate-600 hover:bg-slate-100" href="#jadwal">Kelola Jadwal</a>
        <a className="rounded-lg px-3 py-2 font-bold text-slate-600 hover:bg-slate-100" href="#halte">Kelola Halte</a>
        <a className="rounded-lg px-3 py-2 font-bold text-slate-600 hover:bg-slate-100" href="#pengumuman">Pengumuman</a>
        <Link className="rounded-lg px-3 py-2 font-bold text-slate-600 hover:bg-slate-100" href="/">Halaman Mahasiswa</Link>
      </aside>

      <section className="mx-auto w-[min(1080px,calc(100%-32px))] py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">Dashboard Admin</p>
            <h1 className="mt-1 text-4xl font-black text-slate-950">Kelola Peta dan Jadwal Halte</h1>
          </div>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-3 font-black text-slate-700" type="button" onClick={() => setLoggedIn(false)}>
            Keluar
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Stat icon={<Bus size={18} />} label="Rute Utama" value="1" />
          <Stat icon={<MapPin size={18} />} label="Halte" value={stops.length} />
          <Stat icon={<Save size={18} />} label="Jadwal" value={schedules.length} />
          <Stat icon={<Megaphone size={18} />} label="Pengumuman Aktif" value={activeAnnouncements.length} />
        </div>

        <section className="mt-10" id="jadwal">
          <SectionTitle eyebrow="Jadwal" title="Kelola jadwal berdasarkan halte" />
          <div className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_auto]">
            <select className="rounded-xl border border-slate-200 px-4 py-3 font-bold outline-none focus:border-blue-500" value={manageStop?.id ?? ""} onChange={(event) => {
              setSelectedManageStopId(event.target.value);
              setScheduleForm({ ...blankSchedule, stopId: event.target.value, nextStopId: defaultNextStopId(event.target.value) });
            }}>
              {sortedStops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
            </select>
            <span className="rounded-xl bg-blue-50 px-4 py-3 font-black text-blue-800">{manageSchedules.length} jadwal</span>
          </div>
          <form className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3 xl:grid-cols-6" onSubmit={saveSchedule}>
            <select className="rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-blue-500" value={scheduleForm.stopId || manageStop?.id || ""} onChange={(event) => setScheduleForm({ ...scheduleForm, stopId: event.target.value, nextStopId: defaultNextStopId(event.target.value) })}>
              {sortedStops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
            </select>
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={scheduleForm.time} onChange={(event) => setScheduleForm({ ...scheduleForm, time: event.target.value })} placeholder="Jam" />
            <select className="rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-blue-500" value={scheduleForm.nextStopId || defaultNextStopId(scheduleForm.stopId || manageStop?.id)} onChange={(event) => setScheduleForm({ ...scheduleForm, nextStopId: event.target.value })}>
              {sortedStops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
            </select>
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={scheduleForm.days} onChange={(event) => setScheduleForm({ ...scheduleForm, days: event.target.value })} placeholder="Hari operasional" />
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={scheduleForm.note} onChange={(event) => setScheduleForm({ ...scheduleForm, note: event.target.value })} placeholder="Keterangan" />
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white" type="submit"><Save size={17} />Simpan</button>
          </form>
          <ScheduleTable schedules={manageSchedules} stopMap={stopMap} onEdit={setScheduleForm} onDelete={(id) => setSchedules((items) => items.filter((item) => item.id !== id))} />
        </section>

        <section className="mt-10" id="halte">
          <SectionTitle eyebrow="Halte" title="Kelola titik halte pada peta" />
          <form className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-3 xl:grid-cols-6" onSubmit={saveStop}>
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={stopForm.name} onChange={(event) => setStopForm({ ...stopForm, name: event.target.value })} placeholder="Nama halte" required />
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={stopForm.area} onChange={(event) => setStopForm({ ...stopForm, area: event.target.value })} placeholder="Area" required />
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" type="number" min="1" value={stopForm.order} onChange={(event) => setStopForm({ ...stopForm, order: event.target.value })} placeholder="Urutan" />
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" type="number" min="0" max="100" value={stopForm.x} onChange={(event) => setStopForm({ ...stopForm, x: event.target.value })} placeholder="Posisi X" />
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" type="number" min="0" max="100" value={stopForm.y} onChange={(event) => setStopForm({ ...stopForm, y: event.target.value })} placeholder="Posisi Y" />
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white" type="submit"><Save size={17} />Simpan</button>
          </form>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedStops.map((stop) => (
              <StopCard key={stop.id} stop={stop} scheduleCount={getScheduleCount(stop.id)} onEdit={setStopForm} onDelete={(id) => {
                setStops((items) => items.filter((item) => item.id !== id));
                setSchedules((items) => items.filter((item) => item.stopId !== id));
              }} />
            ))}
          </div>
        </section>

        <section className="mt-10" id="pengumuman">
          <SectionTitle eyebrow="Pengumuman" title="Kelola info operasional" />
          <form className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_160px_2fr_auto]" onSubmit={saveAnnouncement}>
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={announcementForm.title} onChange={(event) => setAnnouncementForm({ ...announcementForm, title: event.target.value })} placeholder="Judul" required />
            <input className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={announcementForm.createdAt} onChange={(event) => setAnnouncementForm({ ...announcementForm, createdAt: event.target.value })} placeholder="Tanggal" />
            <textarea className="min-h-12 rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={announcementForm.content} onChange={(event) => setAnnouncementForm({ ...announcementForm, content: event.target.value })} placeholder="Isi pengumuman" required />
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white" type="submit"><Save size={17} />Simpan</button>
          </form>
          <div className="grid gap-4 md:grid-cols-2">
            {announcements.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} onEdit={setAnnouncementForm} onDelete={(id) => setAnnouncements((items) => items.filter((item) => item.id !== id))} />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700">{icon}</span>
      <p className="mt-3 text-sm font-bold text-slate-500">{label}</p>
      <strong className="mt-1 block text-3xl font-black text-slate-950">{value}</strong>
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="mb-4">
      <p className="text-sm font-black uppercase tracking-wide text-blue-700">{eyebrow}</p>
      <h2 className="mt-1 text-3xl font-black text-slate-950">{title}</h2>
    </div>
  );
}
