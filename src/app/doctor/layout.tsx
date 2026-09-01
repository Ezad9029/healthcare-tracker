"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && (session?.user as { role?: string })?.role !== "doctor") router.push("/dashboard");
  }, [status, session, router]);

  const toggleMenu = () => {
    if (window.innerWidth > 1024) setIsCollapsed(!isCollapsed);
    else setIsMenuOpen(!isMenuOpen);
  };

  if (status === "loading") return <div className="loading_page"><div className="spinner" /></div>;
  if (!session) return null;

  return (
    <div className="app_layout">
      <Sidebar isOpen={isMenuOpen} isCollapsed={isCollapsed} />
      <div className={`main_area ${isCollapsed ? "sidebar_collapsed" : ""}`}>
        <Header isMenuOpen={isMenuOpen} isCollapsed={isCollapsed} toggleMenu={toggleMenu} />
        <main className="main_content">{children}</main>
      </div>
    </div>
  );
}
