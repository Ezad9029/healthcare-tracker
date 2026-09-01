"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import AppointmentModal from "./AppointmentModal";

interface Appointment {
  id: string;
  appointmentName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  status: string;
}

interface ScheduleCalendarProps {
  appointments: Appointment[];
  onRefresh: () => void;
}

const getIcon = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("dentist")) return "🦷";
  if (lower.includes("physio")) return "💪";
  if (lower.includes("eye") || lower.includes("opthalm")) return "👁️";
  if (lower.includes("cardio")) return "❤️";
  if (lower.includes("neuro")) return "🧠";
  return "📅";
};

const getIconBg = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes("dentist")) return "#dbeafe";
  if (lower.includes("physio")) return "#dcfce7";
  if (lower.includes("eye") || lower.includes("opthalm")) return "#fef3c7";
  if (lower.includes("cardio")) return "#fee2e2";
  if (lower.includes("neuro")) return "#ede9fe";
  return "#f1f5f9";
};

export default function ScheduleCalendar({
  appointments,
  onRefresh,
}: ScheduleCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getNext7Days = () => {
    const today = new Date();
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
  };

  const isSameDate = (a: Date, b: Date) =>
    a.toDateString() === b.toDateString();

  const handleComplete = async (id: string) => {
    try {
      await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      onRefresh();
    } catch (err) {
      console.error("Failed to complete appointment:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) return;
    try {
      await fetch(`/api/appointments/${id}`, { method: "DELETE" });
      onRefresh();
    } catch (err) {
      console.error("Failed to delete appointment:", err);
    }
  };

  const selectedDayAppointments = appointments.filter(
    (app) =>
      new Date(app.appointmentDate).toDateString() ===
      selectedDate.toDateString()
  );

  const upcomingAppointments = appointments.filter((app) => {
    const appDate = new Date(app.appointmentDate);
    const diff = (appDate.getTime() - selectedDate.getTime()) / 86400000;
    return diff > 0 && diff <= 3;
  });

  const weekDates = getNext7Days();
  const monthLabel = selectedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div
        className={`calendar_panel ${isOpen ? "open" : ""}`}
        style={{ marginBottom: isOpen ? 0 : 0 }}
      >
        <div className="calendar_handle" onClick={() => setIsOpen(!isOpen)}>
          <FaChevronDown className="chevron" />
          Calendar
        </div>

        <div className="calendar_body">
          <div className="calendar_top">
            <h3>{monthLabel}</h3>
            <div className="actions">
              <img
                src="https://i.pravatar.cc/32"
                alt="User"
                className="avatar"
              />
              <button className="add_btn" onClick={() => setModalOpen(true)}>
                +
              </button>
            </div>
          </div>

          <div className="week_days">
            {weekDates.map((date, i) => (
              <div
                key={i}
                className={`week_day ${isSameDate(date, selectedDate) ? "selected" : ""}`}
                onClick={() => setSelectedDate(date)}
              >
                <div className="day_name">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div className="day_num">{date.getDate()}</div>
              </div>
            ))}
          </div>

          <div className="appointments_section">
            <h4>Today</h4>
            {selectedDayAppointments.length === 0 ? (
              <p className="empty_msg">No appointments for this day.</p>
            ) : (
              selectedDayAppointments.map((app) => (
                <div className="appointment_card" key={app.id}>
                  <div
                    className="app_icon"
                    style={{ backgroundColor: getIconBg(app.appointmentName) }}
                  >
                    {getIcon(app.appointmentName)}
                  </div>
                  <div className="app_info">
                    <div className="app_title">{app.appointmentName}</div>
                    <div className="app_time">
                      {app.appointmentStartTime} - {app.appointmentEndTime}
                    </div>
                    {app.doctorName && (
                      <div className="app_doctor">Dr. {app.doctorName}</div>
                    )}
                  </div>
                  <div className="app_actions">
                    <span className={`status_badge ${app.status}`}>
                      {app.status}
                    </span>
                    {app.status === "scheduled" && (
                      <button
                        className="action_btn"
                        title="Mark complete"
                        onClick={() => handleComplete(app.id)}
                      >
                        ✅
                      </button>
                    )}
                    <button
                      className="action_btn"
                      title="Delete"
                      onClick={() => handleDelete(app.id)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="appointments_section" style={{ marginTop: 16 }}>
            <h4>Upcoming (Next 3 Days)</h4>
            {upcomingAppointments.length === 0 ? (
              <p className="empty_msg">No upcoming appointments.</p>
            ) : (
              upcomingAppointments.map((app) => (
                <div className="appointment_card" key={app.id}>
                  <div
                    className="app_icon"
                    style={{ backgroundColor: getIconBg(app.appointmentName) }}
                  >
                    {getIcon(app.appointmentName)}
                  </div>
                  <div className="app_info">
                    <div className="app_title">{app.appointmentName}</div>
                    <div className="app_time">
                      {app.appointmentStartTime} - {app.appointmentEndTime} on{" "}
                      {new Date(app.appointmentDate).toLocaleDateString()}
                    </div>
                    {app.doctorName && (
                      <div className="app_doctor">Dr. {app.doctorName}</div>
                    )}
                  </div>
                  <div className="app_actions">
                    <span className={`status_badge ${app.status}`}>
                      {app.status}
                    </span>
                    {app.status === "scheduled" && (
                      <button
                        className="action_btn"
                        title="Mark complete"
                        onClick={() => handleComplete(app.id)}
                      >
                        ✅
                      </button>
                    )}
                    <button
                      className="action_btn"
                      title="Delete"
                      onClick={() => handleDelete(app.id)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <AppointmentModal
          onClose={() => setModalOpen(false)}
          onCreated={() => {
            onRefresh();
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
}
