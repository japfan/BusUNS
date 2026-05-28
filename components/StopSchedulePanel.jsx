import { CalendarDays, Clock3, MapPin, Navigation } from "lucide-react";

export default function StopSchedulePanel({ stop, nextStop, schedules, mobile = false, onClose }) {
  if (!stop) return null;

  return (
    <aside
      className={`border border-slate-200 bg-white shadow-xl shadow-slate-200/70 ${
        mobile
          ? "fixed inset-x-0 bottom-0 z-50 max-h-[78vh] overflow-y-auto rounded-t-3xl p-5 md:hidden"
          : "hidden rounded-2xl p-6 md:block"
      }`}
    >
      {mobile ? (
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-300" />
      ) : null}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-blue-700">Jadwal halte</p>
          <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950">{stop.name}</h2>
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-500">
            <MapPin size={16} aria-hidden="true" />
            {stop.area}
          </p>
        </div>
        {mobile ? (
          <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600" type="button" onClick={onClose}>
            Tutup
          </button>
        ) : null}
      </div>

      <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="flex items-center gap-2 text-sm font-bold text-blue-900">
          <Navigation size={17} aria-hidden="true" />
          Halte berikutnya
        </p>
        <strong className="mt-1 block text-xl text-slate-950">{nextStop?.name ?? "Akhir rute"}</strong>
      </div>

      <div className="mt-5">
        <p className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-slate-500">
          <Clock3 size={16} aria-hidden="true" />
          Jam keberangkatan
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {schedules.map((schedule) => (
            <span className="rounded-xl bg-slate-900 px-3 py-3 text-center text-lg font-black text-white" key={schedule.id}>
              {schedule.time}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-500">
            <CalendarDays size={16} aria-hidden="true" />
            Hari operasional
          </p>
          <strong className="mt-1 block text-slate-950">{schedules[0]?.days ?? "-"}</strong>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-500">Keterangan</p>
          <strong className="mt-1 block text-slate-950">{schedules[0]?.note ?? "Belum ada keterangan."}</strong>
        </div>
      </div>
    </aside>
  );
}
