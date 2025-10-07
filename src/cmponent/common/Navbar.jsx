// components/common/Navbar.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { token, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                </div>
                <div className="ml-3">
                  <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    AuthorSpace
                  </span>
                  <div className="text-xs text-gray-500 font-medium">
                    Digital Manuscripts
                  </div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => scrollToSection("home")}
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg hover:text-indigo-600 transition-all duration-300 hover:bg-gray-50 group"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg hover:text-indigo-600 transition-all duration-300 hover:bg-gray-50 group"
              >
                <span className="relative z-10">About</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={() => scrollToSection("latest")}
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg hover:text-indigo-600 transition-all duration-300 hover:bg-gray-50 group"
              >
                <span className="relative z-10">Latest Articles</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => scrollToSection("popular")}
                className="relative px-4 py-2 text-gray-700 font-medium rounded-lg hover:text-indigo-600 transition-all duration-300 hover:bg-gray-50 group"
              >
                <span className="relative z-10">Most Viewed</span>
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>

              <div className="h-6 w-px bg-gray-200 mx-2"></div>

              {token ? (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      logout();
                      toast.info("logout Success Full");
                    }}
                    className="relative px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 
      bg-gradient-to-r from-red-600 to-pink-600 text-white hover:shadow-lg hover:shadow-red-500/25 
      transform hover:scale-105 cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm9.707 5.293a1 1 0 010 1.414L10.414 13H17a1 1 0 110 2h-6.586l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Logout
                    </span>
                  </button>
                  {/* <Link
                    to="/subscription-details"
                    className="relative px-6 py-2.5 font-semibold rounded-xl transition-all duration-300
    bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white 
    hover:shadow-lg hover:shadow-pink-500/25 transform hover:scale-105 cursor-pointer
    flex items-center justify-center overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 8c-1.657 0-3 1.343-3 3v5h6v-5c0-1.657-1.343-3-3-3z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 20h14a2 2 0 002-2v-2H3v2a2 2 0 002 2z"
                        />
                      </svg>
                      Subscription
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl"></span>
                  </Link> */}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="relative px-6 py-2.5 font-semibold rounded-xl transition-all duration-300 
      bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25 
      transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                    </svg>
                    Login
                  </span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-300"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden bg-white/95 backdrop-blur-md border-t border-gray-100`}
        >
          <div className="px-4 py-6 space-y-2">
            <button
              onClick={() => scrollToSection("latest")}
              className="flex items-center w-full px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Latest Articles
            </button>

            <button
              onClick={() => scrollToSection("popular")}
              className="flex items-center w-full px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              Most Viewed
            </button>

            <button
              onClick={() => scrollToSection("about")}
              className="flex items-center w-full px-4 py-3 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-300 group"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              About
            </button>

            <div className="pt-4 border-t border-gray-100">
              {token ? (
                <button
                  onClick={() => {
                    logout();
                    toast.info("Logout Success full");
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center justify-center w-full px-4 py-3 
        bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold 
        rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 4a1 1 0 011-1h6a1 1 0 110 2H5v10h5a1 1 0 110 2H4a1 1 0 01-1-1V4zm9.707 5.293a1 1 0 010 1.414L10.414 13H17a1 1 0 110 2h-6.586l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center w-full px-4 py-3 
        bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold 
        rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                  </svg>
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;
