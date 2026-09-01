"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { FaUserInjured, FaCalendarCheck, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";

interface Appointment {
  id: string;
  userId: string;
  appointmentName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  status: string;
  notes: string | null;
  user: { name: string | null; email: string };
}

export default function DoctorDashboard() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchAppointments = useCallback(async () => {
    try {
      const res = await fetch("/api/doctor/appointments");
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  const handleStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAppointments();
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = appointments.filter((a) => {
    if (filter === "all") return true;
    return a.status === filter;
  });

  const scheduled = appointments.filter((a) => a.status === "scheduled").length;
  const completed = appointments.filter((a) => a.status === "completed").length;
  const cancelled = appointments.filter((a) => a.status === "cancelled").length;

  if (loading) {
    return <div className="loading_page"><div className="spinner" /></div>;
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>
          Welcome, {(session?.user as { name?: string })?.name || "Doctor"}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
          Manage your patient appointments
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
        <StatCard icon={<FaClock />} label="Scheduled" value={scheduled} color="#2563eb" bg="#dbeafe" />
        <StatCard icon={<FaCheckCircle />} label="Completed" value={completed} color="#16a34a" bg="#dcfce7" />
        <StatCard icon={<FaTimesCircle />} label="Cancelled" value={cancelled} color="#dc2626" bg="#fee2e2" />
      </div>

      {/* Filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "scheduled", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "7px 18px", borderRadius: 20, border: "1.5px solid",
              borderColor: filter === f ? "var(--accent)" : "var(--border)",
              background: filter === f ? "var(--accent)" : "var(--card)",
              color: filter === f ? "#fff" : "var(--text)",
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "inherit", textTransform: "capitalize",
              transition: "all 0.15s",
            }}
          >
            {f} ({f === "all" ? appointments.length : f === "scheduled" ? scheduled : f === "completed" ? completed : cancelled})
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div className="empty_msg" style={{ padding: 40 }}>No appointments found.</div>
        ) : (
          filtered.map((apt) => (
            <div key={apt.id} style={{
              background: "var(--card)", borderRadius: 14, padding: "18px 22px",
              border: "1px solid var(--border)", display: "flex", alignItems: "center",
              gap: 16, transition: "all 0.15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: apt.status === "scheduled" ? "#dbeafe" : apt.status === "completed" ? "#dcfce7" : "#fee2e2",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: apt.status === "scheduled" ? "#2563eb" : apt.status === "completed" ? "#16a34a" : "#dc2626",
                fontSize: 20, flexShrink: 0,
              }}>
                <FaUserInjured />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 15 }}>{apt.appointmentName}</div>
                <div style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>
                  Patient: <strong>{apt.user.name || apt.user.email}</strong>
                </div>
                <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                  {new Date(apt.appointmentDate).toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })} • {apt.appointmentStartTime} – {apt.appointmentEndTime}
                </div>
              </div>
              <span className={`status_badge ${apt.status}`} style={{ fontSize: 11, padding: "4px 12px" }}>
                {apt.status}
              </span>
              <div style={{ display: "flex", gap: 6 }}>
                {apt.status === "scheduled" && (
                  <>
                    <button
                      onClick={() => handleStatus(apt.id, "completed")}
                      title="Mark as completed"
                      style={{
                        padding: "6px 14px", borderRadius: 8, border: "1.5px solid #dcfce7",
                        background: "#f0fdf4", color: "#16a34a", fontSize: 12, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                      }}
                    >
                      ✅ Complete
                    </button>
                    <button
                      onClick={() => handleStatus(apt.id, "cancelled")}
                      title="Cancel appointment"
                      style={{
                        padding: "6px 14px", borderRadius: 8, border: "1.5px solid #fee2e2",
                        background: "#fef2f2", color: "#dc2626", fontSize: 12, fontWeight: 600,
                        cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                      }}
                    >
                      ❌ Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: number; color: string; bg: string }) {
  return (
    <div style={{
      background: "var(--card)", borderRadius: 14, padding: "20px 24px",
      border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, background: bg, color,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>{label}</div>
      </div>
    </div>
  );
}
