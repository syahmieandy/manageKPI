export const createKpiModel = ({ title, description, target, deadline, createdBy, weightage = 0 }) => ({
    title,
    description,
    target,
    deadline,
    createdBy,
    weightage,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  
  export const updateKpiModel = (updates) => ({
    ...updates,
    updatedAt: new Date().toISOString(),
  });