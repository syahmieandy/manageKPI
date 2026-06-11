export const createKpiModel = ({
  title,
  description,
  target,
  deadline,
  createdBy,
  createdByUid,   // uid (for filtering)
  weightage = 0,
}) => ({
  title,
  description,
  target,
  deadline,
  createdBy,
  createdByUid,   // manager uid for filtering
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const updateKpiModel = (updates) => ({
  ...updates,
  updatedAt: new Date().toISOString(),
});
