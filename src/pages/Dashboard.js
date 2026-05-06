import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

<<<<<<< HEAD
// author: amin
// Placeholder je ni
function ManageKPIButton() {
  const navigate = useNavigate();
  return <PrimaryButton text="Manage KPI" onClick={() => navigate("/kpi")} />;
}

function KPIAssignmentButton() {
  const navigate = useNavigate();
  return <PrimaryButton text="KPI Assignment & Verification" onClick={() => navigate("/kpi-assignment")} />;
}

export default function Dashboard() {
  return (
    <div>
      <ManageKPIButton />
      <KPIAssignmentButton />
    </div>
  );
=======
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
>>>>>>> f0c4421b8c0a024460f45fc91c011f5a9476d423
}