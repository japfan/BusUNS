import { Clock3, MapPin, Navigation, X } from "lucide-react";

export default function StopSchedulePanel({
  stop,
  nextStop,
  schedules,
  currentTime,
  mobile = false,
  onClose,
  closing = false,
  operationalStatus,
}) {
  if (!stop) {
    // Empty state for desktop panel
    if (!mobile) {
      return (
        <aside
          className="hidden rounded-2xl p-6 md:grid place-items-center"
          style={{
            background: "var(--bg-surface-glass)",
            backdropFilter: "blur(20px) saturate(1.5)",
            WebkitBackdropFilter: "blur(20px) saturate(1.5)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--card-shadow)",
          }}
        >
          <div className="text-center">
            <div
              className="mx-auto mb-4 grid size-14 place-items-center rounded-2xl"
              style={{
                background: "var(--accent-glow)",
                color: "var(--text-accent)",
              }}
            >
              <MapPin size={24} />
            </div>
            <p className="font-bold" style={{ color: "var(--text-tertiary)" }}>
              Klik halte pada peta untuk<br />melihat jadwal keberangkatan
            </p>
          </div>
        </aside>
      );
    }
    return null;
  }

  const now = currentTime ?? new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // ✅ Pakai ":" bukan "."
  function hasSchedulePassed(departure_time) {
    if (!departure_time) return false;
    const [hour, minute] = departure_time.split(":").map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return false;
    return hour * 60 + minute < currentMinutes;
  }

  // Find the next upcoming schedule for glow highlight
  function isNextSchedule(departure_time) {
    if (!departure_time) return false;
    const [hour, minute] = departure_time.split(":").map(Number);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return false;
    const mins = hour * 60 + minute;
    if (mins < currentMinutes) return false;
    // Check if this is the first upcoming one
    const upcomingTimes = schedules
      .map((s) => {
        const [h, m] = (s.departure_time || "").split(":").map(Number);
        return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : Infinity;
      })
      .filter((m) => m >= currentMinutes)
      .sort((a, b) => a - b);
    return upcomingTimes[0] === mins;
  }

  return (
    <aside
      className={
        mobile
          ? `fixed inset-x-0 bottom-0 z-[1000] h-[45vh] overflow-y-auto rounded-t-3xl p-5 md:hidden ${
              closing ? "animate-sheet-out" : "animate-sheet-in"
            }`
          : "hidden rounded-2xl p-6 md:block"
      }
      style={{
        background: "var(--bg-surface-glass)",
        backdropFilter: "blur(24px) saturate(1.6)",
        WebkitBackdropFilter: "blur(24px) saturate(1.6)",
        border: "1px solid var(--border-default)",
        boxShadow: mobile ? "0 -8px 40px rgba(0,0,0,0.15)" : "var(--card-shadow)",
      }}
    >
      {mobile ? (
        <div
          className="mx-auto mb-4 h-1.5 w-14 rounded-full"
          style={{ background: "var(--border-default)" }}
        />
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide" style={{ color: "var(--text-accent)" }}>
            Jadwal halte
          </p>
          <h2 className="mt-2 text-3xl font-black tracking-normal" style={{ color: "var(--text-primary)" }}>
            {stop.name}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--text-tertiary)" }}>
            <MapPin size={16} aria-hidden="true" />
            {stop.location_description ?? "Deskripsi lokasi belum diisi"}
          </p>
        </div>
        {mobile ? (
          <button
            className="rounded-xl p-2 transition-all duration-200"
            type="button"
            onClick={onClose}
            style={{
              border: "1px solid var(--border-default)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--accent-glow)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
            }}
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div
        className="mt-5 rounded-xl p-4"
        style={{
          background: "var(--next-stop-bg)",
          border: "1px solid var(--next-stop-border)",
        }}
      >
        <p className="flex items-center gap-2 text-sm font-bold" style={{ color: "var(--next-stop-text)" }}>
          <Navigation size={17} aria-hidden="true" />
          Halte berikutnya
        </p>
        <strong className="mt-1 block text-xl" style={{ color: "var(--text-primary)" }}>
          {nextStop?.name ?? "Akhir rute"}
        </strong>
      </div>

      <div className="mt-5">
        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide" style={{ color: "var(--text-tertiary)" }}>
          <Clock3 size={16} aria-hidden="true" />
          Jam keberangkatan
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {schedules.map((schedule) => {
            // ✅ Pakai departure_time
            const passed = hasSchedulePassed(schedule.departure_time);
            const isNext = isNextSchedule(schedule.departure_time);

            return (
              <span
                className={`rounded-xl px-3 py-3 text-center text-lg font-black transition-all duration-300 ${
                  isNext ? "animate-time-glow" : ""
                }`}
                key={schedule.id}
                style={
                  passed
                    ? {
                        background: "var(--badge-passed-bg)",
                        color: "var(--badge-passed-text)",
                      }
                    : {
                        background: "var(--badge-upcoming-bg)",
                        color: "var(--badge-upcoming-text)",
                      }
                }
              >
                {/* ✅ Tampilkan HH:MM saja */}
                {schedule.departure_time?.slice(0, 5) ?? "-"}
              </span>
            );
          })}
        </div>
      </div>

    </aside>
  );
}