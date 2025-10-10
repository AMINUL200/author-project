import React, { useState } from "react";
import {
  Menu,
  X,
  Home,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Settings,
  ChevronDown,
  Bell,
  User,
  Search,
  LogOut,
  CardSim,
  SubscriptIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({
  isCollapsed,
  onMouseEnter,
  onMouseLeave,
  isHovered,
  isMobile,
  isMobileSidebarOpen,
  onCloseMobileSidebar,
}) => {
  const location = useLocation();
  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/admin" },
    { icon: User, label: "Profile", path: "/admin/profile" },

    {
      icon: ShoppingCart,
      label: "Manage Landing Page",
      path: "/admin/landing-page",
      submenu: [
        { label: "Banners", path: "/admin/landing-page/banners" },
        { label: "Feedback", path: "/admin/landing-page/feedback" },
        { label: "AuthorBio", path: "/admin/landing-page/author-bio" },
        { label: "Published Book", path: "/admin/landing-page/published-book" },
      ],
    },
    {
      icon: ShoppingCart,
      label: "Manage Events",
      path: "/admin/landing-page",
      submenu: [{ label: "Events", path: "/admin/landing-page/event-list" }],
    },
    {
      icon: User,
      label: "Section Title",
      path: "/admin/landing-page/section-title",
    },
    {
      icon: User,
      label: " Book Section Title",
      path: "/admin/landing-page/article-section-title",
    },
    {
      icon: User,
      label: " Book Review",
      path: "/admin/landing-page/book-review",
    },
    {
      icon: User,
      label: "Contact Section",
      path: "/admin/landing-page/contact",
    },
    {
      icon: ShoppingCart,
      label: "Manage Feature Book",
      path: "/admin/landing-page",
      submenu: [
        { label: "Feature Book", path: "/admin/landing-page/feature-book" },
      ],
    },
    // {
    //   icon: ShoppingCart,
    //   label: "Manage Articles",
    //   path: "/admin/articles",
    //   submenu: [
    //     { label: "All Articles", path: "/admin/articles" },
    //     { label: "Add Article Categories", path: "/admin/articles/categories" },
    //     { label: "Add New Article", path: "/admin/articles/new" },
    //   ],
    // },
    {
      icon: SubscriptIcon,
      label: "Subscriptions",
      path: "/admin/subscriptions",
    },
  ];

  const [openSubmenu, setOpenSubmenu] = useState(null);

  // Determine if sidebar should show text
  const shouldShowText = isMobile
    ? isMobileSidebarOpen && isHovered // On mobile: only show text when open AND hovered
    : !isCollapsed || isHovered; // On desktop: show text when not collapsed OR hovered

  // Determine sidebar visibility and width
  const getSidebarClasses = () => {
    if (isMobile) {
      if (!isMobileSidebarOpen) {
        return "w-0 -translate-x-full"; // Completely hidden
      } else if (isHovered) {
        return "w-64"; // Full width when hovered
      } else {
        return "w-16"; // Icon only when open but not hovered
      }
    } else {
      // Desktop behavior
      return isCollapsed && !isHovered ? "w-16" : "w-64";
    }
  };

  // Function to check if a path is active
  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Function to check if any submenu item is active
  const hasActiveSubmenu = (submenu) => {
    return submenu?.some((item) => location.pathname === item.path);
  };

  // Handle menu item click
  const handleMenuClick = (item, index, event) => {
    // If item has submenu, toggle it
    if (item.submenu) {
      event.preventDefault();
      setOpenSubmenu(openSubmenu === index ? null : index);
    } else {
      // Close mobile sidebar when clicking on a menu item
      if (isMobile && isMobileSidebarOpen) {
        onCloseMobileSidebar();
      }
    }
  };

  // Handle submenu item click
  const handleSubmenuClick = () => {
    if (isMobile && isMobileSidebarOpen) {
      onCloseMobileSidebar();
    }
  };

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-30 transition-all duration-300 ${getSidebarClasses()}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-4 overflow-y-auto">
          <nav className="space-y-1 px-2">
            {menuItems.map((item, index) => (
              <div key={index}>
                {/* Main menu item */}
                {item.submenu ? (
                  // Item with submenu - use div with click handler
                  <div
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 cursor-pointer group transition-colors ${
                      isActivePath(item.path) || hasActiveSubmenu(item.submenu)
                        ? "bg-blue-50"
                        : ""
                    } ${openSubmenu === index ? "bg-gray-50" : ""}`}
                    onClick={(event) => handleMenuClick(item, index, event)}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <item.icon
                        size={20}
                        className={`flex-shrink-0 ${
                          isActivePath(item.path) ||
                          hasActiveSubmenu(item.submenu)
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      />
                      {shouldShowText && (
                        <span
                          className={`font-medium truncate ${
                            isActivePath(item.path) ||
                            hasActiveSubmenu(item.submenu)
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>
                    {shouldShowText && (
                      <ChevronDown
                        size={16}
                        className={`text-gray-400 transition-transform ${
                          openSubmenu === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </div>
                ) : (
                  // Item without submenu - use Link
                  <Link
                    to={item.path}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-100 cursor-pointer group transition-colors ${
                      isActivePath(item.path) ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleMenuClick(item, index, {})}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <item.icon
                        size={20}
                        className={`flex-shrink-0 ${
                          isActivePath(item.path)
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      />
                      {shouldShowText && (
                        <span
                          className={`font-medium truncate ${
                            isActivePath(item.path)
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>
                  </Link>
                )}

                {/* Submenu */}
                {item.submenu && shouldShowText && (
                  <div
                    className={`ml-8 mt-1 space-y-1 transition-all duration-200 overflow-hidden ${
                      openSubmenu === index
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                          isActivePath(subItem.path)
                            ? "bg-blue-100 text-blue-800 font-medium"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                        }`}
                        onClick={handleSubmenuClick}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
