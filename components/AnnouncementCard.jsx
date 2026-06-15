import { Megaphone } from "lucide-react";

export default function AnnouncementCard({ announcement, onEdit, onDelete, index = 0 }) {
  return (
    <article
      className="flex gap-4 rounded-2xl p-5 transition-card glow-accent-hover animate-stagger-in"
      style={{
        animationDelay: `${index * 80}ms`,
        background: "var(--bg-surface-glass)",
        backdropFilter: "blur(16px) saturate(1.4)",
        WebkitBackdropFilter: "blur(16px) saturate(1.4)",
        border: "1px solid var(--border-default)",
        boxShadow: "var(--card-shadow)",
      }}
    >
      <div
        className="grid size-11 shrink-0 place-items-center rounded-xl"
        style={{
          background: "var(--announcement-icon-bg)",
          color: "var(--announcement-icon-color)",
        }}
      >
        <Megaphone size={20} aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p
          className="text-xs font-black uppercase tracking-wide"
          style={{ color: "var(--text-tertiary)" }}
        >
          {announcement.createdAt || announcement.created_at}
        </p>
        <h3 className="mt-1 text-lg font-black" style={{ color: "var(--text-primary)" }}>
          {announcement.title}
        </h3>
        <p className="mt-2 leading-6" style={{ color: "var(--text-secondary)" }}>
          {announcement.content}
        </p>
        {onEdit ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              className="rounded-lg px-3 py-2 text-sm font-bold transition-all duration-200"
              type="button"
              onClick={() => onEdit(announcement)}
              style={{
                background: "var(--bg-inset)",
                color: "var(--text-secondary)",
              }}
            >
              Edit
            </button>
            <button
              className="rounded-lg px-3 py-2 text-sm font-bold text-red-400 transition-all duration-200"
              type="button"
              onClick={() => onDelete(announcement.id)}
              style={{
                background: "rgba(239, 68, 68, 0.08)",
              }}
            >
              Hapus
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}
