import { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  Alert,
  Tab,
  Tabs,
} from "react-bootstrap";
import CommonModal from "../components/CommonModal";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const mockStaff = [
  { uid: "s1", name: "Ahmad Faris", email: "faris@example.com", role: "staff" },
  { uid: "s2", name: "Nur Izzati", email: "izzati@example.com", role: "staff" },
  { uid: "s3", name: "Haziq Ariff", email: "haziq@example.com", role: "staff" },
];

const mockKpis = [
  { id: 1, title: "Revenue Growth", target: 15, deadline: "2026-06-30" },
  { id: 2, title: "Customer Retention", target: 90, deadline: "2026-09-30" },
  { id: 3, title: "Website Traffic", target: 50000, deadline: "2026-12-31" },
];

const mockAssignments = [
  {
    id: "a1",
    kpiId: 1,
    kpiTitle: "Revenue Growth",
    kpiTarget: 15,
    kpiDeadline: "2026-06-30",
    staffUid: "s1",
    staffName: "Ahmad Faris",
    assignedAt: "2026-04-01",
    status: "pending",      // pending | submitted | approved | rejected
    progress: null,
    evidence: null,
    submittedAt: null,
    managerComment: "",
  },
  {
    id: "a2",
    kpiId: 2,
    kpiTitle: "Customer Retention",
    kpiTarget: 90,
    kpiDeadline: "2026-09-30",
    staffUid: "s2",
    staffName: "Nur Izzati",
    assignedAt: "2026-04-05",
    status: "submitted",
    progress: 82,
    evidence: "Attached monthly churn report showing 82% retention rate achieved through targeted follow-up campaigns.",
    submittedAt: "2026-04-28",
    managerComment: "",
  },
  {
    id: "a3",
    kpiId: 3,
    kpiTitle: "Website Traffic",
    kpiTarget: 50000,
    kpiDeadline: "2026-12-31",
    staffUid: "s3",
    staffName: "Haziq Ariff",
    assignedAt: "2026-04-10",
    status: "approved",
    progress: 55000,
    evidence: "Google Analytics export — organic sessions reached 55,243 in Q1.",
    submittedAt: "2026-04-25",
    managerComment: "Excellent work! Exceeded target by 10%. Keep it up.",
  },
];

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_META = {
  pending:   { label: "Pending",   bg: "warning",  text: "dark" },
  submitted: { label: "Submitted", bg: "info",     text: "dark" },
  approved:  { label: "Approved",  bg: "success",  text: "light" },
  rejected:  { label: "Rejected",  bg: "danger",   text: "light" },
};

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.pending;
  return (
    <Badge
      bg={meta.bg}
      text={meta.text}
      className="px-2 py-1"
      style={{ fontSize: "0.72rem", letterSpacing: "0.04em" }}
    >
      {meta.label}
    </Badge>
  );
}

// ─── Assign KPI Modal ─────────────────────────────────────────────────────────

