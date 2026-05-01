import { useNavigate } from "react-router-dom";

// author: amin
// Placeholder je ni
function ManageKPIButton() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/kpi")}
      type="button"
      className="btn-primary"
    >
      Manage KPI
    </button>
  );
}

export default function Dashboard() {
  return <ManageKPIButton />;
}

