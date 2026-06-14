import { Bus, MapPin } from "lucide-react";

export default function InteractiveRouteMap({
  stops,
  selectedStopId,
  matchingStopIds,
  onSelectStop,
}) {
  const points = stops.map((stop) => `${stop.x},${stop.y}`).join(" ");

  return (
    <section className="relative min-h-[540px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70" id="peta">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(148,163,184,0.13)_1px,transparent_1px),linear-gradient(rgba(148,163,184,0.13)_1px,transparent_1px)] bg-[size:34px_34px]" />
      
      {/* KODE PERBAIKAN: Posisi dirubah ke kanan atas (right-5) dan diberi z-index tinggi (z-30) agar berada di atas SVG */}
      <div className="absolute right-5 top-5 z-30 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/90 px-4 py-2 text-sm font-bold text-blue-800 shadow-sm">
        <Bus size={16} aria-hidden="true" />
        Rute Utama BusUNS
      </div>

      {/* Jalur Bus SVG */}
      <svg className="absolute inset-0 size-full z-10" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline
          points={points}
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="1.35"
          strokeDasharray="2.5 2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Titik-titik Halte */}
      {stops.map((stop) => {
        const isSelected = selectedStopId === stop.id;
        const isMatched = matchingStopIds.has(stop.id);

        return (
          <button
            className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 bg-white p-1 shadow-lg transition hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-200 ${
              isSelected ? "border-blue-700" : isMatched ? "border-sky-400" : "border-slate-300 opacity-45"
            }`}
            key={stop.id}
            style={{ left: `${stop.x}%`, top: `${stop.y}%` }}
            type="button"
            onClick={() => onSelectStop(stop.id)}
            aria-label={`Pilih halte ${stop.name}`}
          >
            <span className={`grid size-9 place-items-center rounded-full ${isSelected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600"}`}>
              <MapPin size={18} aria-hidden="true" />
            </span>
            <span className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2 py-1 text-xs font-bold shadow-sm ${
              isSelected ? "bg-blue-700 text-white" : "bg-white text-slate-700"
            }`}>
              {stop.name}
            </span>
          </button>
        );
      })}
    </section>
  );
}