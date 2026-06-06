export const createUserModel = ({ uid, name, email, role, photoURL = "" }) => ({
  uid,
  name,
  email,
  role,
  photoURL,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const updateUserModel = (updates) => ({
  ...updates,
  updatedAt: new Date().toISOString(),
});
