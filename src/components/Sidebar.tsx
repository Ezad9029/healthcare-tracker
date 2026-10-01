"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  FaThLarge, FaHistory, FaCalendarAlt, FaClipboardList,
  FaChartBar, FaComments, FaPhoneAlt, FaCog, FaSignOutAlt,
  FaUserShield, FaUserCircle, FaUserMd,
} from "react-icons/fa";

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  active?: boolean;
}

export default function Sidebar({ isOpen, isCollapsed }: SidebarProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const role = (session?.user as { role?: string })?.role;
  const isAdmin = role === "admin";
  const isDoctor = role === "doctor";

  const generalNav: NavItem[] = [
    { icon: <FaThLarge />, label: "Dashboard", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: <FaHistory />, label: "History", href: "/dashboard" },
    { icon: <FaCalendarAlt />, label: "Calendar", href: "/dashboard" },
    { icon: <FaClipboardList />, label: "Appointments", href: "/dashboard" },
    { icon: <FaChartBar />, label: "Statistics", href: "/dashboard" },
  ];

  const toolsNav: NavItem[] = [
    { icon: <FaComments />, label: "Chat", href: "/dashboard" },
    { icon: <FaPhoneAlt />, label: "Support", href: "/dashboard" },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.href) {
      router.push(item.href);
    }
  };

  const renderNavItem = (item: NavItem, key: string) => (
    <li
      key={key}
      className={`nav_item ${item.active ? "active" : ""}`}
      style={{ cursor: item.href ? "pointer" : "default" }}
      onClick={() => handleNavClick(item)}
    >
      {item.icon} <span>{item.label}</span>
    </li>
  );

  return (
    <>
      <div className={`sidebar_overlay ${isOpen ? "active" : ""}`} />
      <nav className={`sidebar ${isOpen ? "mobile_open" : ""} ${isCollapsed ? "collapsed" : ""}`}>
        <div className="logo" style={{ cursor: "pointer" }} onClick={() => router.push("/dashboard")}>
          <span className="text_cyan">Health</span>
          <span className="text_dark">care.</span>
        </div>

        <div className="nav_section">
          <p className="section_label">General</p>
          <ul className="nav_list">
            {generalNav.map((item, i) => renderNavItem(item, `general-${i}`))}
          </ul>
        </div>

        <div className="nav_section">
          <p className="section_label">Tools</p>
          <ul className="nav_list">
            {toolsNav.map((item, i) => renderNavItem(item, `tools-${i}`))}
          </ul>
        </div>

        {isDoctor && (
          <div className="nav_section">
            <p className="section_label">Doctor</p>
            <ul className="nav_list">
              <li
                className={`nav_item ${pathname === "/doctor" ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/doctor")}
              >
                <FaUserMd /> <span>My Patients</span>
              </li>
            </ul>
          </div>
        )}

        {isAdmin && (
          <div className="nav_section">
            <p className="section_label">Administration</p>
            <ul className="nav_list">
              <li
                className={`nav_item ${pathname === "/admin" ? "active" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={() => router.push("/admin")}
              >
                <FaUserShield /> <span>User Management</span>
              </li>
            </ul>
          </div>
        )}

        <div className="nav_section">
          <ul className="nav_list">
            <li
              className={`nav_item ${pathname === "/profile" ? "active" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() => router.push("/profile")}
            >
              <FaUserCircle /> <span>My Profile</span>
            </li>
          </ul>
        </div>

        <div className="sidebar_footer">
          <FaCog
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/profile")}
            title="Settings"
          />
          <span
            className="logout_label"
            style={{ cursor: "pointer" }}
            onClick={() => router.push("/profile")}
          >
            Settings
          </span>
          <button onClick={() => signOut({ callbackUrl: "/login" })} title="Logout">
            <FaSignOutAlt />
          </button>
        </div>
      </nav>
    </>
  );
}
