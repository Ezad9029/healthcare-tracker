import React, { useState, useEffect } from "react";
import Sidebar from "../SideBar/SideBar";
import Header from "../Header/Header";
import "./dashboard.css";
import { FiChevronDown } from "react-icons/fi";
import ScheduleCalendar from "../AppointmentSection/ScheduleCalendar"
import AnatomyViewer from "../AnatmoyViewer/AnatomyViewer";
import { FaLongArrowAltRight } from "react-icons/fa";

const Dashboard = () => {
  const [selected, setSelected] = useState("This Week");
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const options = ["This Week", "This Month", "This Year"];

  const handleSelect = (option) => {
    setSelected(option);
    setOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && 
          !event.target.closest('.side_bar') && 
          !event.target.closest('.hamburger_menu') &&
          window.innerWidth < 768) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const healthChecks = [
  {
    id: 1,
    title: "Lungs",
    icon: "🫁",
    date: "2021-10-26",
    progress: 80,
    color: "#D63A3A"
  },
  {
    id: 2,
    title: "Teeth",
    icon: "🦷",
    date: "2021-10-26",
    progress: 50,
    color: "#43BDBB"
  },
  {
    id: 3,
    title: "Bone",
    icon: "🦴",
    date: "2021-10-26",
    progress: 65,
    color: "#FF914D"
  }
];

const activitydata = {
    Mon: [50, 30],
  Tues: [40, 25, 15],
  Wed: [35, 20],
  Thurs: [45, 25],
  Fri: [50, 40, 30],
  Sat: [40, 25],
  Sun: [35, 20],
  };

  const activitycolors = ["#00CFE8", "#7367F0", "#A8AAAE"];


  return (
    <div className="dashboard_container">
      <Sidebar isOpen={isMenuOpen} />
      <div className="mid_content">
        <Header isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
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

<div className="scrollable_div">
        <div className="anatomy_details">
          <AnatomyViewer />

          <div className="anatomy_details_right">
            <div className="health_check_container">
              {healthChecks.map((check) => (
                <div className="health_card" key={check.id}>
                  <div className="health_header">
                    <span className="health_icon">{check.icon}</span>
                    <span className="health_title">{check.title}</span>
                  </div>
                  <div className="health_date">
                    Date:{" "}
                    {new Date(check.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <div className="health_progress">
                    <div
                      className="health_bar"
                      style={{
                        width: `${check.progress}%`,
                        backgroundColor: check.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="details_bottom">
              Details
              <FaLongArrowAltRight />
            </div>
          </div>
        </div>

<div className="activity_container">
      <div className="activity_header">
        <h2 className="activity_title">Activity</h2>
        <p className="activity_count">3 appointment on this week</p>
      </div>
      <div className="activity_chart">
        {Object.entries(activitydata).map(([day, bars]) => (
          <div className="activity_day" key={day}>
            {bars.map((height, i) => (
              <div
                key={i}
                className="activity_bar"
                style={{
                  height: `${height}px`,
                  backgroundColor: activitycolors[i % activitycolors.length],
                }}
              ></div>
            ))}
            <span className="activity_day_label">{day}</span>
          </div>
        ))}
      </div>
    </div>
    </div>
      </div>

      <ScheduleCalendar />
    </div>
  );
};

export default Dashboard;
