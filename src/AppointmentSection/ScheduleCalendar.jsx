import React, { useEffect, useState } from "react";
import "./schedulecalendar.css";
import AppointmentModal from "./AppointementModal";
import { RiArrowRightFill,RiArrowLeftFill } from "react-icons/ri";

const ScheduleCalendar = () => {
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

  const isSameDate = (date1, date2) =>
    date1.toDateString() === date2.toDateString();

  const [appointments, setAppointments] = useState([]);

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        `https://68356dbacd78db2058c17508.mockapi.io/userOpp`
      );
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getIcon = (title) => {
    if (title.toLowerCase().includes("dentist")) return "🦷";
    if (title.toLowerCase().includes("physio")) return "💪";
    if (
      title.toLowerCase().includes("eye") ||
      title.toLowerCase().includes("opthalm")
    )
      return "👁️";
    if (title.toLowerCase().includes("cardio")) return "❤️";
    if (title.toLowerCase().includes("neuro")) return "🧠";
    return "📅";
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `https://68356dbacd78db2058c17508.mockapi.io/userOpp/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete appointment");
      }

      fetchAppointments();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Could not delete the appointment.");
    }
  };

  const selectedDayAppointments = appointments.filter(
    (app) =>
      new Date(app.appointment_date).toDateString() ===
      selectedDate.toDateString()
  );

  const upcomingSchedule = appointments.filter((app) => {
    const appDate = new Date(app.appointment_date);
    const daysDiff = (appDate - selectedDate) / (1000 * 60 * 60 * 24);
    return daysDiff > 0 && daysDiff <= 3;
  });

  return (
    <div className="calendar_container">
      <div className="calendar_header">
        

        <div className="user_actions">
          <img
            src="https://i.pravatar.cc/32"
            alt="User"
            className="user_avatar"
          />
          <button className="add_button" onClick={() => setModalOpen(true)}>
            +
          </button>
        </div>
      </div>

<div className="head_calendar">
      <h2 style={{fontSize:"16px",color:"#120a54"}}>
          {selectedDate.toLocaleString("default", { month: "long" })}{" "}
          {selectedDate.getFullYear()}
        </h2>

<div className="arrow_div">
        <RiArrowLeftFill />
        <RiArrowRightFill />
        </div>
        </div>

      <div className="calendar_days">
        {getNext7Days().map((date, i) => (
          <div
            key={i}
            className={`day ${
              isSameDate(date, selectedDate) ? "selected_day" : ""
            }`}
            onClick={() => setSelectedDate(date)}
          >
            <div className="day_name">
              {date.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div className="day_date">{date.getDate()}</div>
          </div>
        ))}
      </div>

      <h3 style={{ color: " #120a54", fontWeight: "bold" }}>Today</h3>
      <div className="appointments">
        {selectedDayAppointments.length === 0 ? (
          <p style={{ margin: "auto", color: "#120a54" }}>
            No appointments for this day.
          </p>
        ) : (
          selectedDayAppointments.map((app) => (
            <div className="appointment_card" key={app.id}>
              <div className="appointment_icon">
                {getIcon(app.appointment_name)}
              </div>
              <div className="appointment_info">
                <div className="appointment_title">{app.appointment_name}</div>
                <div className="appointment_time">
                  {app.appointment_start_time} - {app.appointment_end_time} on{" "}
                  {app.appointment_date}
                </div>
                {app.doctor_name && (
                  <div className="appointment_doctor">
                    Dr. {app.doctor_name}
                  </div>
                )}
                <button
                  className="delete_button"
                  onClick={() => handleDelete(app.id)}
                >
                  ❌
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 style={{ color: " #120a54", fontWeight: "bold" }}>
        The Upcoming Schedule
      </h3>
      <div className="appointments">
        {upcomingSchedule.map((app) => (
          <div className="appointment_card" key={app.id}>
            <div className="appointment_icon">
              {getIcon(app.appointment_name)}
            </div>
            <div className="appointment_info">
              <div className="appointment_title">{app.appointment_name}</div>
              <div className="appointment_time">
                {app.appointment_start_time} - {app.appointment_end_time} on{" "}
                {app.appointment_date}
              </div>
              {app.doctor_name && (
                <div className="appointment_doctor">Dr. {app.doctor_name}</div>
              )}
              <button
                className="delete_button"
                onClick={() => handleDelete(app.id)}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <AppointmentModal
          onClose={() => setModalOpen(false)}
          onCreate={fetchAppointments}
        />
      )}
    </div>
  );
};

export default ScheduleCalendar;