function AssignKPIModal({ onClose, onAssign }) {
  const [form, setForm] = useState({ kpiId: "", staffUid: "" });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!form.kpiId || !form.staffUid) {
      setError("Please select both a KPI and a staff member.");
      return;
    }
    const kpi = mockKpis.find((k) => k.id === Number(form.kpiId));
    const staff = mockStaff.find((s) => s.uid === form.staffUid);
    onAssign({
      id: `a${Date.now()}`,
      kpiId: kpi.id,
      kpiTitle: kpi.title,
      kpiTarget: kpi.target,
      kpiDeadline: kpi.deadline,
      staffUid: staff.uid,
      staffName: staff.name,
      assignedAt: new Date().toISOString().split("T")[0],
      status: "pending",
      progress: null,
      evidence: null,
      submittedAt: null,
      managerComment: "",
    });
    onClose();
  };

  return (
    <CommonModal modalTitle="Assign KPI to Staff" onClose={onClose}>
      {error && <Alert variant="danger" className="py-2">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label style={{ color: "var(--text-dark)", fontWeight: 500 }}>
          Select KPI
        </Form.Label>
        <Form.Select
          value={form.kpiId}
          onChange={(e) => setForm({ ...form, kpiId: e.target.value })}
          style={{ borderColor: "var(--border)" }}
        >
          <option value="">— Choose a KPI —</option>
          {mockKpis.map((k) => (
            <option key={k.id} value={k.id}>
              {k.title} (Target: {k.target}%)
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ color: "var(--text-dark)", fontWeight: 500 }}>
          Assign To
        </Form.Label>
        <Form.Select
          value={form.staffUid}
          onChange={(e) => setForm({ ...form, staffUid: e.target.value })}
          style={{ borderColor: "var(--border)" }}
        >
          <option value="">— Choose a staff member —</option>
          {mockStaff.map((s) => (
            <option key={s.uid} value={s.uid}>
              {s.name} ({s.email})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button
        variant="primary"
        className="w-100"
        onClick={handleSubmit}
      >
        Assign KPI
      </Button>
    </CommonModal>
  );
}

// ─── Review Modal (view + approve/reject + comment) ───────────────────────────

function ReviewModal({ assignment, onClose, onDecision }) {
  const [comment, setComment] = useState(assignment.managerComment || "");
  const [confirmAction, setConfirmAction] = useState(null); // "approved" | "rejected"

  const handleDecision = (status) => {
    onDecision(assignment.id, status, comment);
    onClose();
  };

  return (
    <CommonModal
      modalTitle={`Review: ${assignment.kpiTitle}`}
      onClose={onClose}
    >
      {/* KPI Info */}
      <div
        className="rounded p-3 mb-3"
        style={{ backgroundColor: "var(--peach-light)", border: "1px solid var(--border)" }}
      >
        <Row className="g-2">
          <Col xs={6}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Staff</div>
            <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>{assignment.staffName}</div>
          </Col>
          <Col xs={6}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</div>
            <StatusBadge status={assignment.status} />
          </Col>
          <Col xs={6}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Target</div>
            <div style={{ color: "var(--text-dark)" }}>{assignment.kpiTarget}%</div>
          </Col>
          <Col xs={6}>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Deadline</div>
            <div style={{ color: "var(--text-dark)" }}>{assignment.kpiDeadline}</div>
          </Col>
        </Row>
      </div>

      {/* Submission Details */}
      {assignment.status === "pending" ? (
        <Alert variant="warning" className="py-2" style={{ fontSize: "0.875rem" }}>
          No submission yet from this staff member.
        </Alert>
      ) : (
        <>
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "0.875rem" }}>
              Progress Reported
            </Form.Label>
            <div
              className="rounded p-2"
              style={{ border: "1px solid var(--border)", backgroundColor: "#fff", color: "var(--text-dark)" }}
            >
              {assignment.progress ?? "—"}
              {typeof assignment.progress === "number" ? "%" : ""}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "0.875rem" }}>
              Evidence / Notes
            </Form.Label>
            <div
              className="rounded p-2"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "#fff",
                color: "var(--text-dark)",
                minHeight: "72px",
                fontSize: "0.875rem",
                whiteSpace: "pre-wrap",
              }}
            >
              {assignment.evidence || "—"}
            </div>
          </Form.Group>

          {assignment.submittedAt && (
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Submitted on {assignment.submittedAt}
            </p>
          )}

          {/* Manager Comment */}
          <Form.Group className="mb-3">
            <Form.Label style={{ fontWeight: 600, color: "var(--text-dark)", fontSize: "0.875rem" }}>
              Manager Comment
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add feedback for this staff member..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ borderColor: "var(--border)", fontSize: "0.875rem" }}
              disabled={assignment.status === "approved" || assignment.status === "rejected"}
            />
          </Form.Group>

          {/* Approve / Reject — only if submitted */}
          {assignment.status === "submitted" && (
            <>
              {confirmAction ? (
                <Alert variant={confirmAction === "approved" ? "success" : "danger"} className="py-2">
                  <div className="mb-2" style={{ fontSize: "0.875rem" }}>
                    Confirm <strong>{confirmAction === "approved" ? "Approve" : "Reject"}</strong> this submission?
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      size="sm"
                      variant={confirmAction === "approved" ? "success" : "danger"}
                      onClick={() => handleDecision(confirmAction)}
                    >
                      Yes, {confirmAction === "approved" ? "Approve" : "Reject"}
                    </Button>
                    <Button size="sm" variant="light" onClick={() => setConfirmAction(null)}>
                      Cancel
                    </Button>
                  </div>
                </Alert>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    className="flex-fill"
                    onClick={() => setConfirmAction("approved")}
                  >
                    ✓ Approve
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    className="flex-fill"
                    onClick={() => setConfirmAction("rejected")}
                  >
                    ✗ Reject
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </CommonModal>
  );
}

// ─── Assignment Card ──────────────────────────────────────────────────────────

function AssignmentCard({ assignment, onReview }) {
  const isActionable = assignment.status === "submitted";

  return (
    <Card
      className="mb-3"
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.12)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)")}
    >
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: "0.95rem" }}>
              {assignment.kpiTitle}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              {assignment.staffName}
            </div>
          </div>
          <StatusBadge status={assignment.status} />
        </div>

        <div className="d-flex gap-3 mb-3" style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <span>Target: <strong style={{ color: "var(--text-dark)" }}>{assignment.kpiTarget}%</strong></span>
          <span>Deadline: <strong style={{ color: "var(--text-dark)" }}>{assignment.kpiDeadline}</strong></span>
          {assignment.progress !== null && (
            <span>
              Progress:{" "}
              <strong
                style={{
                  color:
                    assignment.progress >= assignment.kpiTarget
                      ? "var(--success)"
                      : "var(--peach-deep)",
                }}
              >
                {assignment.progress}%
              </strong>
            </span>
          )}
        </div>

        {assignment.managerComment && (
          <div
            className="rounded px-2 py-1 mb-2"
            style={{
              backgroundColor: "var(--peach-light)",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
              borderLeft: "3px solid var(--peach-dark)",
            }}
          >
            💬 {assignment.managerComment}
          </div>
        )}

        <div className="d-flex justify-content-end">
          <Button
            size="sm"
            variant={isActionable ? "primary" : "outline-secondary"}
            onClick={() => onReview(assignment)}
            style={isActionable ? {} : { borderColor: "var(--border)", color: "var(--text-muted)" }}
          >
            {isActionable ? "Review Submission" : "View Details"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function KPIAssignment() {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const handleAssign = (newAssignment) => {
    setAssignments((prev) => [...prev, newAssignment]);
  };

  const handleDecision = (id, status, comment) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, managerComment: comment } : a))
    );
  };

  const filtered = {
    all: assignments,
    pending: assignments.filter((a) => a.status === "pending"),
    submitted: assignments.filter((a) => a.status === "submitted"),
    approved: assignments.filter((a) => a.status === "approved"),
    rejected: assignments.filter((a) => a.status === "rejected"),
  };

  const tabList = [
    { key: "all",       label: "All" },
    { key: "pending",   label: "Pending" },
    { key: "submitted", label: "Submitted" },
    { key: "approved",  label: "Approved" },
    { key: "rejected",  label: "Rejected" },
  ];

  // Summary counts
  const counts = {
    submitted: assignments.filter((a) => a.status === "submitted").length,
    approved: assignments.filter((a) => a.status === "approved").length,
    pending: assignments.filter((a) => a.status === "pending").length,
  };

  return (
    <Container className="py-4" style={{ maxWidth: 860 }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ color: "var(--peach-dark)", fontWeight: 700, marginBottom: 2 }}>
            KPI Assignment & Verification
          </h4>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", margin: 0 }}>
            Assign KPIs to staff, review submissions, and approve results.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAssignModal(true)}>
          + Assign KPI
        </Button>
      </div>

      {/* Summary Cards */}
      <Row className="g-3 mb-4">
        {[
          { label: "Awaiting Review", value: counts.submitted, color: "var(--peach-dark)" },
          { label: "Approved",        value: counts.approved,  color: "var(--success)" },
          { label: "Pending",         value: counts.pending,   color: "var(--warning)" },
        ].map(({ label, value, color }) => (
          <Col xs={4} key={label}>
            <Card
              className="text-center py-3"
              style={{
                border: "1px solid var(--border)",
                borderRadius: 10,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
              }}
            >
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color }}>{value}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Tabs */}
      <div
        className="d-flex gap-2 mb-3 flex-wrap"
        style={{ borderBottom: "1px solid var(--border)", paddingBottom: 8 }}
      >
        {tabList.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              background: "none",
              border: "none",
              padding: "4px 14px",
              borderRadius: 20,
              fontSize: "0.82rem",
              fontWeight: activeTab === key ? 700 : 400,
              color: activeTab === key ? "var(--text-light)" : "var(--text-muted)",
              backgroundColor: activeTab === key ? "var(--peach-dark)" : "transparent",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {label}
            {filtered[key].length > 0 && (
              <span
                style={{
                  marginLeft: 6,
                  backgroundColor: activeTab === key ? "rgba(255,255,255,0.3)" : "var(--peach-light)",
                  color: activeTab === key ? "#fff" : "var(--peach-deep)",
                  borderRadius: 10,
                  padding: "1px 6px",
                  fontSize: "0.7rem",
                }}
              >
                {filtered[key].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Assignment List */}
      {filtered[activeTab].length === 0 ? (
        <div
          className="text-center py-5"
          style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
        >
          No assignments in this category.
        </div>
      ) : (
        filtered[activeTab].map((a) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            onReview={(a) => setReviewTarget(a)}
          />
        ))
      )}

      {/* Modals */}
      {showAssignModal && (
        <AssignKPIModal
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
        />
      )}
      {reviewTarget && (
        <ReviewModal
          assignment={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onDecision={handleDecision}
        />
      )}
    </Container>
  );
}
