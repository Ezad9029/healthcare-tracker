import React, { useState } from "react";
import Sidebar from "../SideBar/SideBar";
import Header from "../Header/Header";
import "./dashboard.css";
import { FiChevronDown } from "react-icons/fi";
import ScheduleCalendar from "../AppointmentSection/ScheduleCalendar"
import AnatomyViewer from "../AnatmoyViewer/AnatomyViewer";

const Dashboard = () => {
  const [selected, setSelected] = useState("This Week");
  const [open, setOpen] = useState(false);
  const options = ["This Week", "This Month", "This Year"];

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
  };

  return (
    <div className="dashboard_container">
      <Sidebar />
      <div className="mid_content">
        <Header />
        <div className="dashboard_header">
          <h1>Dashboard</h1>
          <div className="time_filter">
            <div
              className="time_filter_selected"
              onClick={() => setOpen(!open)}
            >
              {selected}
              <FiChevronDown className="dropdown_icon" />
            </div>
            {open && (
              <ul className="time_filter_options">
                {options.map((option) => (
                  <li
                    key={option}
                    className={option === selected ? "active" : ""}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <AnatomyViewer />
      </div>
      
      <ScheduleCalendar />
    </div>
  );
};

export default Dashboard;
