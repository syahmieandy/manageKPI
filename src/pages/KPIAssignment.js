import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import CommonModal from "../components/CommonModal";
import useAuth from "../hooks/useAuth";
import { getKpisByManager } from "../services/kpiService";
import { getUsersByRole } from "../services/userService";
import {
  createAssignment,
  subscribeAssignmentsByManager,
  updateAssignment,
} from "../services/assignmentService";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_META = {
  pending: { label: "Pending", bg: "warning", text: "dark" },
  submitted: { label: "Submitted", bg: "info", text: "dark" },
  approved: { label: "Approved", bg: "success", text: "light" },
  rejected: { label: "Rejected", bg: "danger", text: "light" },
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

function AssignKPIModal({ onClose, onAssign, managerUid, managerName, existingAssignments }) {
  const [form, setForm] = useState({ kpiId: "", staffUid: "" });
  const [kpis, setKpis] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get already assigned KPI IDs for selected staff
  const getAssignedKpiIds = (staffUid) => {
    return existingAssignments
      .filter(a => a.staffUid === staffUid)
      .map(a => a.kpiId);
  };

  // Filter available KPIs based on selected staff
  const getAvailableKpis = (staffUid) => {
    if (!staffUid) return kpis;
    const assignedKpiIds = getAssignedKpiIds(staffUid);
    return kpis.filter(k => !assignedKpiIds.includes(k.id));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedKpis, fetchedStaff] = await Promise.all([
          getKpisByManager(managerUid),
          getUsersByRole("staff"),
        ]);
        setKpis(fetchedKpis);
        setStaffList(fetchedStaff);
      } catch (err) {
        setError("Failed to load data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [managerUid]);

  const handleStaffChange = (staffUid) => {
    setForm({ kpiId: "", staffUid });
  };

  const handleSubmit = () => {
    if (!form.kpiId || !form.staffUid) {
      setError("Please select both a KPI and a staff member.");
      return;
    }
    const kpi = kpis.find((k) => k.id === form.kpiId);
    const staff = staffList.find((s) => s.uid === form.staffUid);

    onAssign({
      kpiId: kpi.id,
      kpiTitle: kpi.title,
      kpiTarget: kpi.target,
      kpiDeadline: kpi.deadline,
      staffUid: staff.uid,
      staffName: staff.name,
      assignedBy: managerName,
      assignedByUid: managerUid,
    });
    onClose();
  };

  const availableKpis = getAvailableKpis(form.staffUid);
  const noKpisAvailable = form.staffUid && availableKpis.length === 0;

  if (loading) {
    return (
      <CommonModal modalTitle="Assign KPI to Staff" onClose={onClose}>
        <div className="text-center py-4">Loading...</div>
      </CommonModal>
    );
  }

  return (
    <CommonModal modalTitle="Assign KPI to Staff" onClose={onClose}>
      {error && (
        <Alert variant="danger" className="py-2">
          {error}
        </Alert>
      )}

      <Form.Group className="mb-3">
        <Form.Label style={{ color: "var(--text-dark)", fontWeight: 500 }}>
          Assign To
        </Form.Label>
        <Form.Select
          value={form.staffUid}
          onChange={(e) => handleStaffChange(e.target.value)}
          style={{ borderColor: "var(--border)" }}
        >
          <option value="">— Choose a staff member —</option>
          {staffList.map((s) => (
            <option key={s.uid} value={s.uid}>
              {s.name} ({s.email})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label style={{ color: "var(--text-dark)", fontWeight: 500 }}>
          Select KPI
        </Form.Label>
        <Form.Select
          value={form.kpiId}
          onChange={(e) => setForm({ ...form, kpiId: e.target.value })}
          style={{ borderColor: "var(--border)" }}
          disabled={!form.staffUid}
        >
          <option value="">— Choose a KPI —</option>
          {availableKpis.map((k) => (
            <option key={k.id} value={k.id}>
              {k.title} (Target: {k.target}%) — Deadline: {k.deadline}
            </option>
          ))}
        </Form.Select>
        {noKpisAvailable && (
          <div className="mt-2 text-warning" style={{ fontSize: "0.8rem" }}>
            This staff member has already been assigned all available KPIs.
          </div>
        )}
      </Form.Group>

      <Button 
        variant="primary" 
        className="w-100" 
        onClick={handleSubmit}
        disabled={!form.kpiId || !form.staffUid || noKpisAvailable}
      >
        Assign KPI
      </Button>
    </CommonModal>
  );
}

// ─── Review Modal ───────────────────────────────────────────────────────────

function ReviewModal({ assignment, onClose, onDecision }) {
  const [comment, setComment] = useState(assignment.managerComment || "");
  const [confirmAction, setConfirmAction] = useState(null);

  const handleDecision = (status) => {
    onDecision(assignment.id, status, comment);
    onClose();
  };

  return (
    <CommonModal modalTitle={`Review: ${assignment.kpiTitle}`} onClose={onClose}>
      <div
        className="rounded p-3 mb-3"
        style={{
          backgroundColor: "var(--peach-light)",
          border: "1px solid var(--border)",
        }}
      >
        <Row className="g-2">
          <Col xs={6}>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Staff
            </div>
            <div style={{ fontWeight: 600, color: "var(--text-dark)" }}>
              {assignment.staffName}
            </div>
          </Col>
          <Col xs={6}>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Status
            </div>
            <StatusBadge status={assignment.status} />
          </Col>
          <Col xs={6}>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Target
            </div>
            <div style={{ color: "var(--text-dark)" }}>
              {assignment.kpiTarget}%
            </div>
          </Col>
          <Col xs={6}>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Deadline
            </div>
            <div style={{ color: "var(--text-dark)" }}>
              {assignment.kpiDeadline}
            </div>
          </Col>
        </Row>
      </div>

      {assignment.status === "pending" ? (
        <Alert variant="warning" className="py-2" style={{ fontSize: "0.875rem" }}>
          No submission yet from this staff member.
        </Alert>
      ) : (
        <>
          <Form.Group className="mb-3">
            <Form.Label
              style={{
                fontWeight: 600,
                color: "var(--text-dark)",
                fontSize: "0.875rem",
              }}
            >
              Progress Reported
            </Form.Label>
            <div
              className="rounded p-2"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "#fff",
                color: "var(--text-dark)",
              }}
            >
              {assignment.progress ?? "—"}
              {typeof assignment.progress === "number" ? "%" : ""}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label
              style={{
                fontWeight: 600,
                color: "var(--text-dark)",
                fontSize: "0.875rem",
              }}
            >
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

          <Form.Group className="mb-3">
            <Form.Label
              style={{
                fontWeight: 600,
                color: "var(--text-dark)",
                fontSize: "0.875rem",
              }}
            >
              Manager Comment
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Add feedback for this staff member..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ borderColor: "var(--border)", fontSize: "0.875rem" }}
              disabled={
                assignment.status === "approved" || assignment.status === "rejected"
              }
            />
          </Form.Group>

          {assignment.status === "submitted" && (
            <>
              {confirmAction ? (
                <Alert variant={confirmAction === "approved" ? "success" : "danger"} className="py-2">
                  <div className="mb-2" style={{ fontSize: "0.875rem" }}>
                    Confirm{" "}
                    <strong>{confirmAction === "approved" ? "Approve" : "Reject"}</strong> this
                    submission?
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
            <div
              style={{
                fontWeight: 700,
                color: "var(--text-dark)",
                fontSize: "0.95rem",
              }}
            >
              {assignment.kpiTitle}
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{assignment.staffName}</div>
          </div>
          <StatusBadge status={assignment.status} />
        </div>

        <div
          className="d-flex gap-3 mb-3"
          style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}
        >
          <span>
            Target:{" "}
            <strong style={{ color: "var(--text-dark)" }}>{assignment.kpiTarget}%</strong>
          </span>
          <span>
            Deadline:{" "}
            <strong style={{ color: "var(--text-dark)" }}>{assignment.kpiDeadline}</strong>
          </span>
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
            style={
              isActionable
                ? {}
                : { borderColor: "var(--border)", color: "var(--text-muted)" }
            }
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
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = subscribeAssignmentsByManager(user.uid, (data) => {
      setAssignments(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAssign = async (assignmentData) => {
    try {
      await createAssignment(assignmentData);
      // Notification will be handled by your teammate's progress submission flow
      // or you can add an optional notification here if needed
    } catch (error) {
      console.error("Failed to create assignment:", error);
      alert("Failed to assign KPI. Please try again.");
    }
  };

  const handleDecision = async (id, status, comment) => {
    try {
      await updateAssignment(id, { status, managerComment: comment });
    } catch (error) {
      console.error("Failed to update assignment:", error);
      alert("Failed to update. Please try again.");
    }
  };

  const filtered = {
    all: assignments,
    pending: assignments.filter((a) => a.status === "pending"),
    submitted: assignments.filter((a) => a.status === "submitted"),
    approved: assignments.filter((a) => a.status === "approved"),
    rejected: assignments.filter((a) => a.status === "rejected"),
  };

  const tabList = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "submitted", label: "Submitted" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

  const counts = {
    submitted: assignments.filter((a) => a.status === "submitted").length,
    approved: assignments.filter((a) => a.status === "approved").length,
    pending: assignments.filter((a) => a.status === "pending").length,
  };

  if (loading) {
    return (
      <Container className="py-4 text-center" style={{ maxWidth: 860 }}>
        <div className="py-5">Loading assignments...</div>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: 860 }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4
            style={{
              color: "var(--peach-dark)",
              fontWeight: 700,
              marginBottom: 2,
            }}
          >
            KPI Assignment & Verification
          </h4>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Assign KPIs to staff, review submissions, and approve results.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAssignModal(true)}>
          + Assign KPI
        </Button>
      </div>

      <Row className="g-3 mb-4">
        {[
          { label: "Awaiting Review", value: counts.submitted, color: "var(--peach-dark)" },
          { label: "Approved", value: counts.approved, color: "var(--success)" },
          { label: "Pending", value: counts.pending, color: "var(--warning)" },
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
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-muted)",
                  marginTop: 2,
                }}
              >
                {label}
              </div>
            </Card>
          </Col>
        ))}
      </Row>

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

      {filtered[activeTab].length === 0 ? (
        <div
          className="text-center py-5"
          style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
        >
          No assignments in this category.
        </div>
      ) : (
        filtered[activeTab].map((a) => (
          <AssignmentCard key={a.id} assignment={a} onReview={(a) => setReviewTarget(a)} />
        ))
      )}

      {showAssignModal && (
        <AssignKPIModal
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssign}
          managerUid={user.uid}
          managerName={user.name}
          existingAssignments={assignments}
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