"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { FiChevronDown } from "react-icons/fi";
import { useRouter } from "next/navigation";
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

function getDateRange(filter: string): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  switch (filter) {
    case "This Week":
      start.setDate(now.getDate() - now.getDay());
      end.setDate(start.getDate() + 6);
      break;
    case "This Month":
      start.setDate(1);
      end.setMonth(now.getMonth() + 1, 0);
      break;
    case "This Year":
      start.setMonth(0, 1);
      end.setMonth(11, 31);
      break;
  }

  return { start, end };
}

export default function DashboardPage() {
  const router = useRouter();
  const [selected, setSelected] = useState("This Week");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [healthChecks, setHealthChecks] = useState<HealthCheck[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/appointments?limit=100");
      if (res.ok) {
        const result = await res.json();
        setAppointments(result.data || result);
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
    }
  }, []);

  const fetchHealthChecks = useCallback(async () => {
    try {
      const res = await fetch("/api/health-checks?limit=100");
      if (res.ok) {
        const result = await res.json();
        setHealthChecks(result.data || result);
      }
    } catch (err) {
      console.error("Failed to fetch health checks:", err);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
    fetchHealthChecks();
  }, [fetchAppointments, fetchHealthChecks]);

  const filteredAppointments = useMemo(() => {
    const { start, end } = getDateRange(selected);
    return appointments.filter((app) => {
      const appDate = new Date(app.appointmentDate);
      return appDate >= start && appDate <= end;
    });
  }, [appointments, selected]);

  const filteredHealthChecks = useMemo(() => {
    const { start, end } = getDateRange(selected);
    return healthChecks.filter((check) => {
      const checkDate = new Date(check.date);
      return checkDate >= start && checkDate <= end;
    });
  }, [healthChecks, selected]);

  const appointmentCount = filteredAppointments.length;

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
            {filteredHealthChecks.length === 0 ? (
              <p className="empty_msg">No health checks for {selected.toLowerCase()}.</p>
            ) : (
              filteredHealthChecks.map((check) => (
                <HealthCard key={check.id} check={check} />
              ))
            )}
          </div>
          <span
            className="details_link"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/profile")}
          >
            Details →
          </span>
        </div>
      </div>

      {/* Activity */}
      <ActivityChart
        appointmentCount={appointmentCount}
        appointments={filteredAppointments}
      />

      {/* Calendar Panel */}
      <ScheduleCalendar appointments={appointments} onRefresh={fetchAppointments} />
    </div>
  );
}
