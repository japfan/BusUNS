import { Megaphone } from "lucide-react";

export default function AnnouncementCard({ announcement, onEdit, onDelete }) {
  return (
    <article className="announcement-card">
      <div className="announcement-icon">
        <Megaphone size={18} aria-hidden="true" />
      </div>
      <div>
        <div className="muted-small">{announcement.createdAt}</div>
        <h3>{announcement.title}</h3>
        <p>{announcement.content}</p>
        {onEdit ? (
          <div className="row-actions">
            <button className="small-button" type="button" onClick={() => onEdit(announcement)}>
              Edit
            </button>
            <button
              className="small-button danger"
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
