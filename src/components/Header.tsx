"use client";

import { useState, useRef, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { IoNotifications } from "react-icons/io5";
import { FaBars, FaTimes } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface HeaderProps {
  isMenuOpen: boolean;
  isCollapsed: boolean;
  toggleMenu: () => void;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "1", title: "Appointment Reminder", message: "You have an appointment tomorrow at 10:00 AM", time: "2h ago", read: false },
  { id: "2", title: "Health Check Due", message: "Your annual check-up is due next week", time: "1d ago", read: false },
  { id: "3", title: "Prescription Ready", message: "Your prescription is ready for pickup", time: "3d ago", read: true },
];

export default function Header({
  isMenuOpen,
  isCollapsed,
  toggleMenu,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSearchResults(true);
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <header className={`top_header ${isCollapsed ? "shifted" : ""}`}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button className="hamburger" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="header_search" ref={searchRef} style={{ position: "relative" }}>
          <FiSearch style={{ color: "#94a3b8", fontSize: 16 }} />
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              onFocus={() => searchQuery && setShowSearchResults(true)}
            />
          </form>
          {showSearchResults && searchQuery && (
            <div className="search_dropdown">
              <div className="search_results">
                <p className="search_hint">Search for &quot;{searchQuery}&quot;</p>
                <button
                  className="search_result_item"
                  onClick={() => {
                    router.push("/dashboard");
                    setShowSearchResults(false);
                    setSearchQuery("");
                  }}
                >
                  Go to Dashboard
                </button>
                <button
                  className="search_result_item"
                  onClick={() => {
                    router.push("/profile");
                    setShowSearchResults(false);
                    setSearchQuery("");
                  }}
                >
                  Go to Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="header_right">
        <div style={{ position: "relative" }} ref={notifRef}>
          <button
            className="icon_btn"
            title="Notifications"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <IoNotifications />
            {unreadCount > 0 && (
              <span className="notif_badge">{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <div className="notif_dropdown">
              <div className="notif_header">
                <h4>Notifications</h4>
                {unreadCount > 0 && (
                  <button className="mark_read_btn" onClick={markAllRead}>
                    Mark all read
                  </button>
                )}
              </div>
              <div className="notif_list">
                {notifications.length === 0 ? (
                  <p className="empty_msg">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notif_item ${!notif.read ? "unread" : ""}`}
                      onClick={() => markAsRead(notif.id)}
                    >
                      <div className="notif_title">{notif.title}</div>
                      <div className="notif_message">{notif.message}</div>
                      <div className="notif_time">{notif.time}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
