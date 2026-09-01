"use client";

import { useState, useEffect, useCallback } from "react";
import { FiChevronDown } from "react-icons/fi";
import AnatomyViewer from "@/components/AnatomyViewer";
import HealthCard from "@/components/HealthCard";
import ActivityChart from "@/components/ActivityChart";
import ScheduleCalendar from "@/components/ScheduleCalendar";

interface HealthCheck {
  id: string;
  title: string;
  icon: string;
  date: string;
  progress: number;
  color: string;
}

interface Appointment {
  id: string;
  appointmentName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  status: string;
}

const timeOptions = ["This Week", "This Month", "This Year"];

export default function DashboardPage() {
  const [selected, setSelected] = useState("This Week");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  }, []);

  const fetchHealthChecks = useCallback(async () => {
    try {
      const res = await fetch("/api/health-checks");
      if (res.ok) {
        const data = await res.json();
        setHealthChecks(data);
      }
    } catch (err) {
      console.error("Failed to fetch health checks:", err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchHealthChecks();
  }, [fetchAppointments, fetchHealthChecks]);

  const weekAppointmentCount = appointments.filter((app) => {
    const appDate = new Date(app.appointmentDate);
    const now = new Date();
    const diff = (appDate.getTime() - now.getTime()) / 86400000;
    return diff >= -1 && diff <= 7;
  }).length;

  return (
    <div className="dashboard_page">
      {/* Top Bar */}
      <div className="dashboard_top">
        <h1>Dashboard</h1>
        <div className="time_filter">
          <button
            className="time_filter_btn"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {selected}
            <FiChevronDown />
          </button>
          {dropdownOpen && (
            <ul className="time_filter_dropdown">
              {timeOptions.map((option) => (
                <li
                  key={option}
                  className={option === selected ? "active" : ""}
                  onClick={() => {
                    setSelected(option);
                    setDropdownOpen(false);
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Anatomy + Health Cards */}
      <div className="anatomy_section">
        <AnatomyViewer />
        <div className="anatomy_info">
          <div className="health_cards">
            {healthChecks.length === 0 ? (
              <p className="empty_msg">No health checks yet.</p>
            ) : (
              healthChecks.map((check) => (
                <HealthCard key={check.id} check={check} />
              ))
            )}
          </div>
          <span className="details_link">
            Details →
          </span>
        </div>
      </div>

      {/* Activity */}
      <ActivityChart appointmentCount={weekAppointmentCount} />

      {/* Calendar Panel */}
      <ScheduleCalendar appointments={appointments} onRefresh={fetchAppointments} />
    </div>
  );
}
