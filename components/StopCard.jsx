import { Bus, MapPin } from "lucide-react";

export default function StopCard({ stop, active, scheduleCount = 0, onSelect, onEdit, onDelete }) {
  return (
    <article className={`rounded-2xl border bg-white p-4 shadow-sm ${active ? "border-blue-500 ring-4 ring-blue-100" : "border-slate-200"}`}>
      <button className="grid w-full grid-cols-[44px_1fr] gap-3 text-left" type="button" onClick={() => onSelect?.(stop.id)}>
        <span className="grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
          <Bus size={20} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <strong className="block text-lg font-black text-slate-950">{stop.name}</strong>
            <span className={`rounded-full px-2 py-1 text-[11px] font-black uppercase ${
              stop.status === "active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}>
              {stop.status === "active" ? "Aktif" : "Nonaktif"}
            </span>
          </span>
          <small className="mt-1 flex items-center gap-1 text-sm font-semibold text-slate-500">
            <MapPin size={14} className="shrink-0" aria-hidden="true" />
            <span>{stop.location_description || "Lokasi belum diatur"}</span>
          </small>
          <small className="mt-1 block text-sm font-semibold text-slate-500">Urutan {stop.stop_order ?? "-"}</small>
          <em className="mt-2 block text-sm font-black not-italic text-blue-700">{scheduleCount} jadwal tersedia</em>
        </span>
      </button>
      {onEdit ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700" type="button" onClick={() => onEdit(stop)}>
            Edit detail
          </button>
          {onDelete ? (
            <button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" type="button" onClick={() => onDelete(stop.id)}>
              Hapus
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
