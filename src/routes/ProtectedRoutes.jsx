import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// ✅ Show loader while checking auth
const LoadingScreen = () => (
  <div className="flex items-center justify-center min-h-screen">
    <p className="text-lg font-semibold">Loading...</p>
  </div>
);

// For login/register -> redirect if already logged in
export const GuestRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return token ? <Navigate to="/" replace /> : children;
};

// For user routes (public, but admin can't access)
export const UserRoute = ({ children }) => {
  const { userData, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // If logged in as admin → block user routes
  if (userData?.user_type === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

// For admin routes
export const AdminRoute = ({ children }) => {
  const { userData, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (!userData || userData.user_type !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};
