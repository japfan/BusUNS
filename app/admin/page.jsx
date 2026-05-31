"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, ArrowLeft, Bus, Clock, LogIn, MapPin,
  Megaphone, Plus, Save, Trash2,
} from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";
import StopCard from "@/components/StopCard";
import { supabase } from "@/lib/supabaseClient";
import { useBusData } from "@/components/useBusData";

const blankSchedule = {
  stop_id: "",
  departure_time: "06:30",
  days: "Senin-Jumat",
  note: "",
  status: "active",
};

const blankStop = {
  id: "",
  name: "",
  area: "",
  stop_order: 1,
  lat: -7.5606,
  lng: 110.8592,
  next_stop_id: null,
  status: "active",
};

const blankAnnouncement = {
  title: "",
  content: "",
  status: "active",
};

export default function AdminPage() {
  const { stops, schedules, announcements, operationalStatus, stopMap, loading } = useBusData();

  // ─── AUTH STATE ───────────────────────────────────────────────────
  const [authLoading, setAuthLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Cek session yang sudah ada saat halaman pertama dibuka
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
      setAuthLoading(false);
    });

    // Listen perubahan auth (login/logout dari tab lain, token expired, dll)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    setLoginLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) {
      setError("Login gagal: " + error.message);
    }
    // setLoggedIn ditangani oleh onAuthStateChange di atas

    setLoginLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    // setLoggedIn(false) ditangani oleh onAuthStateChange
  }

  // ─── LOCAL STATE ──────────────────────────────────────────────────
  const [localStops, setLocalStops] = useState([]);
  const [localSchedules, setLocalSchedules] = useState([]);
  const [localAnnouncements, setLocalAnnouncements] = useState([]);

  const [scheduleForm, setScheduleForm] = useState(blankSchedule);
  const [stopForm, setStopForm] = useState(blankStop);
  const [announcementForm, setAnnouncementForm] = useState(blankAnnouncement);
  const [selectedManageStopId, setSelectedManageStopId] = useState("");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showStopForm, setShowStopForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { setLocalStops(stops); }, [stops]);
  useEffect(() => { setLocalSchedules(schedules); }, [schedules]);
  useEffect(() => { setLocalAnnouncements(announcements); }, [announcements]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const sortedStops = useMemo(
    () => localStops.slice().sort((a, b) => Number(a.stop_order) - Number(b.stop_order)),
    [localStops],
  );
  const localStopMap = useMemo(
    () => Object.fromEntries(localStops.map((s) => [s.id, s])),
    [localStops],
  );
  const manageStop = localStopMap[selectedManageStopId] ?? sortedStops[0];
  const manageSchedules = localSchedules
    .filter((s) => s.stop_id === manageStop?.id)
    .sort((a, b) => a.departure_time.localeCompare(b.departure_time));
  const activeAnnouncements = localAnnouncements.filter((a) => a.status === "active");

  function getScheduleCount(stopId) {
    return localSchedules.filter((s) => s.status === "active" && s.stop_id === stopId).length;
  }

  // ─── SCHEDULE CRUD ───────────────────────────────────────────────
  async function saveSchedule(event) {
    event.preventDefault();
    setSaving(true);
    const stopId = scheduleForm.stop_id || manageStop?.id || "";
    const payload = {
      stop_id: stopId,
      departure_time: scheduleForm.departure_time.length === 5
        ? scheduleForm.departure_time + ":00"
        : scheduleForm.departure_time,
      days: scheduleForm.days || "Senin-Jumat",
      note: scheduleForm.note || null,
      status: scheduleForm.status,
    };

    if (scheduleForm.id) {
      const { error } = await supabase.from("schedules").update(payload).eq("id", scheduleForm.id);
      if (error) showToast("Gagal update jadwal: " + error.message);
      else {
        setLocalSchedules((items) => items.map((item) => item.id === scheduleForm.id ? { ...item, ...payload } : item));
        showToast("Jadwal berhasil diupdate!");
      }
    } else {
      const { data, error } = await supabase.from("schedules").insert(payload).select().single();
      if (error) showToast("Gagal tambah jadwal: " + error.message);
      else {
        setLocalSchedules((items) => [data, ...items]);
        showToast("Jadwal berhasil ditambahkan!");
      }
    }

    setScheduleForm({ ...blankSchedule, stop_id: stopId });
    setShowScheduleForm(false);
    setSaving(false);
  }

  async function deleteSchedule(id) {
    const { error } = await supabase.from("schedules").delete().eq("id", id);
    if (error) showToast("Gagal hapus jadwal: " + error.message);
    else {
      setLocalSchedules((items) => items.filter((item) => item.id !== id));
      showToast("Jadwal dihapus.");
    }
  }

  async function toggleScheduleStatus(schedule) {
    const newStatus = schedule.status === "active" ? "inactive" : "active";
    const { error } = await supabase.from("schedules").update({ status: newStatus }).eq("id", schedule.id);
    if (error) showToast("Gagal update status: " + error.message);
    else {
      setLocalSchedules((items) => items.map((item) => item.id === schedule.id ? { ...item, status: newStatus } : item));
    }
  }

  // ─── STOP CRUD ───────────────────────────────────────────────────
  async function saveStop(event) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      name: stopForm.name,
      stop_order: Number(stopForm.stop_order) || sortedStops.length + 1,
      lat: Number(stopForm.lat) || -7.5606,
      lng: Number(stopForm.lng) || 110.8592,
      next_stop_id: stopForm.next_stop_id || null,
      status: stopForm.status,
    };

    if (stopForm.id) {
      const { error } = await supabase.from("stops").update(payload).eq("id", stopForm.id);
      if (error) showToast("Gagal update halte: " + error.message);
      else {
        setLocalStops((items) => items.map((item) => item.id === stopForm.id ? { ...item, ...payload } : item));
        showToast("Halte berhasil diupdate!");
      }
    } else {
      const newId = "halte_" + stopForm.name.toLowerCase().replaceAll(" ", "_");
      const { data, error } = await supabase.from("stops").insert({ id: newId, ...payload }).select().single();
      if (error) showToast("Gagal tambah halte: " + error.message);
      else {
        setLocalStops((items) => [data, ...items]);
        showToast("Halte berhasil ditambahkan!");
      }
    }

    setStopForm({ ...blankStop, stop_order: sortedStops.length + 2 });
    setShowStopForm(false);
    setSaving(false);
  }

  async function deleteStop(id) {
    const { error } = await supabase.from("stops").delete().eq("id", id);
    if (error) showToast("Gagal hapus halte: " + error.message);
    else {
      setLocalStops((items) => items.filter((item) => item.id !== id));
      setLocalSchedules((items) => items.filter((item) => item.stop_id !== id));
      showToast("Halte dihapus.");
    }
  }

  // ─── ANNOUNCEMENT CRUD ───────────────────────────────────────────
  async function saveAnnouncement(event) {
    event.preventDefault();
    setSaving(true);
    const payload = {
      title: announcementForm.title,
      content: announcementForm.content,
      status: announcementForm.status,
    };

    if (announcementForm.id) {
      const { error } = await supabase.from("announcements").update(payload).eq("id", announcementForm.id);
      if (error) showToast("Gagal update pengumuman: " + error.message);
      else {
        setLocalAnnouncements((items) => items.map((item) => item.id === announcementForm.id ? { ...item, ...payload } : item));
        showToast("Pengumuman diupdate!");
      }
    } else {
      const { data, error } = await supabase.from("announcements").insert(payload).select().single();
      if (error) showToast("Gagal tambah pengumuman: " + error.message);
      else {
        setLocalAnnouncements((items) => [data, ...items]);
        showToast("Pengumuman ditambahkan!");
      }
    }

    setAnnouncementForm(blankAnnouncement);
    setSaving(false);
  }

  async function deleteAnnouncement(id) {
    const { error } = await supabase.from("announcements").delete().eq("id", id);
    if (error) showToast("Gagal hapus pengumuman: " + error.message);
    else {
      setLocalAnnouncements((items) => items.filter((item) => item.id !== id));
      showToast("Pengumuman dihapus.");
    }
  }

  // ─── LOADING AUTH ─────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 font-semibold text-slate-500">
        Memeriksa sesi...
      </div>
    );
  }

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────
  if (!loggedIn) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 p-6">
        <Link
          className="fixed left-5 top-5 inline-flex items-center gap-2 font-bold text-slate-500 hover:text-slate-800 transition-colors"
          href="/"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          Kembali
        </Link>

        <form
          className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
          onSubmit={handleLogin}
        >
          <div className="grid size-12 place-items-center rounded-xl bg-blue-700 text-white">
            <Bus size={24} aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-3xl font-black text-slate-950">Login Admin BusUNS</h1>
          <p className="mt-2 leading-6 text-slate-500">
            Masuk menggunakan email yang terdaftar di sistem.
          </p>

          <label className="mt-6 block font-bold text-slate-600">
            Email
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 transition-colors"
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="admin@busuns.com"
              required
              autoComplete="email"
            />
          </label>

          <label className="mt-4 block font-bold text-slate-600">
            Password
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 transition-colors"
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </label>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-red-700">{error}</p>
            </div>
          )}

          <button
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-black text-white hover:bg-blue-800 transition-colors disabled:opacity-60"
            type="submit"
            disabled={loginLoading}
          >
            <LogIn size={18} aria-hidden="true" />
            {loginLoading ? "Masuk..." : "Masuk dashboard"}
          </button>
        </form>
      </main>
    );
  }

  // ─── LOADING DATA ─────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 font-semibold text-slate-600">
        Memuat data dari database...
      </div>
    );
  }

  // ─── MAIN ADMIN ───────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-slate-50">
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white shadow-xl">
          {toast}
        </div>
      )}

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-16 w-[min(1080px,calc(100%-32px))] flex-wrap items-center justify-between gap-3 py-3">
          <Link className="flex items-center gap-3 font-black text-slate-950" href="/">
            <span className="grid size-10 place-items-center rounded-lg bg-blue-700 text-white">
              <Bus size={20} />
            </span>
            BusUNS Admin
          </Link>
          <div className="flex flex-wrap gap-2">
            <Link
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 hover:bg-slate-50 transition-colors"
              href="/"
            >
              <ArrowLeft size={17} aria-hidden="true" />
              Menu utama
            </Link>
            <button
              className="rounded-xl bg-slate-900 px-4 py-3 font-black text-white hover:bg-slate-700 transition-colors"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto w-[min(1080px,calc(100%-32px))] py-8">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-blue-700">Dashboard Admin</p>
          <h1 className="mt-1 text-4xl font-black text-slate-950">Kelola Peta dan Jadwal Halte</h1>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Stat icon={<MapPin size={18} />} label="Halte" value={localStops.length} />
          <Stat icon={<Clock size={18} />} label="Jadwal" value={localSchedules.length} />
          <Stat icon={<Megaphone size={18} />} label="Pengumuman Aktif" value={activeAnnouncements.length} />
        </div>

        {/* ── JADWAL ── */}
        <section className="mt-10" id="jadwal">
          <SectionTitle eyebrow="Jadwal" title="Kelola jadwal berdasarkan halte" />
          <div className={`grid gap-4 ${showScheduleForm ? "lg:grid-cols-[260px_minmax(0,1fr)_340px]" : "lg:grid-cols-[260px_minmax(0,1fr)]"}`}>
            <div className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-black uppercase tracking-wide text-slate-500">Pilih halte</p>
              <div className="mt-3 grid gap-2">
                {sortedStops.map((stop) => (
                  <button
                    className={`rounded-xl border px-3 py-3 text-left transition ${manageStop?.id === stop.id ? "border-blue-500 bg-blue-50 text-blue-900" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
                    key={stop.id}
                    type="button"
                    onClick={() => {
                      setSelectedManageStopId(stop.id);
                      setScheduleForm({ ...blankSchedule, stop_id: stop.id });
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
                <button
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white hover:bg-blue-800 transition-colors"
                  type="button"
                  onClick={() => {
                    setScheduleForm({ ...blankSchedule, stop_id: manageStop?.id ?? "" });
                    setShowScheduleForm(true);
                  }}
                >
                  <Plus size={17} />Tambah jam
                </button>
              </div>
              <div className="mt-4 grid gap-3">
                {manageSchedules.map((schedule) => {
                  const nextStop = localStopMap[manageStop?.next_stop_id];
                  const editing = scheduleForm.id === schedule.id;
                  return (
                    <article
                      className={`rounded-xl border p-4 ${editing ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"}`}
                      key={schedule.id}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <strong className="inline-flex items-center gap-2 text-3xl font-black text-slate-950">
                            <Clock size={22} aria-hidden="true" />
                            {schedule.departure_time?.slice(0, 5)}
                          </strong>
                          <p className="mt-2 font-bold text-slate-600">Menuju {nextStop?.name ?? "halte berikutnya"}</p>
                          {schedule.note && <p className="mt-1 text-sm text-slate-500">{schedule.note}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-black text-slate-700 hover:bg-slate-200 transition-colors"
                            type="button"
                            onClick={() => { setScheduleForm({ ...schedule, departure_time: schedule.departure_time?.slice(0, 5) }); setShowScheduleForm(true); }}
                          >
                            Edit
                          </button>
                          <button
                            className={`rounded-lg px-3 py-2 text-sm font-black transition-colors ${schedule.status === "active" ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                            type="button"
                            onClick={() => toggleScheduleStatus(schedule)}
                          >
                            {schedule.status === "active" ? "Aktif" : "Nonaktif"}
                          </button>
                          <button
                            className="rounded-lg bg-red-50 px-3 py-2 text-sm font-black text-red-700 hover:bg-red-100 transition-colors"
                            type="button"
                            onClick={() => deleteSchedule(schedule.id)}
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
                {!manageSchedules.length && (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center font-bold text-slate-500">
                    Belum ada jadwal untuk halte ini.
                  </div>
                )}
              </div>
            </div>

            {showScheduleForm && (
              <form className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={saveSchedule}>
                <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                  {scheduleForm.id ? "Edit jadwal" : "Tambah jadwal"}
                </p>
                <h3 className="mt-1 text-2xl font-black text-slate-950">{scheduleForm.departure_time || "Jam baru"}</h3>
                <label className="mt-5 block font-bold text-slate-600">
                  Halte keberangkatan
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-blue-500"
                    value={scheduleForm.stop_id || manageStop?.id || ""}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, stop_id: e.target.value })}
                  >
                    {sortedStops.map((stop) => <option key={stop.id} value={stop.id}>{stop.name}</option>)}
                  </select>
                </label>
                <label className="mt-4 block font-bold text-slate-600">
                  Jam keberangkatan
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-2xl font-black text-slate-950 outline-none focus:border-blue-500"
                    type="time"
                    value={scheduleForm.departure_time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, departure_time: e.target.value })}
                    required
                  />
                </label>
                <label className="mt-4 block font-bold text-slate-600">
                  Catatan (opsional)
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
                    value={scheduleForm.note || ""}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, note: e.target.value })}
                    placeholder="Jadwal pagi, reguler, dll."
                  />
                </label>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white hover:bg-blue-800 transition-colors disabled:opacity-60"
                    type="submit"
                    disabled={saving}
                  >
                    <Save size={17} />{saving ? "Menyimpan..." : "Simpan"}
                  </button>
                  <button
                    className="rounded-xl border border-slate-200 px-4 py-3 font-black text-slate-700 hover:bg-slate-50 transition-colors"
                    type="button"
                    onClick={() => setShowScheduleForm(false)}
                  >
                    Tutup
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ── HALTE ── */}
        <section className="mt-10" id="halte">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <SectionTitle eyebrow="Halte" title="Kelola titik halte pada peta" />
            <button
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white hover:bg-blue-800 transition-colors"
              type="button"
              onClick={() => { setStopForm({ ...blankStop, stop_order: sortedStops.length + 1 }); setShowStopForm(true); }}
            >
              <Plus size={17} />Tambah halte
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
                  onSelect={() => { setStopForm(stop); setShowStopForm(true); }}
                  onEdit={(s) => { setStopForm(s); setShowStopForm(true); }}
                  onDelete={deleteStop}
                />
              ))}
            </div>

            {showStopForm && (
              <form className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" onSubmit={saveStop}>
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black uppercase tracking-wide text-slate-500">
                      {stopForm.id ? "Edit halte" : "Tambah halte"}
                    </p>
                    <h3 className="mt-1 text-2xl font-black text-slate-950">{stopForm.name || "Halte baru"}</h3>
                  </div>
                  <button
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors"
                    type="button"
                    onClick={() => setShowStopForm(false)}
                  >
                    Tutup
                  </button>
                </div>
                <label className="block font-bold text-slate-600">
                  Nama halte
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
                    value={stopForm.name}
                    onChange={(e) => setStopForm({ ...stopForm, name: e.target.value })}
                    placeholder="Nama halte"
                    required
                  />
                </label>
                <label className="mt-4 block font-bold text-slate-600">
                  Urutan
                  <input
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
                    type="number"
                    min="1"
                    value={stopForm.stop_order}
                    onChange={(e) => setStopForm({ ...stopForm, stop_order: e.target.value })}
                  />
                </label>
                <label className="mt-4 block font-bold text-slate-600">
                  Halte berikutnya
                  <select
                    className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-semibold outline-none focus:border-blue-500"
                    value={stopForm.next_stop_id || ""}
                    onChange={(e) => setStopForm({ ...stopForm, next_stop_id: e.target.value || null })}
                  >
                    <option value="">-- Pilih halte berikutnya --</option>
                    {sortedStops.filter((s) => s.id !== stopForm.id).map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </label>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="block font-bold text-slate-600">
                    Latitude
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
                      type="number"
                      step="0.000001"
                      value={stopForm.lat}
                      onChange={(e) => setStopForm({ ...stopForm, lat: e.target.value })}
                      placeholder="-7.5606"
                    />
                  </label>
                  <label className="block font-bold text-slate-600">
                    Longitude
                    <input
                      className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
                      type="number"
                      step="0.000001"
                      value={stopForm.lng}
                      onChange={(e) => setStopForm({ ...stopForm, lng: e.target.value })}
                      placeholder="110.8592"
                    />
                  </label>
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white hover:bg-blue-800 transition-colors disabled:opacity-60"
                    type="submit"
                    disabled={saving}
                  >
                    <Save size={17} />{saving ? "Menyimpan..." : "Simpan halte"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* ── PENGUMUMAN ── */}
        <section className="mt-10" id="pengumuman">
          <SectionTitle eyebrow="Pengumuman" title="Kelola info operasional" />
          <form
            className="mb-4 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-[1fr_2fr_auto]"
            onSubmit={saveAnnouncement}
          >
            <input
              className="rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
              value={announcementForm.title}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
              placeholder="Judul"
              required
            />
            <textarea
              className="min-h-12 rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
              value={announcementForm.content}
              onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
              placeholder="Isi pengumuman"
              required
            />
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 font-black text-white hover:bg-blue-800 transition-colors disabled:opacity-60"
              type="submit"
              disabled={saving}
            >
              <Save size={17} />{saving ? "..." : "Simpan"}
            </button>
          </form>
          <div className="grid gap-4 md:grid-cols-2">
            {localAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={(a) => setAnnouncementForm(a)}
                onDelete={deleteAnnouncement}
              />
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