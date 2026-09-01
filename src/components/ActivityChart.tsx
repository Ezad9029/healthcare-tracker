"use client";

interface ActivityChartProps {
  appointmentCount: number;
}

const activityData = {
  Mon: [50, 30],
  Tues: [40, 25, 15],
  Wed: [35, 20],
  Thurs: [45, 25],
  Fri: [50, 40, 30],
  Sat: [40, 25],
  Sun: [35, 20],
};

const colors = ["#00CFE8", "#7367F0", "#A8AAAE"];

export default function ActivityChart({ appointmentCount }: ActivityChartProps) {
  return (
    <div className="activity_card">
      <div className="activity_header">
        <h2>Activity</h2>
        <span className="count">
          {appointmentCount} appointment{appointmentCount !== 1 ? "s" : ""} this
          week
        </span>
      </div>
      <div className="activity_bars">
        {Object.entries(activityData).map(([day, bars]) => (
          <div className="activity_day" key={day}>
            <div className="bars">
              {bars.map((height, i) => (
                <div
                  key={i}
                  className="bar"
                  style={{
                    height: `${height}px`,
                    backgroundColor: colors[i % colors.length],
                  }}
                />
              ))}
            </div>
            <span className="day_label">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
