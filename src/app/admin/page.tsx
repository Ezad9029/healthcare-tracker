"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FaUsers, FaUserShield, FaUser, FaUserMd, FaTrash, FaPlus,
  FaEdit, FaCalendarCheck, FaHeartbeat, FaChevronDown, FaChevronRight,
} from "react-icons/fa";

interface UserAppointment {
  id: string;
  appointmentName: string;
  doctorName: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  status: string;
}

interface ManagedUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  specialty: string | null;
  createdAt: string;
  appointments: UserAppointment[];
  _count: { appointments: number; healthChecks: number };
}

export default function AdminPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) setUsers(await res.json());
    } catch {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleRole = async (user: ManagedUser) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update role");
      }
    } catch { alert("Failed to update role"); }
  };

  const handleDelete = async (user: ManagedUser) => {
    if (!confirm(`Delete ${user.name || user.email}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (res.ok) setUsers((prev) => prev.filter((u) => u.id !== user.id));
      else {
        const data = await res.json();
        alert(data.error || "Failed to delete user");
      }
    } catch { alert("Failed to delete user"); }
  };

  const totalAppointments = users.reduce((sum, u) => sum + u._count.appointments, 0);
  const totalHealthChecks = users.reduce((sum, u) => sum + u._count.healthChecks, 0);
  const adminCount = users.filter((u) => u.role === "admin").length;
  const doctorCount = users.filter((u) => u.role === "doctor").length;

  if (loading) return <div className="loading_page"><div className="spinner" /></div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 32 }}>
        <StatCard icon={<FaUsers />} label="Total Users" value={users.length} color="#6366f1" />
        <StatCard icon={<FaUserShield />} label="Admins" value={adminCount} color="#8b5cf6" />
        <StatCard icon={<FaUserMd />} label="Doctors" value={doctorCount} color="#22c55e" />
        <StatCard icon={<FaCalendarCheck />} label="Appointments" value={totalAppointments} color="#06b6d4" />
        <StatCard icon={<FaHeartbeat />} label="Health Checks" value={totalHealthChecks} color="#ef4444" />
      </div>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700 }}>User Management</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
            View users and their appointments
          </p>
        </div>
        <button className="save_btn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px" }} onClick={() => setShowCreateModal(true)}>
          <FaPlus /> Add User
        </button>
      </div>

      {error && <div className="auth_error">{error}</div>}

      {/* Users */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {users.map((u) => {
          const expanded = expandedUser === u.id;
          return (
            <div key={u.id} style={{
              background: "var(--card)", borderRadius: 14, border: "1px solid var(--border)",
              overflow: "hidden", transition: "box-shadow 0.15s",
            }}
              onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "var(--shadow)")}
              onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              {/* User Row */}
              <div style={{
                display: "flex", alignItems: "center", gap: 14, padding: "16px 22px",
                cursor: "pointer",
              }} onClick={() => setExpandedUser(expanded ? null : u.id)}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: u.role === "admin" ? "#ede9fe" : u.role === "doctor" ? "#dcfce7" : "#dbeafe",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, color: u.role === "admin" ? "#7c3aed" : u.role === "doctor" ? "#16a34a" : "#2563eb",
                  flexShrink: 0,
                }}>
                  {u.role === "admin" ? <FaUserShield /> : u.role === "doctor" ? <FaUserMd /> : <FaUser />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name || "Unnamed"}</div>
                  <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{u.email}</div>
                </div>
                <span style={{
                  padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: u.role === "admin" ? "#ede9fe" : u.role === "doctor" ? "#dcfce7" : "#dbeafe",
                  color: u.role === "admin" ? "#7c3aed" : u.role === "doctor" ? "#16a34a" : "#2563eb",
                  textTransform: "capitalize",
                }}>
                  {u.role}
                </span>
                {u.specialty && (
                  <span style={{ padding: "3px 10px", borderRadius: 16, fontSize: 11, background: "#f0fdf4", color: "#15803d", fontWeight: 500 }}>
                    {u.specialty}
                  </span>
                )}
                <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                  {u._count.appointments} appts
                </span>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  <button className="action_btn" title="Toggle role" onClick={(e) => { e.stopPropagation(); handleToggleRole(u); }}>
                    <FaEdit />
                  </button>
                  <button className="action_btn" title="Delete" onClick={(e) => { e.stopPropagation(); handleDelete(u); }}>
                    <FaTrash style={{ color: "var(--danger)" }} />
                  </button>
                  {expanded ? <FaChevronDown style={{ fontSize: 12, color: "var(--text-secondary)" }} /> : <FaChevronRight style={{ fontSize: 12, color: "var(--text-secondary)" }} />}
                </div>
              </div>

              {/* Expanded Appointments */}
              {expanded && (
                <div style={{ borderTop: "1px solid var(--border)", padding: "12px 22px 16px", background: "#fafbfc" }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 10 }}>
                    Appointments ({u.appointments.length})
                  </div>
                  {u.appointments.length === 0 ? (
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", padding: "8px 0" }}>No appointments</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {u.appointments.map((apt) => (
                        <div key={apt.id} style={{
                          display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
                          background: "var(--card)", borderRadius: 10, border: "1px solid var(--border)",
                        }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{apt.appointmentName}</div>
                            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                              Dr. {apt.doctorName} • {new Date(apt.appointmentDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} • {apt.appointmentStartTime}–{apt.appointmentEndTime}
                            </div>
                          </div>
                          <span className={`status_badge ${apt.status}`} style={{ fontSize: 10, padding: "3px 10px" }}>
                            {apt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={(u) => { setUsers((prev) => [{ ...u, appointments: [] }, ...prev]); setShowCreateModal(false); }}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div style={{
      background: "var(--card)", borderRadius: 14, padding: "18px 20px",
      border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 11, background: `${color}12`, color,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</div>
      </div>
    </div>
  );
}

function CreateUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: (u: ManagedUser) => void }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user", specialty: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create user");
        return;
      }
      onCreated(await res.json());
    } catch {
      setError("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal_overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create New User</h2>
        {error && <div className="auth_error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form_group">
            <label>Name</label>
            <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="form_group">
            <label>Email</label>
            <input type="email" placeholder="user@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="form_group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
          </div>
          <div className="form_group">
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{ width: "100%", padding: "11px 16px", border: "1.5px solid var(--border)", borderRadius: 10, fontSize: 14, fontFamily: "inherit", background: "#f8fafc", outline: "none" }}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
          {form.role === "doctor" && (
            <div className="form_group">
              <label>Specialty</label>
              <input placeholder="e.g. Cardiology" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} />
            </div>
          )}
          <div className="modal_buttons">
            <button type="button" className="cancel_btn" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="save_btn" disabled={loading}>{loading ? "Creating..." : "Create User"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
