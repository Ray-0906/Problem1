import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout({ allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  const isAuthorized = token && allowedRoles.includes(userRole);

  if (!isAuthorized) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
