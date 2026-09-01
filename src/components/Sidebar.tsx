"use client";

import { useSession, signOut } from "next-auth/react";
import {
  FaThLarge, FaHistory, FaCalendarAlt, FaClipboardList,
  FaChartBar, FaComments, FaPhoneAlt, FaCog, FaSignOutAlt,
  FaUserShield, FaUserCircle, FaUserMd,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
}

export default function Sidebar({ isOpen, isCollapsed }: SidebarProps) {
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "admin";
  const isDoctor = role === "doctor";

  return (
    <>
      <div className={`sidebar_overlay ${isOpen ? "active" : ""}`} />
      <nav className={`sidebar ${isOpen ? "mobile_open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
        <div className="logo">
          <span className="text_cyan">Health</span>
          <span className="text_dark">care.</span>
        </div>

        <div className="nav_section">
          <p className="section_label">General</p>
          <ul className="nav_list">
            <li className="nav_item active">
              <FaThLarge /> <span>Dashboard</span>
            </li>
            <li className="nav_item">
              <FaHistory /> <span>History</span>
            </li>
            <li className="nav_item">
              <FaCalendarAlt /> <span>Calendar</span>
            </li>
            <li className="nav_item">
              <FaClipboardList /> <span>Appointments</span>
            </li>
            <li className="nav_item">
              <FaChartBar /> <span>Statistics</span>
            </li>
          </ul>
        </div>

        <div className="nav_section">
          <p className="section_label">Tools</p>
          <ul className="nav_list">
            <li className="nav_item">
              <FaComments /> <span>Chat</span>
            </li>
            <li className="nav_item">
              <FaPhoneAlt /> <span>Support</span>
            </li>
          </ul>
        </div>

        {isDoctor && (
          <div className="nav_section">
            <p className="section_label">Doctor</p>
            <ul className="nav_list">
              <li className="nav_item" style={{ cursor: "pointer" }} onClick={() => window.location.href = "/doctor"}>
                <FaUserMd /> <span>My Patients</span>
              </li>
            </ul>
          </div>
        )}

        {isAdmin && (
          <div className="nav_section">
            <p className="section_label">Administration</p>
            <ul className="nav_list">
              <li className="nav_item" style={{ cursor: "pointer" }} onClick={() => window.location.href = "/admin"}>
                <FaUserShield /> <span>User Management</span>
              </li>
            </ul>
          </div>
        )}

        <div className="nav_section">
          <ul className="nav_list">
            <li className="nav_item" style={{ cursor: "pointer" }} onClick={() => window.location.href = "/profile"}>
              <FaUserCircle /> <span>My Profile</span>
            </li>
          </ul>
        </div>

        <div className="sidebar_footer">
          <FaCog />
          <span className="logout_label">Settings</span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </nav>
    </>
  );
}
