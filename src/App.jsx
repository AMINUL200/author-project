import React, { use, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import LandingPage from "./pages/LandingPage";
import ArticlePage from "./pages/ArticlePage";
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import ArticleViewPage from "./pages/ArticleViewPage";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HandleBanner from "./pages/admin/handle landing page/HandleBanner";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import ArticleCategories from "./pages/admin/ArticleCategories";
import AddNewArticle from "./pages/admin/AddNewArticle";
import { useAuth } from "./context/AuthContext";

// Wrappers for protected routes
import { GuestRoute, UserRoute, AdminRoute } from "./routes/ProtectedRoutes";
import AdminViewArticles from "./pages/admin/AdminViewArticles";
import Subscriptions from "./pages/admin/Subscriptions";
import SubscriptionDetails from "./pages/SubscriptionDetails";
import PaymentReturnPage from "./pages/PaymentReturnPage";
import EventsPageTemplate from "./pages/EventsPageTemplate";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { userData, token } = useAuth();

  // useEffect(() => {
  //   toast.info("Toastify test message!", { autoClose: 2000 });
  // }, []);
  // console.log("User Data:", userData);
  // console.log("Token:", token);
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        zIndex={9999}
      />
      <Routes>
        {/* Guest routes */}
        <Route
          path="register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />

        {/* User route */}
        <Route
          path="/"
          element={
            <UserRoute>
              <AppLayout />
            </UserRoute>
          }
        >
          <Route index element={<LandingPage />} />
          <Route path="events/:id" element={<EventsPageTemplate />} />
          <Route path="articles" element={<ArticlePage />} />
          <Route path="articles/:id" element={<ArticleViewPage />} />
          <Route path="/payment-success" element={<PaymentReturnPage />} />
          <Route
            path="subscription-details"
            element={<SubscriptionDetails />}
          />
        </Route>

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="landing-page/banners" element={<HandleBanner />} />
          <Route path="articles/categories" element={<ArticleCategories />} />
          <Route path="articles" element={<AdminViewArticles />} />
          <Route path="articles/new" element={<AddNewArticle />} />
          <Route path="subscriptions" element={<Subscriptions />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
