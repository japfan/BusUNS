import { Clock, MapPin } from "lucide-react";

export default function ScheduleTable({ schedules, stopMap, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="bg-slate-50 text-sm text-slate-500">
            <th className="px-4 py-3">Jam</th>
            <th className="px-4 py-3">Halte</th>
            <th className="px-4 py-3">Halte Berikutnya</th>
            <th className="px-4 py-3">Hari</th>
            <th className="px-4 py-3">Keterangan</th>
            {onEdit ? <th className="px-4 py-3">Aksi</th> : null}
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => {
            const stop = stopMap[schedule.stopId];
            const nextStop = stopMap[schedule.nextStopId];
            return (
              <tr className="border-t border-slate-200" key={schedule.id}>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 font-black text-slate-950">
                    <Clock size={16} aria-hidden="true" />
                    {schedule.time}
                  </span>
                </td>
                <td className="px-4 py-4 font-bold text-slate-700">{stop?.name ?? "Halte tidak ada"}</td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 text-slate-600">
                    <MapPin size={15} aria-hidden="true" />
                    {nextStop?.name ?? "Akhir rute"}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-600">{schedule.days}</td>
                <td className="px-4 py-4 text-slate-600">{schedule.note}</td>
                {onEdit ? (
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700" type="button" onClick={() => onEdit(schedule)}>
                        Edit
                      </button>
                      <button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" type="button" onClick={() => onDelete(schedule.id)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                ) : null}
              </tr>
            );
          })}
          {!schedules.length ? (
            <tr>
              <td colSpan={onEdit ? 6 : 5} className="px-4 py-8 text-center font-semibold text-slate-500">
                Tidak ada jadwal yang cocok.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
