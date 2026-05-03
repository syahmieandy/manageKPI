import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

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
}