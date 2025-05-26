import React from 'react';
import './healthcard.css';

const HealthCard = ({ icon, label, date, color, percent }) => (
  <div className="health_card">
    <div className="icon">{icon}</div>
    <div className="info">
      <div className="label">{label}</div>
      <div className="date">Date: {date}</div>
      <div className="bar_bg">
        <div className="bar_fill" style={{ backgroundColor: color, width: percent }} />
      </div>
    </div>
  </div>
);

export default HealthCard;
