import { Megaphone } from "lucide-react";

export default function AnnouncementCard({ announcement, onEdit, onDelete }) {
  return (
    <article className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-700">
        <Megaphone size={20} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-black uppercase tracking-wide text-slate-400">{announcement.createdAt}</p>
        <h3 className="mt-1 text-lg font-black text-slate-950">{announcement.title}</h3>
        <p className="mt-2 leading-6 text-slate-600">{announcement.content}</p>
        {onEdit ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700" type="button" onClick={() => onEdit(announcement)}>
              Edit
            </button>
            <button className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700" type="button" onClick={() => onDelete(announcement.id)}>
              Hapus
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
