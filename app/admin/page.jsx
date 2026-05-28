"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bus, LogIn, Megaphone, Route, Save, Trash2 } from "lucide-react";
import AnnouncementCard from "@/components/AnnouncementCard";
import RouteCard from "@/components/RouteCard";
import ScheduleTable from "@/components/ScheduleTable";
import { useBusData } from "@/components/useBusData";

const blankSchedule = {
  id: "",
  routeId: "route_a",
  time: "06.30",
  from: "",
  to: "",
  days: "Senin-Jumat",
  note: "",
  status: "active",
};

const blankRoute = {
  id: "",
  name: "",
  color: "#0f766e",
  stops: "",
  status: "active",
};

const blankAnnouncement = {
  id: "",
  title: "",
  content: "",
  status: "active",
  createdAt: "2026-05-28",
};

export default function AdminPage() {
  const {
    routes,
    schedules,
    announcements,
    routeMap,
    setRoutes,
    setSchedules,
    setAnnouncements,
  } = useBusData();
  const [loggedIn, setLoggedIn] = useState(false);
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [scheduleForm, setScheduleForm] = useState(blankSchedule);
  const [routeForm, setRouteForm] = useState(blankRoute);
  const [announcementForm, setAnnouncementForm] = useState(blankAnnouncement);
  const [error, setError] = useState("");

  const totalStops = useMemo(
    () => routes.reduce((total, route) => total + route.stops.length, 0),
    [routes],
  );

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
    const id = scheduleForm.id || `schedule_${Date.now()}`;
    const payload = { ...scheduleForm, id };
    setSchedules((items) =>
      items.some((item) => item.id === id)
        ? items.map((item) => (item.id === id ? payload : item))
        : [payload, ...items],
    );
    setScheduleForm({ ...blankSchedule, routeId: routes[0]?.id ?? "route_a" });
  }

  function saveRoute(event) {
    event.preventDefault();
    const id = routeForm.id || routeForm.name.toLowerCase().replaceAll(" ", "_") || `route_${Date.now()}`;
    const payload = {
      ...routeForm,
      id,
      stops: routeForm.stops.split(",").map((stop) => stop.trim()).filter(Boolean),
    };
    setRoutes((items) =>
      items.some((item) => item.id === id)
        ? items.map((item) => (item.id === id ? payload : item))
        : [payload, ...items],
    );
    setRouteForm(blankRoute);
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

  if (!loggedIn) {
    return (
      <main className="admin-login-page">
        <Link className="back-link" href="/">
          <ArrowLeft size={18} aria-hidden="true" />
          Kembali ke halaman mahasiswa
        </Link>
        <form className="login-panel" onSubmit={handleLogin}>
          <div className="brand-mark">
            <Bus size={24} aria-hidden="true" />
          </div>
          <h1>Login Admin BusUNS</h1>
          <p>Gunakan akun demo untuk mengelola jadwal, rute, halte, dan pengumuman.</p>
          <label>
            Username
            <input
              value={credentials.username}
              onChange={(event) => setCredentials({ ...credentials, username: event.target.value })}
              placeholder="admin"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials({ ...credentials, password: event.target.value })}
              placeholder="admin123"
            />
          </label>
          {error ? <div className="form-error">{error}</div> : null}
          <button className="primary-button full" type="submit">
            <LogIn size={18} aria-hidden="true" />
            Masuk dashboard
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <aside className="admin-sidebar">
        <Link className="brand" href="/">
          <span className="brand-mark">
            <Bus size={20} aria-hidden="true" />
          </span>
          <span>BusUNS Admin</span>
        </Link>
        <a href="#jadwal">Kelola Jadwal</a>
        <a href="#rute">Kelola Rute</a>
        <a href="#pengumuman">Kelola Pengumuman</a>
        <Link href="/">Halaman Mahasiswa</Link>
      </aside>

      <section className="admin-main">
        <div className="admin-topbar">
          <div>
            <p className="eyebrow">Dashboard Admin</p>
            <h1>Kelola Informasi BusUNS</h1>
          </div>
          <button className="secondary-button" type="button" onClick={() => setLoggedIn(false)}>
            Keluar
          </button>
        </div>

        <div className="stat-grid">
          <Stat icon={<Route size={18} />} label="Rute" value={routes.length} />
          <Stat icon={<Bus size={18} />} label="Halte" value={totalStops} />
          <Stat icon={<Save size={18} />} label="Jadwal" value={schedules.length} />
          <Stat icon={<Megaphone size={18} />} label="Pengumuman" value={announcements.length} />
        </div>

        <section className="admin-section" id="jadwal">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Jadwal</p>
              <h2>Tambah dan edit jadwal</h2>
            </div>
          </div>
          <form className="admin-form" onSubmit={saveSchedule}>
            <select
              value={scheduleForm.routeId}
              onChange={(event) => setScheduleForm({ ...scheduleForm, routeId: event.target.value })}
            >
              {routes.map((route) => (
                <option key={route.id} value={route.id}>{route.name}</option>
              ))}
            </select>
            <input value={scheduleForm.time} onChange={(event) => setScheduleForm({ ...scheduleForm, time: event.target.value })} placeholder="Jam" />
            <input value={scheduleForm.from} onChange={(event) => setScheduleForm({ ...scheduleForm, from: event.target.value })} placeholder="Halte awal" />
            <input value={scheduleForm.to} onChange={(event) => setScheduleForm({ ...scheduleForm, to: event.target.value })} placeholder="Tujuan akhir" />
            <input value={scheduleForm.days} onChange={(event) => setScheduleForm({ ...scheduleForm, days: event.target.value })} placeholder="Hari operasional" />
            <input value={scheduleForm.note} onChange={(event) => setScheduleForm({ ...scheduleForm, note: event.target.value })} placeholder="Keterangan" />
            <button className="primary-button" type="submit"><Save size={17} aria-hidden="true" />Simpan jadwal</button>
            <button className="icon-button" type="button" aria-label="Reset form jadwal" onClick={() => setScheduleForm(blankSchedule)}><Trash2 size={18} /></button>
          </form>
          <ScheduleTable
            schedules={schedules}
            routeMap={routeMap}
            onEdit={(item) => setScheduleForm(item)}
            onDelete={(id) => setSchedules((items) => items.filter((item) => item.id !== id))}
          />
        </section>

        <section className="admin-section" id="rute">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Rute dan Halte</p>
              <h2>Kelola urutan halte</h2>
            </div>
          </div>
          <form className="admin-form route-form" onSubmit={saveRoute}>
            <input value={routeForm.name} onChange={(event) => setRouteForm({ ...routeForm, name: event.target.value })} placeholder="Nama rute" required />
            <input type="color" value={routeForm.color} onChange={(event) => setRouteForm({ ...routeForm, color: event.target.value })} aria-label="Warna rute" />
            <input className="wide-input" value={routeForm.stops} onChange={(event) => setRouteForm({ ...routeForm, stops: event.target.value })} placeholder="Halte, pisahkan dengan koma" required />
            <button className="primary-button" type="submit"><Save size={17} aria-hidden="true" />Simpan rute</button>
          </form>
          <div className="route-grid">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onEdit={(item) => setRouteForm({ ...item, stops: item.stops.join(", ") })}
                onDelete={(id) => setRoutes((items) => items.filter((item) => item.id !== id))}
              />
            ))}
          </div>
        </section>

        <section className="admin-section" id="pengumuman">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Pengumuman</p>
              <h2>Kelola info operasional</h2>
            </div>
          </div>
          <form className="admin-form announcement-form" onSubmit={saveAnnouncement}>
            <input value={announcementForm.title} onChange={(event) => setAnnouncementForm({ ...announcementForm, title: event.target.value })} placeholder="Judul pengumuman" required />
            <input value={announcementForm.createdAt} onChange={(event) => setAnnouncementForm({ ...announcementForm, createdAt: event.target.value })} placeholder="Tanggal" />
            <textarea value={announcementForm.content} onChange={(event) => setAnnouncementForm({ ...announcementForm, content: event.target.value })} placeholder="Isi pengumuman" required />
            <button className="primary-button" type="submit"><Save size={17} aria-hidden="true" />Simpan pengumuman</button>
          </form>
          <div className="announcement-grid">
            {announcements.map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                onEdit={setAnnouncementForm}
                onDelete={(id) => setAnnouncements((items) => items.filter((item) => item.id !== id))}
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
    <div className="stat-card">
      <span>{icon}</span>
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}
