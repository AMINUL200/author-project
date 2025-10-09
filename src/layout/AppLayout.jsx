import React, { useEffect, useState } from "react";
import Navbar from "../cmponent/common/Navbar";
import { Outlet } from "react-router-dom";
import axios from "axios";

const AppLayout = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [navData, setNavData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // // 🔹 Fetch Navbar data once when AppLayout mounts
  // useEffect(() => {
  //   const fetchNavData = async () => {
  //     try {
  //       const res = await axios.get(`${apiUrl}sections`);
  //       console.log("navbar:: ", res.data.data);
        
  //       setNavData(response.data.data);
  //     } catch (err) {
  //       setError("Failed to load navbar data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchNavData();
  // }, []);

  return (
    <>
      <Navbar  />
      <main className="min-h-screen min-w-full bg-gray-50">
        <Outlet />
      </main>
    </>
  );
};

export default AppLayout;
