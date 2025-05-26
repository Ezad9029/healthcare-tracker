import React, { useState } from 'react';
import './scehdulecalendar.css';
import AppointmentModal from './AppointementModal';


const ScheduleCalendar = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const appointments = [
    {
      id: 1,
      title: 'Dentist',
      time: '09:00-11:00',
      doctor: 'Dr. Cameron Williamson',
      day: 'Tuesday',
      icon: '🦷',
    },
    {
      id: 2,
      title: 'Physiotherapy Appointment',
      time: '11:00-12:00',
      doctor: 'Dr. Kevin Djones',
      day: 'Thursday',
      icon: '💪',
    },
    {
      id: 3,
      title: 'Health checkup complete',
      time: '11:00 AM',
      day: 'Thursday',
      icon: '💉',
    },
    {
      id: 4,
      title: 'Ophthalmologist',
      time: '14:00 PM',
      day: 'Thursday',
      icon: '👁️',
    },
    {
      id: 5,
      title: 'Cardiologist',
      time: '12:00 AM',
      day: 'Saturday',
      icon: '❤️',
    },
    {
      id: 6,
      title: 'Neurologist',
      time: '16:00 PM',
      day: 'Saturday',
      icon: '🧠',
    },
  ];

  return (
    <div className="calendar_container">
      <div className="calendar_header">
        <h2>October 2021</h2>
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

      <div className="calendar_days">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <div key={i} className="day">
            <div className="day_name">{day}</div>
            <div className="day_date">{25 + i}</div>
          </div>
        ))}
      </div>

      <div className="appointments">
        {appointments.map((app) => (
          <div className="appointment_card" key={app.id}>
            <div className="appointment_icon">{app.icon}</div>
            <div className="appointment_info">
              <div className="appointment_title">{app.title}</div>
              <div className="appointment_time">{app.time}</div>
              {app.doctor && (
                <div className="appointment_doctor">{app.doctor}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {modalOpen && <AppointmentModal onClose={() => setModalOpen(false)} />}
    </div>
  );
};

export default ScheduleCalendar;
