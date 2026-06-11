export const createAssignmentModel = ({
  kpiId,
  kpiTitle,
  kpiDescription,
  kpiTarget,
  kpiDeadline,
  staffUid,
  staffName,
  assignedBy,
  assignedByUid,
}) => ({
  kpiId,
  kpiTitle,
  kpiDescription: kpiDescription || "",
  kpiTarget,
  kpiDeadline,
  staffUid,
  staffName,
  assignedBy,
  assignedByUid,
  assignedAt: new Date().toISOString(),
  // These will be synced from kpis collection
  progress: null,
  evidence: null,
  evidenceFileUrl: null,
  submittedAt: null,
  updatedAt: new Date().toISOString(),
});

export const updateAssignmentModel = (updates) => ({
  ...updates,
  updatedAt: new Date().toISOString(),
});