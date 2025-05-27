import React, { useState } from "react";
import "./schedulecalendar.css";

const AppointmentModal = ({ onClose, onCreate }) => {
  const [form, setForm] = useState({
    id: "",
    appointment_name: "",
    doctor_name: "",
    appointment_start_time: "",
    appointment_end_time: "",
    appointment_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://68356dbacd78db2058c17508.mockapi.io/userOpp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create appointment");
      }

      const data = await response.json();
      console.log("Appointment created:", data);
      onCreate();
      onClose();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("Failed to create appointment.");
    }
  };

  return (
    <div className="modal_overlay">
      <div className="modal">
        <h2>Schedule Appointment</h2>
        <form onSubmit={handleSubmit} className="modal_form">
          <input
            type="text"
            name="appointment_name"
            placeholder="Appointment Title"
            value={form.appointment_name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="doctor_name"
            placeholder="Doctor Name"
            value={form.doctor_name}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="appointment_start_time"
            value={form.appointment_start_time}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="appointment_end_time"
            value={form.appointment_end_time}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="appointment_date"
            value={form.appointment_date}
            onChange={handleChange}
            required
          />

          <div className="modal_buttons">
            <button type="button" onClick={onClose} className="cancel_btn">
              Cancel
            </button>
            <button type="submit" className="save_btn">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentModal;
