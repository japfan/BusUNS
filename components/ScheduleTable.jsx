import { Clock, MapPin } from "lucide-react";

export default function ScheduleTable({ schedules, routeMap, compact = false, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="schedule-table">
        <thead>
          <tr>
            <th>Jam</th>
            <th>Rute</th>
            <th>Berangkat</th>
            <th>Tujuan</th>
            <th>Hari</th>
            <th>Keterangan</th>
            {onEdit ? <th>Aksi</th> : null}
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => {
            const route = routeMap[schedule.routeId];
            return (
              <tr key={schedule.id}>
                <td>
                  <span className="time-cell">
                    <Clock size={16} aria-hidden="true" />
                    {schedule.time}
                  </span>
                </td>
                <td>
                  <span className="route-pill" style={{ "--route-color": route?.color }}>
                    {route?.name ?? "Rute tidak ada"}
                  </span>
                </td>
                <td>{schedule.from}</td>
                <td>
                  <span className="inline-icon">
                    <MapPin size={15} aria-hidden="true" />
                    {schedule.to}
                  </span>
                </td>
                <td>{schedule.days}</td>
                <td>{schedule.note}</td>
                {onEdit ? (
                  <td>
                    <div className="row-actions">
                      <button className="small-button" type="button" onClick={() => onEdit(schedule)}>
                        Edit
                      </button>
                      <button
                        className="small-button danger"
                        type="button"
                        onClick={() => onDelete(schedule.id)}
                      >
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
              <td colSpan={compact ? 6 : 7} className="empty-cell">
                Tidak ada jadwal yang cocok.
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
