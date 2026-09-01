"use client";

import { FiSearch } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { FaBars, FaTimes } from "react-icons/fa";

interface HeaderProps {
  isMenuOpen: boolean;
  isCollapsed: boolean;
  toggleMenu: () => void;
}

export default function Header({
  isMenuOpen,
  isCollapsed,
  toggleMenu,
}: HeaderProps) {
  return (
    <header className={`top_header ${isCollapsed ? "shifted" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="header_search">
          <FiSearch style={{ color: "#94a3b8", fontSize: 16 }} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="header_right">
        <button className="icon_btn" title="Notifications">
          <IoNotifications />
        </button>
      </div>
    </header>
  );
}
