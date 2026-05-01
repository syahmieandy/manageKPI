import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import CommonModal from "../components/CommonModal";

// Mock Data (sementara saja)
const mockKpis = [
  {
    id: 1,
    title: "Revenue Growth",
    description: "Increase monthly recurring revenue",
    objective: "Grow sales pipeline",
    target: 15,
    deadline: "2026-06-30",
  },
  {
    id: 2,
    title: "Customer Retention",
    description: "Improve customer retention rate",
    objective: "Reduce churn",
    target: 90,
    deadline: "2026-09-30",
  },
  {
    id: 3,
    title: "Website Traffic",
    description: "Increase organic traffic",
    objective: "SEO improvement",
    target: 50000,
    deadline: "2026-12-31",
  },
];

function CreateKPIForm({ onSubmit, editingKPI }) {
  const [form, setForm] = useState({
    title: editingKPI?.title || "",
    description: editingKPI?.description || "",
    objective: editingKPI?.objective || "",
    target: editingKPI?.target || "",
    deadline: editingKPI?.deadline || "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
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
          <label className="form-label">Objective</label>
          <input
            className="form-control"
            name="objective"
            value={form.objective}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Target (%)</label>
          <input
            className="form-control"
            name="target"
            type="number"
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
            value={form.deadline}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}

function CreateKPIModal({ setModalOpen, onSubmit, editingKpi }) {
  return (
    <CommonModal
      modalTitle={editingKpi ? "Edit KPI" : "Create KPI"}
      onClose={() => setModalOpen(false)}
    >
      <CreateKPIForm onSubmit={onSubmit} editingKPI={editingKpi} />
    </CommonModal>
  );
}

export default function KPI() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [kpis, setKpis] = useState(mockKpis);
  const [editingKPI, setEditingKPI] = useState(null);

  function onSave(data) {
    if (editingKPI) {
      setKpis(
        kpis.map((kpi) =>
          kpi.id === editingKPI.id ? { ...kpi, ...data } : kpi,
        ),
      );
      setEditingKPI(null);
    } else {
      setKpis([...kpis, { id: Date.now(), ...data }]);
    }
  }

  /* DELETE */
  function deleteKPI(id) {
    setKpis(kpis.filter((kpi) => kpi.id !== id));
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
        />
      )}

      {/* Table */}
      <table className="table table-bordered mt-4">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Objective</th>
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
              <td>{kpi.objective}</td>
              <td>{kpi.target}%</td>
              <td>{kpi.deadline}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* End Table */}
    </>
  );
}
