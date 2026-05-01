import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

// author: amin
// Placeholder je ni
function ManageKPIButton() {
  const navigate = useNavigate();
  return <PrimaryButton text="Manage KPI" onClick={() => navigate("/kpi")} />;
}

export default function Dashboard() {
  return <ManageKPIButton />;
}

