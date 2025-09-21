import React, { useState, useEffect } from "react";

import AdminNavbar from "../cmponent/admin/AdminNavbar";
import AdminSidebar from "../cmponent/admin/AdminSidebar";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
        setIsMobileSidebarOpen(false); // Close mobile sidebar on resize
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleMouseEnter = () => {
    if (isSidebarCollapsed && (isMobileSidebarOpen || !isMobile)) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer zIndex={9999} />
      <AdminNavbar
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        isHovered={isHovered}
        isMobile={isMobile}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onCloseMobileSidebar={closeMobileSidebar}
      />
      
      <main
        className={`pt-16 pl-2 transition-all duration-300 ${
          isMobile 
            ? "ml-0" // No margin on mobile
            : isSidebarCollapsed && !isHovered 
              ? "ml-16" 
              : "ml-64"
        }`}
      >
        <Outlet />
      </main>

      {/* Mobile overlay - only show when mobile sidebar is open */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20"
          onClick={closeMobileSidebar}
        />
      )}
    </div>
  );
};

export default AdminLayout;