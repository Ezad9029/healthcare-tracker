"use client";

import { useState } from "react";

interface AppointmentModalProps {
  onClose: () => void;
  onCreated: () => void;
}

export default function AppointmentModal({
  onClose,
  onCreated,
}: AppointmentModalProps) {
  const [form, setForm] = useState({
    appointmentName: "",
    doctorName: "",
    appointmentDate: "",
    appointmentStartTime: "",
    appointmentEndTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create appointment");
        return;
      }

      onCreated();
    } catch {
      setError("Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Schedule Appointment</h2>

        {error && <div className="auth_error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form_group">
            <label>Appointment Title</label>
            <input
              name="appointmentName"
              placeholder="e.g. Dentist Checkup"
              value={form.appointmentName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form_group">
            <label>Doctor Name</label>
            <input
              name="doctorName"
              placeholder="e.g. Dr. Smith"
              value={form.doctorName}
              onChange={handleChange}
            />
          </div>

          <div className="form_group">
            <label>Date</label>
            <input
              name="appointmentDate"
              type="date"
              value={form.appointmentDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form_group">
            <label>Start Time</label>
            <input
              name="appointmentStartTime"
              type="time"
              value={form.appointmentStartTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form_group">
            <label>End Time</label>
            <input
              name="appointmentEndTime"
              type="time"
              value={form.appointmentEndTime}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal_buttons">
            <button
              type="button"
              className="cancel_btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="save_btn" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
