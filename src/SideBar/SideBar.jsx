import React from 'react';
import './sidebar.css';
import {
  FaThLarge, FaHistory, FaCalendarAlt, FaClipboardList,
  FaChartBar, FaComments, FaPhoneAlt, FaCog
} from 'react-icons/fa';

const Sidebar = ({ isOpen }) => {
  return (
    <>
      <div className={`overlay ${isOpen ? 'active' : ''}`}></div>
      <div className={`side_bar ${isOpen ? 'active' : ''}`}>
        <h2 className="logo">
          <span className="text_cyan">Health</span><span className="text_dark">care.</span>
        </h2>

        <div className="main_sidebar_section">
          <p className="section_title">General</p>
          <ul>
            <li className="active"><FaThLarge /> <span>Dashboard</span></li>
            <li><FaHistory /> <span>History</span></li>
            <li><FaCalendarAlt /> <span>Calendar</span></li>
            <li><FaClipboardList /> <span>Appointments</span></li>
            <li><FaChartBar /> <span>Statistics</span></li>
          </ul>
        </div>

        <div className="main_sidebar_section">
          <p className="section_title">Tools</p>
          <ul>
            <li><FaComments /> <span>Chat</span></li>
            <li><FaPhoneAlt /> <span>Support</span></li>
          </ul>
        </div>

        <div className="main_sidebar_section bottom">
          <ul>
            <li><FaCog /> <span>Settings</span></li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
