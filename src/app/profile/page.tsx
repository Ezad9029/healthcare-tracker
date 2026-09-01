"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { FaUser, FaEnvelope, FaLock, FaShieldAlt, FaCalendarCheck, FaHeartbeat } from "react-icons/fa";

interface Profile {
  id: string;
  name: string | null;
  email: string;
  role: string;
  specialty: string | null;
  createdAt: string;
  _count: { appointments: number; healthChecks: number };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setName(data.name || "");
        setEmail(data.email);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const toggleMenu = () => {
    if (window.innerWidth > 1024) setIsCollapsed(!isCollapsed);
    else setIsMenuOpen(!isMenuOpen);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setMsg({ type: "success", text: "Profile updated successfully!" });
      } else {
        const data = await res.json();
        setMsg({ type: "error", text: data.error || "Failed to update" });
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: "", text: "" });

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setMsg({ type: "success", text: "Password changed successfully!" });
      } else {
        const data = await res.json();
        setMsg({ type: "error", text: data.error || "Failed to change password" });
      }
    } catch {
      setMsg({ type: "error", text: "Something went wrong" });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="loading_page"><div className="spinner" /></div>;
  }

  if (!session || !profile) return null;

  const role = (session.user as { role?: string })?.role;
  const isAdmin = role === "admin";

  return (
    <div className="app_layout">
      <Sidebar isOpen={isMenuOpen} isCollapsed={isCollapsed} />
      <div className={`main_area ${isCollapsed ? "sidebar_collapsed" : ""}`}>
        <Header isMenuOpen={isMenuOpen} isCollapsed={isCollapsed} toggleMenu={toggleMenu} />
        <main className="main_content">
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>My Profile</h1>

            {/* Profile Card */}
            <div style={{
              background: "var(--card)", borderRadius: 16, padding: 32,
              border: "1px solid var(--border)", marginBottom: 24,
              display: "flex", alignItems: "center", gap: 24,
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent), var(--accent-dark))",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 32, color: "#fff", fontWeight: 700, flexShrink: 0,
              }}>
                {profile.name?.[0]?.toUpperCase() || profile.email[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.name || "Unnamed User"}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 2 }}>{profile.email}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                    background: role === "admin" ? "#ede9fe" : role === "doctor" ? "#dcfce7" : "#dbeafe",
                    color: role === "admin" ? "#7c3aed" : role === "doctor" ? "#16a34a" : "#2563eb",
                  }}>
                    <FaShieldAlt /> {role}
                  </span>
                  {profile.specialty && (
                    <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500, background: "#f0fdf4", color: "#15803d" }}>
                      {profile.specialty}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
              <MiniStat icon={<FaCalendarCheck />} label="Appointments" value={profile._count.appointments} color="#06b6d4" />
              <MiniStat icon={<FaHeartbeat />} label="Health Checks" value={profile._count.healthChecks} color="#ef4444" />
              <MiniStat icon={<FaUser />} label="Member since" value={new Date(profile.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })} color="#8b5cf6" />
            </div>

            {/* Edit Profile Form */}
            <div style={{
              background: "var(--card)", borderRadius: 16, padding: 28,
              border: "1px solid var(--border)", marginBottom: 24,
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <FaUser style={{ color: "var(--accent)" }} /> Edit Profile
              </h2>

              {msg.text && (
                <div style={{
                  padding: "10px 14px", borderRadius: 10, marginBottom: 16, fontSize: 13,
                  background: msg.type === "success" ? "#dcfce7" : "#fef2f2",
                  color: msg.type === "success" ? "#16a34a" : "var(--danger)",
                  border: `1px solid ${msg.type === "success" ? "#bbf7d0" : "#fecaca"}`,
                }}>
                  {msg.text}
                </div>
              )}

              <form onSubmit={handleSaveProfile}>
                <div className="form_group">
                  <label><FaUser style={{ marginRight: 6, opacity: 0.5 }} /> Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form_group">
                  <label><FaEnvelope style={{ marginRight: 6, opacity: 0.5 }} /> Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <button type="submit" className="save_btn" disabled={saving} style={{ marginTop: 8, padding: "11px 28px" }}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div style={{
              background: "var(--card)", borderRadius: 16, padding: 28,
              border: "1px solid var(--border)",
            }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <FaLock style={{ color: "var(--accent)" }} /> Change Password
              </h2>
              <form onSubmit={handleChangePassword}>
                <div className="form_group">
                  <label>Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" required />
                </div>
                <div className="form_group">
                  <label>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={6} required />
                </div>
                <button type="submit" className="save_btn" disabled={saving} style={{ marginTop: 8, padding: "11px 28px" }}>
                  {saving ? "Updating..." : "Change Password"}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MiniStat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div style={{
      background: "var(--card)", borderRadius: 14, padding: "18px 20px",
      border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 14,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 10, background: `${color}12`, color,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>{label}</div>
      </div>
    </div>
  );
}
