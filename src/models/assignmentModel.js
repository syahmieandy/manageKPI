export const createAssignmentModel = ({
  kpiId,
  kpiTitle,
  kpiTarget,
  kpiDeadline,
  staffUid,
  staffName,
  assignedBy,
  assignedByUid,
}) => ({
  kpiId,
  kpiTitle,
  kpiTarget,
  kpiDeadline,
  staffUid,
  staffName,
  assignedBy,        // manager name
  assignedByUid,     // manager uid for filtering
  assignedAt: new Date().toISOString(),
  status: "pending", // pending | submitted | approved | rejected
  progress: null,
  evidence: null,
  submittedAt: null,
  managerComment: "",
  updatedAt: new Date().toISOString(),
});

export const updateAssignmentModel = (updates) => ({
  ...updates,
  updatedAt: new Date().toISOString(),
});