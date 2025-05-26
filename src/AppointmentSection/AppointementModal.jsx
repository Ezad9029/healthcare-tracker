import React, { useState } from 'react';
import './scehdulecalendar.css';

const AppointmentModal = ({ onClose }) => {
  const [form, setForm] = useState({
    title: '',
    doctor: '',
    time: '',
    date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', form);
    onClose();
  };

  return (
    <div className="modal_overlay">
      <div className="modal">
        <h2>Schedule Appointment</h2>
        <form onSubmit={handleSubmit} className="modal_form">
          <input
            type="text"
            name="title"
            placeholder="Appointment Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="doctor"
            placeholder="Doctor Name"
            value={form.doctor}
            onChange={handleChange}
            required
          />
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            value={form.date}
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