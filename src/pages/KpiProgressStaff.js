import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

function KpiProgressStaff() {
  const [assignedKpis, setAssignedKpis] = useState([
    // for now, using temporary sample data because backend is not ready
    {
      id: 1,
      title: "Revenue Growth",
      description: "Increase monthly recurring revenue",
      deadline: "2026-06-30",
      progress: 25,
      evidence: "",
      status: "In Progress",
    },
    {
      id: 2,
      title: "Customer Retention",
      description: "Improve customer retention rate",
      deadline: "2026-09-30",
      progress: 60,
      evidence: "",
      status: "In Progress",
    },
    {
      id: 3,
      title: "Website Traffic",
      description: "Increase organic traffic",
      deadline: "2026-12-31",
      progress: 10,
      evidence: "",
      status: "In Progress",
    },
  ]);

  const [message, setMessage] = useState("");

  const ProgressUpdate = (id, newProgress) => {
    const progressNumber = Number(newProgress);

    // to prevent invalid values like below 0 or above 100
    if (progressNumber < 0 || progressNumber > 100) {
      return;
    }

    setAssignedKpis(
      assignedKpis.map((kpi) => {
        if (kpi.id === id) {
          return {
            ...kpi,
            progress: progressNumber,
            status:
              kpi.status === "Completed with proof"
                ? "Completed with proof"
                : kpi.status === "Submitted"
                  ? "Submitted"
                  : progressNumber === 100
                    ? "Completed"
                    : "In Progress",
          };
        }
        return kpi;
      }),
    );
  };

  const EvidenceUpdate = (id, evidenceValue) => {
    setAssignedKpis(
      assignedKpis.map((kpi) => {
        if (kpi.id === id) {
          return {
            ...kpi,
            evidence: evidenceValue,
          };
        }
        return kpi;
      }),
    );
  };

  const KpiSubmit = (id) => {
    const selectedKpi = assignedKpis.find((kpi) => kpi.id === id);

    if (!selectedKpi.evidence.trim()) {
      alert("Enter evidence before submitting.");
      return;
    }
    setAssignedKpis(
      assignedKpis.map((kpi) => {
        if (kpi.id === id) {
          return {
            ...kpi,
            status:
              selectedKpi.progress === 100
                ? "Completed with proof"
                : "Submitted",
          };
        }
        return kpi;
      }),
    );
    setMessage("KPI submitted successfully!");
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="container mt-4">
      <h2>KPI Progress Page</h2>
      <p className="text-muted">
        Staff can check assigned KPIs, update their progress, and submit
        evidence.
      </p>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="row">
        {assignedKpis.map((kpi) => (
          <div className="col-md-6 mb-3" key={kpi.id}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{kpi.title}</h5>
                <p className="card-text">{kpi.description}</p>

                <p>
                  <strong>Deadline:</strong> {kpi.deadline}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      kpi.status === "Completed with proof"
                        ? "badge bg-success"
                        : kpi.status === "Completed"
                          ? "badge bg-info text-dark"
                          : kpi.status === "Submitted"
                            ? "badge bg-secondary"
                            : "badge bg-primary"
                    }
                  >
                    {kpi.status}
                  </span>
                </p>

                <label className="form-label">Progress: {kpi.progress}%</label>

                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  value={kpi.progress}
                  onChange={(event) =>
                    ProgressUpdate(kpi.id, event.target.value)
                  }
                />

                <label className="form-label">Evidence Link</label>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Paste evidence link here"
                  value={kpi.evidence}
                  onChange={(event) =>
                    EvidenceUpdate(kpi.id, event.target.value)
                  }
                />

                <button
                  className="btn btn-primary"
                  onClick={() => KpiSubmit(kpi.id)}
                  disabled={
                    kpi.status === "Submitted" ||
                    kpi.status === "Completed with proof" ||
                    !kpi.evidence.trim()
                  }
                >
                  {kpi.status === "Submitted" ||
                  kpi.status === "Completed with proof"
                    ? "Submitted"
                    : "Submit Evidence"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KpiProgressStaff;
