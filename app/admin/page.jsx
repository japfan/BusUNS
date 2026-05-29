"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, Bus, Clock, LogIn, MapPin, Megaphone, Plus, Power, Save, Trash2 } from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";
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
  lat: -7.5606,
  lng: 110.8592,
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
  const {
    stops,
    schedules,
    announcements,
    operationalStatus,
    stopMap,
    setStops,
    setSchedules,
    setAnnouncements,
    setOperationalStatus,
  } = useBusData();
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [scheduleForm, setScheduleForm] = useState(blankSchedule);
  const [stopForm, setStopForm] = useState(blankStop);
  const [announcementForm, setAnnouncementForm] = useState(blankAnnouncement);
  const [statusForm, setStatusForm] = useState(operationalStatus);
  const [selectedManageStopId, setSelectedManageStopId] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showStopForm, setShowStopForm] = useState(false);
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

  useEffect(() => {
    setStatusForm(operationalStatus);
  }, [operationalStatus]);

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
    setShowScheduleForm(false);
  }

  function createNewSchedule(stopId = manageStop?.id) {
    setScheduleForm({
      ...blankSchedule,
      stopId: stopId ?? "",
      nextStopId: defaultNextStopId(stopId),
    });
    setShowScheduleForm(true);
  }

  function editSchedule(schedule) {
    setScheduleForm(schedule);
    setSelectedManageStopId(schedule.stopId);
    setShowScheduleForm(true);
  }

  function saveStop(event) {
    event.preventDefault();
    const id = stopForm.id || stopForm.name.toLowerCase().replaceAll(" ", "_");
    const payload = {
      ...stopForm,
      id,
      order: Number(stopForm.order) || sortedStops.length + 1,
      lat: Number(stopForm.lat) || -7.5606,
      lng: Number(stopForm.lng) || 110.8592,
    };
    setStops((items) =>
      items.some((item) => item.id === id)
        ? items.map((item) => (item.id === id ? payload : item))
        : [payload, ...items],
    );
    setStopForm({ ...blankStop, order: sortedStops.length + 2 });
    setShowStopForm(false);
  }

  function editStop(stop) {
    setStopForm(stop);
    setShowStopForm(true);
  }

  function createNewStop() {
    setStopForm({ ...blankStop, order: sortedStops.length + 1 });
    setShowStopForm(true);
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

  function saveOperationalStatus(event) {
    event.preventDefault();
    setOperationalStatus({
      ...statusForm,
      message: statusForm.isOperating
        ? "Bus beroperasi normal sesuai jadwal."
        : statusForm.message,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
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
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-[min(1080px,calc(100%-32px))] flex-wrap items-center justify-between gap-3 py-3">
          <Link className="flex items-center gap-3 font-black text-slate-950" href="/">
            <span className="grid size-10 place-items-center rounded-lg bg-blue-700 text-white"><Bus size={20} /></span>
            BusUNS Admin
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-black text-slate-700" href="/">
              <ArrowLeft size={17} aria-hidden="true" />
              Menu utama
            </Link>
            <button className="rounded-xl bg-slate-900 px-4 py-3 font-black text-white" type="button" onClick={() => setLoggedIn(false)}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-[min(1080px,calc(100%-32px))] py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-blue-700">Dashboard Admin</p>
            <h1 className="mt-1 text-4xl font-black text-slate-950">Kelola Peta dan Jadwal Halte</h1>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Stat icon={<Bus size={18} />} label="Rute Utama" value="1" />
          <Stat icon={<MapPin size={18} />} label="Halte" value={stops.length} />
          <Stat icon={<Save size={18} />} label="Jadwal" value={schedules.length} />
          <Stat icon={<Megaphone size={18} />} label="Pengumuman Aktif" value={activeAnnouncements.length} />
        </div>

        <section className="mt-10" id="operasional">
          <SectionTitle eyebrow="Operasional" title="Status bus hari ini" />
          <form className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={saveOperationalStatus}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">Operasional bus</p>
                <p className="mt-1 font-bold text-slate-950">
                  {statusForm.isOperating ? "Bus sedang beroperasi" : "Bus sedang tidak beroperasi"}
                </p>
              </div>
              <button
                aria-pressed={statusForm.isOperating}
                className={`inline-flex w-full items-center justify-between gap-3 rounded-2xl border p-2 text-left font-black transition md:w-72 ${
                  statusForm.isOperating
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-red-200 bg-red-50 text-red-900"
                }`}
                type="button"
                onClick={() =>
                  setStatusForm((current) => ({
                    ...current,
                    isOperating: !current.isOperating,
                    message: current.isOperating ? "" : "Bus beroperasi normal sesuai jadwal.",
                  }))
                }
              >
                <span className="inline-flex items-center gap-2 px-2">
                  <Power size={18} aria-hidden="true" />
                  {statusForm.isOperating ? "Aktif" : "Nonaktif"}
                </span>
                <span className={`relative h-8 w-14 rounded-full transition ${
                  statusForm.isOperating ? "bg-emerald-600" : "bg-red-500"
                }`}>
                  <span className={`absolute top-1 size-6 rounded-full bg-white shadow transition ${
                    statusForm.isOperating ? "left-7" : "left-1"
                  }`} />
                </span>
              </button>
            </div>

            {!statusForm.isOperating ? (
              <label className="mt-5 block">
                <span className="mb-2 block text-sm font-black uppercase tracking-wide text-slate-500">Keterangan nonaktif</span>
                <textarea
                  className="min-h-24 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
                  value={statusForm.message}
                  onChange={(event) => setStatusForm({ ...statusForm, message: event.target.value })}
                  placeholder="Contoh: Bus tidak beroperasi karena kegiatan kampus."
                  required
                />
              </label>
            ) : null}

            <button className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white" type="submit">
              <AlertTriangle size={17} />
              Simpan status
            </button>
          </form>
          <div className={`mt-3 rounded-xl border px-4 py-3 font-bold ${
            operationalStatus?.isOperating
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}>
            Status aktif: {operationalStatus?.isOperating ? "Bus beroperasi" : "Bus tidak beroperasi"}.
            <span className="ml-1">{operationalStatus?.message}</span>
          </div>
        </section>

        <section className="mt-10" id="jadwal">
          <SectionTitle eyebrow="Jadwal" title="Kelola jadwal berdasarkan halte" />
          <div className={`grid gap-4 ${showScheduleForm ? "lg:grid-cols-[280px_minmax(0,1fr)_360px]" : "lg:grid-cols-[280px_minmax(0,1fr)]"}`}>
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">Pilih halte</p>
              <div className="mt-3 grid gap-2">
                {sortedStops.map((stop) => (
                  <button
                    className={`rounded-xl border px-3 py-3 text-left transition ${
                      manageStop?.id === stop.id
                        ? "border-blue-500 bg-blue-50 text-blue-900"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                    key={stop.id}
                    type="button"
                    onClick={() => {
                      setSelectedManageStopId(stop.id);
                      setScheduleForm({ ...blankSchedule, stopId: stop.id, nextStopId: defaultNextStopId(stop.id) });
                      setShowScheduleForm(false);
                    }}
                  >
                    <span className="block font-black">{stop.name}</span>
                    <span className="mt-1 block text-sm font-semibold text-slate-500">{getScheduleCount(stop.id)} jadwal aktif</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-slate-500">Daftar jadwal</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">{manageStop?.name ?? "Pilih halte"}</h3>
                </div>
                <button className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white" type="button" onClick={() => createNewSchedule()}>
                  <Plus size={17} />
                  Tambah jam
                </button>
              </div>

              <div className="mt-4 grid gap-3">
                {manageSchedules.map((schedule) => {
                  const nextStop = stopMap[schedule.nextStopId];
                  const editing = scheduleForm.id === schedule.id;

                  return (
                    <article className={`rounded-xl border p-4 ${editing ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`} key={schedule.id}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <strong className="inline-flex items-center gap-2 text-3xl font-black text-slate-950">
                            <Clock size={22} aria-hidden="true" />
                            {schedule.time}
                          </strong>
                          <p className="mt-2 font-bold text-slate-600">Menuju {nextStop?.name ?? "halte berikutnya"}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-black text-slate-700" type="button" onClick={() => editSchedule(schedule)}>
                            Edit
                          </button>
                          <button
                            className={`rounded-lg px-3 py-2 text-sm font-black ${
                              schedule.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                            type="button"
                            onClick={() =>
                              setSchedules((items) =>
                                items.map((item) =>
                                  item.id === schedule.id
                                    ? { ...item, status: item.status === "active" ? "inactive" : "active" }
                                    : item,
                                ),
                              )
                            }
                          >
                            {schedule.status === "active" ? "Aktif" : "Nonaktif"}
                          </button>
                          <button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-black text-red-700" type="button" onClick={() => setSchedules((items) => items.filter((item) => item.id !== schedule.id))}>
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
                {!manageSchedules.length ? (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center font-bold text-slate-500">
                    Belum ada jadwal untuk halte ini.
                  </div>
                ) : null}
              </div>
            </div>

            {showScheduleForm ? (
              <form className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={saveSchedule}>
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                {scheduleForm.id ? "Edit jadwal" : "Tambah jadwal"}
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">{scheduleForm.time || "Jam baru"}</h3>

              <label className="mt-5 block font-bold text-slate-600">
                Halte keberangkatan
                <select className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-blue-500" value={scheduleForm.stopId || manageStop?.id || ""} onChange={(event) => setScheduleForm({ ...scheduleForm, stopId: event.target.value, nextStopId: defaultNextStopId(event.target.value) })}>
                  {sortedStops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
                </select>
              </label>
              <label className="mt-4 block font-bold text-slate-600">
                Jam keberangkatan
                <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-2xl font-black text-slate-950 outline-none focus:border-blue-500" value={scheduleForm.time} onChange={(event) => setScheduleForm({ ...scheduleForm, time: event.target.value })} placeholder="06.30" required />
              </label>
              <label className="mt-4 block font-bold text-slate-600">
                Halte berikutnya
                <select className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-blue-500" value={scheduleForm.nextStopId || defaultNextStopId(scheduleForm.stopId || manageStop?.id)} onChange={(event) => setScheduleForm({ ...scheduleForm, nextStopId: event.target.value })}>
                  {sortedStops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
                </select>
              </label>
              <div className="mt-5 flex flex-wrap gap-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white" type="submit"><Save size={17} />Simpan</button>
                <button className="rounded-xl border border-slate-200 px-4 py-3 font-black text-slate-700" type="button" onClick={() => setShowScheduleForm(false)}>
                  Tutup
                </button>
              </div>
              </form>
            ) : null}
          </div>
        </section>

        <section className="mt-10" id="halte">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <SectionTitle eyebrow="Halte" title="Kelola titik halte pada peta" />
            <button className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white" type="button" onClick={createNewStop}>
              <Plus size={17} />
              Tambah halte
            </button>
          </div>
          <div className={`grid gap-4 ${showStopForm ? "lg:grid-cols-[minmax(0,1fr)_390px]" : "lg:grid-cols-1"}`}>
            <div className="grid gap-4 md:grid-cols-2">
              {sortedStops.map((stop) => (
                <StopCard
                  active={stopForm.id === stop.id}
                  key={stop.id}
                  stop={stop}
                  scheduleCount={getScheduleCount(stop.id)}
                  onSelect={() => editStop(stop)}
                  onEdit={editStop}
                  onDelete={(id) => {
                    setStops((items) => items.filter((item) => item.id !== id));
                    setSchedules((items) => items.filter((item) => item.stopId !== id));
                    if (stopForm.id === id) {
                      setStopForm({ ...blankStop, order: sortedStops.length });
                      setShowStopForm(false);
                    }
                  }}
                />
              ))}
            </div>

            {showStopForm ? (
              <form className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={saveStop}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                    {stopForm.id ? "Detail halte" : "Tambah halte"}
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-slate-950">{stopForm.name || "Halte baru"}</h3>
                </div>
                <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-600" type="button" onClick={() => setShowStopForm(false)}>
                  Tutup
                </button>
              </div>

              <label className="block font-bold text-slate-600">
                Nama halte
                <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={stopForm.name} onChange={(event) => setStopForm({ ...stopForm, name: event.target.value })} placeholder="Nama halte" required />
              </label>
              <label className="mt-4 block font-bold text-slate-600">
                Area
                <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" value={stopForm.area} onChange={(event) => setStopForm({ ...stopForm, area: event.target.value })} placeholder="Area sekitar halte" required />
              </label>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <label className="block font-bold text-slate-600">
                  Urutan
                  <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" type="number" min="1" value={stopForm.order} onChange={(event) => setStopForm({ ...stopForm, order: event.target.value })} placeholder="1" />
                </label>
                <label className="block font-bold text-slate-600">
                  Latitude
                  <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" type="number" step="0.000001" value={stopForm.lat} onChange={(event) => setStopForm({ ...stopForm, lat: event.target.value })} placeholder="-7.5606" />
                </label>
                <label className="block font-bold text-slate-600">
                  Longitude
                  <input className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500" type="number" step="0.000001" value={stopForm.lng} onChange={(event) => setStopForm({ ...stopForm, lng: event.target.value })} placeholder="110.8592" />
                </label>
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">Status halte</p>
                <button
                  aria-pressed={stopForm.status === "active"}
                  className={`mt-3 inline-flex w-full items-center justify-between gap-3 rounded-xl p-2 font-black transition ${
                    stopForm.status === "active"
                      ? "bg-emerald-50 text-emerald-900"
                      : "bg-slate-100 text-slate-600"
                  }`}
                  type="button"
                  onClick={() => setStopForm({ ...stopForm, status: stopForm.status === "active" ? "inactive" : "active" })}
                >
                  <span className="px-2">{stopForm.status === "active" ? "Halte aktif di peta" : "Halte disembunyikan dari peta"}</span>
                  <span className={`relative h-7 w-12 rounded-full transition ${stopForm.status === "active" ? "bg-emerald-600" : "bg-slate-400"}`}>
                    <span className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${stopForm.status === "active" ? "left-6" : "left-1"}`} />
                  </span>
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white" type="submit"><Save size={17} />Simpan halte</button>
                {stopForm.id ? (
                  <a className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 font-black text-slate-700" href="#jadwal" onClick={() => setSelectedManageStopId(stopForm.id)}>
                    Kelola jadwal
                  </a>
                ) : null}
              </div>
              </form>
            ) : null}
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
