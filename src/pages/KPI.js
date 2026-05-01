import { useState } from "react";
import PrimaryButton from "../components/PrimaryButton";
import CommonModal from "../components/CommonModal";

function CreateKPIForm() {
  return (
    <div className="container">
      <h2 className="h2">Create KPI</h2>
      <form>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" type="text" />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows="4"></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Objective</label>
          <input className="form-control" type="text" />
        </div>

        <div className="mb-3">
          <label className="form-label">Target (%)</label>
          <input className="form-control" type="number" />
        </div>

        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input className="form-control" type="date" />
        </div>
      </form>
    </div>
  );
}

function CreateKPIModal({setModalOpen}) {
  return (
    <CommonModal
      modalTitle="Create KPI"
      children={<CreateKPIForm />}
      onClose={() => setModalOpen(false)}
      onSubmit={() => setModalOpen(false)}
    />
  );
}

export default function KPI() {
  const [isModalOpen, setModalOpen] = useState(false);
  return (
    <>
      <PrimaryButton text="Create KPI +" onClick={() => setModalOpen(true)} />
      {isModalOpen && <CreateKPIModal setModalOpen={setModalOpen} />}
    </>
  );
}
