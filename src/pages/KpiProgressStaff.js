import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { getKpis, updateKpi } from "../services/kpiService";
import { uploadEvidenceFile } from "../services/storageService";

import "bootstrap/dist/css/bootstrap.min.css";

function KpiProgressStaff() {
  const { user } = useContext(AuthContext);

  const [assignedKpis, setAssignedKpis] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [fileMap, setFileMap] = useState({});
  const [evidenceMap, setEvidenceMap] = useState({});

  // Fetch kpis
  useEffect(() => {
    const fetchKpis = async () => {
      if (!user) return;

      setLoading(true);
      const data = await getKpis();
      setAssignedKpis(data);
      setLoading(false);
    };

    fetchKpis();
  }, [user]);
  // Status part
  const getStatus = (kpi) => {
    if (kpi.progress === 100) return "Completed";
    if (kpi.progress > 0 && kpi.evidenceText) return "Submitted";
    if (kpi.progress > 0) return "In Progress";
    return "Not Started";
  };
  // Url validation part
  const isValidUrl = (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };
  // Progress update part
  const updateProgress = (id, value) => {
    setAssignedKpis((prev) =>
      prev.map((kpi) =>
        kpi.id === id ? { ...kpi, progress: value } : kpi
      )
    );
  };
  // File input handling part
  const handleFileChange = (id, file) => {
    setFileMap((prev) => ({
      ...prev,
      [id]: file,
    }));
  };
  // Text input handling part
  const handleEvidenceChange = (id, value) => {
    setEvidenceMap((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
// Submit kpi part
  const KpiSubmit = async (id) => {
  const kpi = assignedKpis.find((k) => k.id === id);

  const text = evidenceMap[id];
  const file = fileMap[id];

  let fileUrl = null;

  if (file) {
    fileUrl = await uploadEvidenceFile(file, id);
  }

  if (!text && !fileUrl) {
    setMessage("Please provide evidence.");
    setTimeout(() => setMessage(""), 2500);
    return;
  }

  const updated = {
    ...kpi,
    progress: kpi.progress,
    status: kpi.progress === 100 ? "Completed" : "Submitted",
    evidenceText: text || "",
    evidenceFileUrl: fileUrl || "",
  };

  await updateKpi(id, updated);

  // Updating state part
  setAssignedKpis((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            evidenceText: text || "",
            evidenceFileUrl: fileUrl || "",
            status: updated.status,
          }
        : item
    )
  );

  setEvidenceMap((prev) => ({ ...prev, [id]: "" }));
  setFileMap((prev) => ({ ...prev, [id]: null }));

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

  return (
    <div className="container mt-4">
      <h2>KPI Progress Page</h2>

      {message && <div className="alert alert-info">{message}</div>}

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
                  min="0"
                  max="100"
                  value={kpi.progress || 0}
                  onChange={(e) =>
                    updateProgress(kpi.id, Number(e.target.value))
                  }
                />

                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Evidence link (optional)"
                  value={evidenceMap[kpi.id] || ""}
                  onChange={(e) =>
                    handleEvidenceChange(kpi.id, e.target.value)
                  }
                />

                <input
                  type="file"
                  className="form-control mt-2"
                  onChange={(e) =>
                    handleFileChange(kpi.id, e.target.files[0])
                  }
                />

                <button
                  className="btn btn-primary mt-2 w-100"
                  onClick={() => KpiSubmit(kpi.id)}
                >
                  Submit Evidence
                </button>

                {/* YOUR BADGE (FIXED + INCLUDED PROPERLY) */}
                {(kpi.evidenceText || kpi.evidenceFileUrl) && (
                  <span className="badge bg-success mt-2">
                    Evidence Submitted
                  </span>
                )}

                {/* EVIDENCE DISPLAY */}
                <div className="mt-3">

                  {kpi.evidenceText && (
                    <div>
                      <strong>Link:</strong>{" "}
                      <a href={kpi.evidenceText} target="_blank">
                        Open
                      </a>
                    </div>
                  )}

                  {kpi.evidenceFileUrl && (
                    <div>
                      <strong>File:</strong>{" "}
                      <a href={kpi.evidenceFileUrl} target="_blank">
                        View
                      </a>
                    </div>
                  )}

                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KpiProgressStaff;