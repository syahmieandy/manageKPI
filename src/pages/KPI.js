export default function KPI() {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6">
          <h2 className="mb-4">Create KPI</h2>

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
      </div>
    </div>
  );
}
