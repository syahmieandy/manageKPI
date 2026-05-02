import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // manager gets kpi management page
  if (user?.role === "manager") {
    return (
      <PrimaryButton
        text="Manage KPI"
        onClick={() => navigate("/kpi")}
      />
    );
  }

  if (user?.role === "staff") {
    return (
      <PrimaryButton
        text="Update KPI Progress"
        onClick={() => navigate("/staff-kpi")}
      />
    );
  }

  return null;
}