"use client";

import { useMemo } from "react";

interface Appointment {
  id: string;
  appointmentName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  status: string;
}

interface ActivityChartProps {
  appointmentCount: number;
  appointments: Appointment[];
}

const colors = ["#00CFE8", "#7367F0", "#A8AAAE"];

export default function ActivityChart({ appointmentCount, appointments }: ActivityChartProps) {
  const activityData = useMemo(() => {
    const days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const dayData: Record<string, { scheduled: number; completed: number; cancelled: number }> = {};

    days.forEach((day) => {
      dayData[day] = { scheduled: 0, completed: 0, cancelled: 0 };
    });

    appointments.forEach((app) => {
      const appDate = new Date(app.appointmentDate);
      if (appDate >= startOfWeek) {
        const dayName = days[appDate.getDay()];
        if (dayData[dayName]) {
          if (app.status === "completed") {
            dayData[dayName].completed += 1;
          } else if (app.status === "cancelled") {
            dayData[dayName].cancelled += 1;
          } else {
            dayData[dayName].scheduled += 1;
          }
        }
      }
    });

    return Object.entries(dayData).map(([day, data]) => ({
      day,
      bars: [data.scheduled, data.completed, data.cancelled],
    }));
  }, [appointments]);

  const maxBarHeight = 60;

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
        {activityData.map(({ day, bars }) => {
          const maxVal = Math.max(...bars, 1);
          return (
            <div className="activity_day" key={day}>
              <div className="bars">
                {bars.map((count, i) => (
                  <div
                    key={i}
                    className="bar"
                    style={{
                      height: `${(count / maxVal) * maxBarHeight}px`,
                      backgroundColor: colors[i % colors.length],
                      minHeight: count > 0 ? "4px" : "2px",
                      opacity: count > 0 ? 1 : 0.3,
                    }}
                    title={`${["Scheduled", "Completed", "Cancelled"][i]}: ${count}`}
                  />
                ))}
              </div>
              <span className="day_label">{day}</span>
            </div>
          );
        })}
      </div>
      <div className="activity_legend">
        <span><span className="legend_dot" style={{ backgroundColor: colors[0] }} /> Scheduled</span>
        <span><span className="legend_dot" style={{ backgroundColor: colors[1] }} /> Completed</span>
        <span><span className="legend_dot" style={{ backgroundColor: colors[2] }} /> Cancelled</span>
      </div>
    </div>
  );
}
