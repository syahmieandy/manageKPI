import { useState, useEffect } from "react";
import PrimaryButton from "../components/PrimaryButton";
import CommonModal from "../components/CommonModal";
import {
  createKpi,
  updateKpi,
  getKpis,
  deleteKpi,
  subscribeKpi,
} from "../services/kpiService";
import useAuth from "../hooks/useAuth";

function CreateKPIForm({ onSubmit, editingKPI, createdBy, loading }) {
  const [form, setForm] = useState({
    title: editingKPI?.title || "",
    description: editingKPI?.description || "",
    target: editingKPI?.target || "",
    deadline: editingKPI?.deadline || "",
  });

  const today = new Date().toISOString().split("T")[0];

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({ ...form, createdBy: createdBy });
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            className="form-control"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Target (%)</label>
          <input
            className="form-control"
            name="target"
            type="number"
            min="1"
            max="100"
            value={form.target}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input
            className="form-control"
            name="deadline"
            type="date"
            min={today}
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </button>
      </form>
    </div>
  );
}

function CreateKPIModal({
  setModalOpen,
  onSubmit,
  editingKpi,
  createdBy,
  loading,
}) {
  return (
    <CommonModal
      modalTitle={editingKpi ? "Edit KPI" : "Create KPI"}
      onClose={() => setModalOpen(false)}
    >
      <CreateKPIForm
        onSubmit={onSubmit}
        editingKPI={editingKpi}
        createdBy={createdBy}
        loading={loading}
      />
    </CommonModal>
  );
}

export default function KPI() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [kpis, setKpis] = useState([]);
  const [editingKPI, setEditingKPI] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeKpi((data) => {
      console.log("Real-time update received:", data);
      setKpis(data);
    });

    return () => unsubscribe();
  }, []);

  async function onSave(data) {
    setIsSaving(true);
    try {
      if (editingKPI) {
        const targetKpi = kpis.find((kpi) => kpi.id === editingKPI.id);
        if (targetKpi) {
          await updateKpi(targetKpi.id, data);
        }
        setEditingKPI(null);
        setModalOpen(false);
      } else {
        const id = await createKpi(data);
        setModalOpen(false);
      }
    } finally {
      setIsSaving(false);
    }
  }

  /* DELETE */
  async function deleteKPI(id) {
    await deleteKpi(id);
  }

  /* EDIT */
  function editKPI(kpi) {
    setEditingKPI(kpi);
    setModalOpen(true);
  }

  return (
    <>
      <PrimaryButton
        text="Create KPI +"
        onClick={() => {
          setEditingKPI(null);
          setModalOpen(true);
        }}
      />
      {isModalOpen && (
        <CreateKPIModal
          setModalOpen={setModalOpen}
          onSubmit={onSave}
          editingKpi={editingKPI}
          createdBy={user.name}
          loading={isSaving}
        />
      )}

      {/* Table */}
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Created By</th>
            <th>Target</th>
            <th>Deadline</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {kpis.map((kpi) => (
            <tr key={kpi.id}>
              <td>{kpi.title}</td>
              <td>{kpi.description}</td>
              <td>{kpi.createdBy}</td>
              <td>{kpi.target}%</td>
              <td>{kpi.deadline}</td>
              <td>
                {user.name == kpi.createdBy ? (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editKPI(kpi)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteKPI(kpi.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => editKPI(kpi)}
                      disabled={true}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteKPI(kpi.id)}
                      disabled={true}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* End Table */}
    </>
  );
}
