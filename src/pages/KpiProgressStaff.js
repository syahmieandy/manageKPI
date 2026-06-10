import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getKpis, updateKpi } from "../services/kpiService";

import "bootstrap/dist/css/bootstrap.min.css";

function KpiProgressStaff() {
  const { user } = useContext(AuthContext);

  const [assignedKpis, setAssignedKpis] = useState([]);
  const [evidenceMap, setEvidenceMap] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetching kpi from firebase
  useEffect(() => {
    const fetchKpis = async () => {
      if (!user) return;

      setLoading(true);

      const data = await getKpis();

      const cleaned = data.map((kpi) => {
        const { evidence, ...rest } = kpi;
        return rest;
      });

      setAssignedKpis(cleaned);

      setLoading(false);
    };

    fetchKpis();
  }, [user]);

  // Status part of kpiprogress
  const getStatus = (kpi) => {
    if (kpi.status) return kpi.status;
    if (kpi.progress === 100) return "Completed";
    if (kpi.progress > 0) return "In Progress";
    return "Not Started";
  };

  // Evidence url check of kpiprogress
  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  // Progress update of kpiprogress
  const ProgressUpdate = async (id, value) => {
    const kpi = assignedKpis.find((k) => k.id === id);

    const updated = {
      ...kpi,
      progress: value,
    };

    await updateKpi(id, updated);
  };

  // Evidence handling of kpiprogress
  const handleEvidenceChange = (id, value) => {
    setEvidenceMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Submit part of kpiprogress
  const KpiSubmit = async (id) => {
    const kpi = assignedKpis.find((k) => k.id === id);
    const evidence = evidenceMap[id];

    if (!evidence || !evidence.trim()) {
      setMessage("Please enter evidence before submitting.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    if (!isValidUrl(evidence)) {
      setMessage("Invalid URL format.");
      setTimeout(() => setMessage(""), 2500);
      return;
    }

    const updated = {
      ...kpi,
      status: kpi.progress === 100 ? "Completed" : "Submitted",
      progress: kpi.progress,
    };

    await updateKpi(id, updated);

    setEvidenceMap((prev) => ({
      ...prev,
      [id]: "",
    }));

    setMessage("✔ KPI submitted successfully");
    setTimeout(() => setMessage(""), 2500);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  // All UI Code
  return (
    <div className="container mt-4">
      <h2>KPI Progress Page</h2>

      {message && (
        <div className="alert alert-info">{message}</div>
      )}

      <div className="row">
        {assignedKpis.map((kpi) => (
          <div className="col-md-6 mb-3" key={kpi.id}>
            <div className="card shadow-sm">
              <div className="card-body">

                <h5>{kpi.title}</h5>

                <p>Status: {getStatus(kpi)}</p>

                <label>Progress: {kpi.progress}%</label>

                <input
                  type="range"
                  className="form-range"
                  min="0"
                  max="100"
                  value={kpi.progress || 0}
                  onChange={(e) => {
                    const value = Number(e.target.value);

                    setAssignedKpis((prev) =>
                      prev.map((item) =>
                        item.id === kpi.id
                          ? { ...item, progress: value }
                          : item
                      )
                    );
                  }}
                  onMouseUp={() =>
                    ProgressUpdate(kpi.id, kpi.progress)
                  }
                />

                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Evidence link"
                  value={evidenceMap[kpi.id] || ""}
                  onChange={(e) =>
                    handleEvidenceChange(kpi.id, e.target.value)
                  }
                />

                <button
                  className="btn btn-primary mt-2 w-100"
                  onClick={() => KpiSubmit(kpi.id)}
                >
                  Submit Evidence
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