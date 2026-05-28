import { CircleDot, MapPinned } from "lucide-react";

export default function RouteCard({ route, onEdit, onDelete }) {
  return (
    <article className="route-card">
      <div className="route-card-header">
        <div>
          <span className="route-label" style={{ "--route-color": route.color }}>
            <MapPinned size={16} aria-hidden="true" />
            {route.name}
          </span>
          <h3>{route.stops[0]} ke {route.stops[route.stops.length - 1]}</h3>
        </div>
        <span className="status-dot">{route.status === "active" ? "Aktif" : "Nonaktif"}</span>
      </div>
      <ol className="stop-list">
        {route.stops.map((stop) => (
          <li key={stop}>
            <CircleDot size={14} aria-hidden="true" />
            <span>{stop}</span>
          </li>
        ))}
      </ol>
      {onEdit ? (
        <div className="row-actions">
          <button className="small-button" type="button" onClick={() => onEdit(route)}>
            Edit
          </button>
          <button className="small-button danger" type="button" onClick={() => onDelete(route.id)}>
            Hapus
          </button>
        </div>
      ) : null}
    </article>
  );
}
