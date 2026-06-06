import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function RoleRoute({ children, allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== allowedRole) return <Navigate to="/dashboard" replace />;
  return children;
}
