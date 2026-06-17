import { Megaphone } from "lucide-react";

export default function AnnouncementCard({ announcement, onEdit, onDelete, index = 0 }) {
  const isAdmin = Boolean(onEdit);

  const rawDate = announcement.createdAt || announcement.created_at;
  const formattedDate = rawDate
    ? new Date(rawDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      }) + " WIB"
    : "Baru saja";

  return (
    <article
      className={
        isAdmin
          ? "flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          : "flex gap-4 rounded-2xl p-5 transition-card"
      }
      style={
        isAdmin
          ? { animationDelay: `${index * 80}ms` }
          : {
              animationDelay: `${index * 80}ms`,
              background: "var(--bg-surface-glass)",
              backdropFilter: "blur(16px) saturate(1.4)",
              WebkitBackdropFilter: "blur(16px) saturate(1.4)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--elevation-1)",
            }
      }
    >
      <div
        className={
          isAdmin
            ? "grid size-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-500"
            : "grid size-11 shrink-0 place-items-center rounded-xl"
        }
        style={
          isAdmin
            ? undefined
            : {
                background: "var(--announcement-icon-bg)",
                color: "var(--announcement-icon-color)",
              }
        }
      >
        <Megaphone size={20} aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p
          className={isAdmin ? "text-xs font-black uppercase tracking-wide text-slate-400" : "text-xs font-black uppercase tracking-wide"}
          style={isAdmin ? undefined : { color: "var(--text-tertiary)" }}
        >
          {announcement.createdAt || announcement.created_at}
        </p>
        <h3
          className={isAdmin ? "mt-1 text-lg font-black text-slate-900" : "mt-1 text-lg font-black"}
          style={isAdmin ? undefined : { color: "var(--text-primary)" }}
        >
          {announcement.title}
        </h3>
        <p
          className={isAdmin ? "mt-2 leading-6 text-slate-600" : "mt-2 leading-6"}
          style={isAdmin ? undefined : { color: "var(--text-secondary)" }}
        >
          {announcement.content}
        </p>

        {isAdmin ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-200"
              type="button"
              onClick={() => onEdit(announcement)}
            >
              Edit
            </button>
            <button
              className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-100"
              type="button"
              onClick={() => onDelete(announcement.id)}
            >
              Hapus
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
