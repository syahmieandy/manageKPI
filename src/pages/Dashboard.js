import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Mock data — replace with real data later
const mockKpis = [
  { id: 1, title: "Revenue Growth", progress: 25, status: "In Progress" },
  { id: 2, title: "Customer Retention", progress: 60, status: "In Progress" },
  { id: 3, title: "Website Traffic", progress: 100, status: "Completed with proof" },
];

const chartData = mockKpis.map(k => ({
  name: k.title,
  progress: k.progress,
}));

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Manager View
  if (user?.role === "manager") {
    return (
      <div className="dashboard-container p-4 mb-4">

        <div className="d-flex gap-2 mb-4">
          <PrimaryButton
            text="Manage KPI"
            onClick={() => navigate("/kpi")}
          />
          <PrimaryButton
            text="KPI Assignment & Verification"
            onClick={() => navigate("/kpi-assignment")}
            />
        </div>


        {/*Summary cards */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Total KPIs</h6>
                <h2>{mockKpis.length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">Completed</h6>
                <h2>{mockKpis.filter(k => k.status === "Completed with proof").length}</h2>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h6 className="text-muted">In Progress</h6>
                <h2>{mockKpis.filter(k => k.status === "In Progress").length}</h2>
              </div>
            </div>
          </div>
        </div>

        {/*Bar chart */}
        <div className="card shadow-sm mb-4 p-3">
          <h6 className="mb-3">KPI Progress Overview</h6>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} unit="%" />
              <Tooltip formatter={(value) => `${value}%`} />
              <Bar dataKey="progress" fill="#0d6efd" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/*Per KPI progress bars */}
        <div className="card shadow-sm mb-4 p-3">
          <h6 className="mb-3">Individual KPI Progress</h6>
          {mockKpis.map(kpi => (
            <div key={kpi.id} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>{kpi.title}</span>
                <span>{kpi.progress}%</span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${kpi.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      

      </div>
    );
  }

  // 2. Staff View
  if (user?.role === "staff") {
    return (
      <div className="dashboard-container p-4">
        
        <div className="d-flex gap-2 mb-4">
          <PrimaryButton
            text="Update KPI Progress"
            onClick={() => navigate("/staff-kpi")}
          />
        </div>

        {/*Staff KPI progress bars */}
        <div className="card shadow-sm mb-4 p-3">
          <h6 className="mb-3">My KPI Progress</h6>
          {mockKpis.map(kpi => (
            <div key={kpi.id} className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>{kpi.title}</span>
                <span>{kpi.progress}%</span>
              </div>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${kpi.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // 3. Fallback
  return null;
}