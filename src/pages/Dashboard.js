import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Manager View
  if (user?.role === "manager") {
    return (
      <div className="dashboard-container">
        <PrimaryButton
          text="Manage KPI"
          onClick={() => navigate("/kpi")}
        />
        {/* Integrated Amin's assignment button inside the manager check */}
        <PrimaryButton 
          text="KPI Assignment & Verification" 
          onClick={() => navigate("/kpi-assignment")} 
        />
      </div>
    );
  }

  // 2. Staff View: Keeps the progress update focus
  if (user?.role === "staff") {
    return (
      <div className="dashboard-container">
        <PrimaryButton
          text="Update KPI Progress"
          onClick={() => navigate("/staff-kpi")}
        />
      </div>
    );
  }

  // 3. Fallback: For unauthorized users or loading states
  return null;
}