import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
} from "react-bootstrap";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import CommonModal from "../components/CommonModal";
import useAuth from "../hooks/useAuth";
import { getKpisByManager } from "../services/kpiService";
import { getUsersByRole } from "../services/userService";
import {
  createAssignment,
  subscribeAssignmentsByManager,
} from "../services/assignmentService";

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
      kpiDescription: kpi.description || "",
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

// ─── View Submission Modal ───────────────────────────────────────────────────

function ViewSubmissionModal({ assignment, onClose }) {
  return (
    <CommonModal modalTitle={`Submission: ${assignment.kpiTitle}`} onClose={onClose}>
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
              Target
            </div>
            <div style={{ color: "var(--text-dark)" }}>
              {assignment.kpiTarget}%
            </div>
          </Col>
          <Col xs={12}>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Description
            </div>
            <div style={{ color: "var(--text-dark)", fontSize: "0.875rem" }}>
              {assignment.kpiDescription || "—"}
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
          <Col xs={6}>
            <div
              style={{
                fontSize: "0.72rem",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Progress
            </div>
            <div
              style={{
                fontWeight: 600,
                color:
                  assignment.progress >= assignment.kpiTarget
                    ? "var(--success)"
                    : "var(--peach-deep)",
              }}
            >
              {assignment.progress ?? 0}%
            </div>
          </Col>
        </Row>
      </div>

      {/* Submission Details */}
      {!assignment.evidence && !assignment.evidenceFileUrl ? (
        <Alert variant="info" className="py-2" style={{ fontSize: "0.875rem" }}>
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
              Evidence Link
            </Form.Label>
            <div
              className="rounded p-2"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "#fff",
                color: "var(--text-dark)",
                fontSize: "0.875rem",
              }}
            >
              {assignment.evidence ? (
                <a href={assignment.evidence} target="_blank" rel="noopener noreferrer">
                  {assignment.evidence}
                </a>
              ) : (
                "—"
              )}
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
              Evidence File
            </Form.Label>
            <div
              className="rounded p-2"
              style={{
                border: "1px solid var(--border)",
                backgroundColor: "#fff",
                color: "var(--text-dark)",
                fontSize: "0.875rem",
              }}
            >
              {assignment.evidenceFileUrl ? (
                <a href={assignment.evidenceFileUrl} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              ) : (
                "—"
              )}
            </div>
          </Form.Group>

          {assignment.submittedAt && (
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Submitted on {assignment.submittedAt}
            </p>
          )}
        </>
      )}
    </CommonModal>
  );
}

// ─── Assignment Card ──────────────────────────────────────────────────────────

function AssignmentCard({ assignment, onViewSubmission }) {
  const hasSubmission = assignment.evidence || assignment.evidenceFileUrl;

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
            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Staff: {assignment.staffName}
            </div>
          </div>
        </div>

        <div
          className="mb-2"
          style={{
            fontSize: "0.78rem",
            color: "var(--text-muted)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {assignment.kpiDescription || "No description"}
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
              {assignment.progress ?? 0}%
            </strong>
          </span>
        </div>

        {hasSubmission && (
          <div
            className="rounded px-2 py-1 mb-2"
            style={{
              backgroundColor: "var(--peach-light)",
              fontSize: "0.72rem",
              color: "var(--peach-deep)",
            }}
          >
            📎 Staff has submitted evidence
          </div>
        )}

        <div className="d-flex justify-content-end">
          <Button
            size="sm"
            variant={hasSubmission ? "primary" : "outline-secondary"}
            onClick={() => onViewSubmission(assignment)}
            style={
              hasSubmission
                ? {}
                : { borderColor: "var(--border)", color: "var(--text-muted)" }
            }
          >
            {hasSubmission ? "View Submission" : "No Submission Yet"}
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
  const [viewTarget, setViewTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    // Subscribe to assignments
    const unsubscribe = subscribeAssignmentsByManager(user.uid, async (assignmentData) => {
      // Enrich each assignment with real-time data from kpis collection
      const enrichedAssignments = await Promise.all(
        assignmentData.map(async (assignment) => {
          try {
            // Fetch the actual KPI document to get latest progress and evidence
            const kpiDocRef = doc(db, "kpis", assignment.kpiId);
            const kpiDoc = await getDoc(kpiDocRef);
            
            if (kpiDoc.exists()) {
              const kpiData = kpiDoc.data();
              return {
                ...assignment,
                // Get latest progress and evidence from KPI collection
                progress: kpiData.progress ?? assignment.progress,
                evidence: kpiData.evidenceText || kpiData.evidence || assignment.evidence,
                evidenceFileUrl: kpiData.evidenceFileUrl || assignment.evidenceFileUrl,
                submittedAt: kpiData.submittedAt || assignment.submittedAt,
                // ALWAYS use the snapshot from assignment, never from current KPI
                kpiDescription: assignment.kpiDescription || "",
                // Ensure staff name is correct
                staffName: assignment.staffName || "Unknown Staff",
              };
            }
            return assignment;
          } catch (error) {
            console.error("Error fetching KPI data for assignment:", assignment.id, error);
            return assignment;
          }
        })
      );
      
      setAssignments(enrichedAssignments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleAssign = async (assignmentData) => {
    try {
      await createAssignment(assignmentData);
      alert("KPI assigned successfully!");
    } catch (error) {
      console.error("Failed to create assignment:", error);
      alert("Failed to assign KPI. Please try again.");
    }
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
            KPI Assignment
          </h4>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.875rem",
              margin: 0,
            }}
          >
            Assign KPIs to staff and review their submitted evidence.
          </p>
        </div>
        <Button variant="primary" onClick={() => setShowAssignModal(true)}>
          + Assign KPI
        </Button>
      </div>

      <Row className="g-3 mb-4">
        {[
          { label: "Total Assignments", value: assignments.length, color: "var(--peach-dark)" },
          { label: "Has Submission", value: assignments.filter(a => a.evidence || a.evidenceFileUrl).length, color: "var(--success)" },
          { label: "No Submission Yet", value: assignments.filter(a => !a.evidence && !a.evidenceFileUrl).length, color: "var(--warning)" },
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

      {assignments.length === 0 ? (
        <div
          className="text-center py-5"
          style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}
        >
          No assignments yet. Click "+ Assign KPI" to get started.
        </div>
      ) : (
        assignments.map((a) => (
          <AssignmentCard
            key={a.id}
            assignment={a}
            onViewSubmission={(a) => setViewTarget(a)}
          />
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
      {viewTarget && (
        <ViewSubmissionModal
          assignment={viewTarget}
          onClose={() => setViewTarget(null)}
        />
      )}
    </Container>
  );
}