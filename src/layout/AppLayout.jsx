import React from "react";
import Navbar from "../cmponent/common/Navbar";
import { Outlet } from "react-router-dom";
// import { ToastContainer } from "react-toastify";

const AppLayout = () => {
  return (
    <>
      {/* <ToastContainer zIndex={9999} /> */}
      <Navbar />
      <main className="min-h-screen min-w-full bg-gray-50">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
