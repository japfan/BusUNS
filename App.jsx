import { useMemo, useState } from "react";

const routes = [
  {
    id: "A",
    name: "Rute A",
    color: "bg-emerald-500",
    softColor: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    stops: ["Gerbang Depan", "Teknik", "FEB", "FISIP", "Hukum"],
    schedules: ["06.30", "07.00", "16.00"],
  },
  {
    id: "B",
    name: "Rute B",
    color: "bg-sky-500",
    softColor: "bg-sky-50 text-sky-700 ring-sky-100",
    stops: [
      "Gerbang Belakang",
      "Pasca",
      "Kedokteran",
      "Psikologi",
      "MIPA",
      "Pertanian",
      "Rektorat",
    ],
    schedules: ["08.00", "12.30", "15.30"],
  },
  {
    id: "C",
    name: "Rute C",
    color: "bg-amber-500",
    softColor: "bg-amber-50 text-amber-700 ring-amber-100",
    stops: ["Gerbang Samping", "FKIP", "FIB", "FSRD", "Peternakan"],
    schedules: ["09.00", "13.00", "16.30"],
  },
];

function Navbar({ page, isAdminLoggedIn, onNavigate, onLogout }) {
  const menu = [
    { key: "mahasiswa", label: "Mahasiswa" },
    { key: isAdminLoggedIn ? "admin" : "login", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => onNavigate("mahasiswa")}
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            KB
          </span>
          <div>
            <p className="text-lg font-bold text-slate-950">BusUNS</p>
            <p className="text-xs text-slate-500">Jadwal dan rute bus kampus</p>
          </div>
        </button>

        <div className="flex items-center gap-2">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                page === item.key
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              {item.label}
            </button>
          ))}
          {isAdminLoggedIn && (
            <button
              onClick={onLogout}
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 sm:inline-flex"
            >
              Keluar
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

function RouteCard({ route }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full ${route.color}`} />
          <h3 className="text-lg font-bold text-slate-950">{route.name}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${route.softColor}`}
        >
          {route.stops.length} halte
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {route.stops.map((stop, index) => (
          <div key={stop} className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
              {stop}
            </span>
            {index < route.stops.length - 1 && (
              <span className="text-slate-300">-&gt;</span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="text-sm font-semibold text-slate-500">Jadwal</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {route.schedules.map((time) => (
            <span
              key={time}
              className="rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
            >
              {time}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function MahasiswaPage() {
  const totalSchedules = useMemo(
    () => routes.reduce((total, route) => total + route.schedules.length, 0),
    [],
  );

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="grid gap-5 rounded-3xl bg-slate-950 p-6 text-white sm:p-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            Info Mahasiswa
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Cek rute dan jadwal bus kampus dengan cepat.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Pilih rute yang sesuai dengan halte terdekat, lalu lihat jam
            keberangkatan yang tersedia untuk hari ini.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-2xl font-bold">{routes.length}</p>
            <p className="text-xs text-slate-300">Rute</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-2xl font-bold">{totalSchedules}</p>
            <p className="text-xs text-slate-300">Jadwal</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-2xl font-bold">17</p>
            <p className="text-xs text-slate-300">Halte</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-5 lg:grid-cols-3">
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </section>
    </main>
  );
}

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (username.trim() === "admin" && password === "admin123") {
      setError("");
      onLogin();
      return;
    }

    setError("Username atau password belum sesuai.");
  }

  return (
    <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl place-items-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Admin
          </p>
          <h1 className="mt-3 text-2xl font-bold text-slate-950">
            Masuk ke menu admin
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Gunakan akun dummy: admin / admin123
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Username
            </span>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
              placeholder="admin"
              type="text"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Password
            </span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-950 focus:ring-4 focus:ring-slate-100"
              placeholder="admin123"
              type="password"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {error}
            </p>
          )}

          <button className="w-full rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
            Masuk
          </button>
        </form>
      </section>
    </main>
  );
}

function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-600">
            Dashboard Admin
          </p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">
            Kelola data rute dan jadwal
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Tampilan awal untuk memantau data dummy. Form tambah dan edit bisa
            disambungkan nanti saat backend sudah tersedia.
          </p>
        </div>
        <button className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
          Tambah Jadwal
        </button>
      </section>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Rute</th>
                <th className="px-5 py-4">Halte</th>
                <th className="px-5 py-4">Jadwal</th>
                <th className="px-5 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routes.map((route) => (
                <tr key={route.id} className="align-top">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${route.color}`} />
                      <span className="font-bold text-slate-950">
                        {route.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {route.stops.join(" -> ")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      {route.schedules.map((time) => (
                        <span
                          key={time}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 font-semibold text-slate-700"
                        >
                          {time}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                      Aktif
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState("mahasiswa");
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  function handleLogout() {
    setIsAdminLoggedIn(false);
    setPage("mahasiswa");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar
        page={page}
        isAdminLoggedIn={isAdminLoggedIn}
        onNavigate={setPage}
        onLogout={handleLogout}
      />

      {page === "mahasiswa" && <MahasiswaPage />}
      {page === "login" && (
        <LoginPage
          onLogin={() => {
            setIsAdminLoggedIn(true);
            setPage("admin");
          }}
        />
      )}
      {page === "admin" && isAdminLoggedIn && <AdminPage />}
      {page === "admin" && !isAdminLoggedIn && (
        <LoginPage
          onLogin={() => {
            setIsAdminLoggedIn(true);
            setPage("admin");
          }}
        />
      )}
    </div>
  );
}
