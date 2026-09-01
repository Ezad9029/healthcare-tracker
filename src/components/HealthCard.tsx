interface HealthCheck {
  id: string;
  title: string;
  icon: string;
  date: string;
  progress: number;
  color: string;
}

export default function HealthCard({ check }: { check: HealthCheck }) {
  return (
    <div className="health_card">
      <div
        className="icon_circle"
        style={{ backgroundColor: `${check.color}15` }}
      >
        {check.icon}
      </div>
      <div className="info">
        <div className="title">{check.title}</div>
        <div className="date">
          Date:{" "}
          {new Date(check.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
        <div className="progress_bar">
          <div
            className="fill"
            style={{
              width: `${check.progress}%`,
              backgroundColor: check.color,
            }}
          />
        </div>
      </div>
    </div>
  );
}
