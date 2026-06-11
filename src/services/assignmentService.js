import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { createAssignmentModel, updateAssignmentModel } from "../models/assignmentModel";

const COLLECTION = "assignments";

// ─── CHECK DUPLICATE ─────────────────────────────────────────
export const checkExistingAssignment = async (kpiId, staffUid, managerUid) => {
  const q = query(
    collection(db, COLLECTION),
    where("kpiId", "==", kpiId),
    where("staffUid", "==", staffUid),
    where("assignedByUid", "==", managerUid)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
};

// ─── CREATE ────────────────────────────────────────────────
export const createAssignment = async (data) => {
  const docRef = await addDoc(collection(db, COLLECTION), createAssignmentModel(data));
  return docRef.id;
};

// ─── READ (Manager view) ───────────────────────────────────
// Get all assignments where the KPI was created by this manager
export const getAssignmentsByManager = async (managerUid) => {
  const q = query(collection(db, COLLECTION), where("assignedByUid", "==", managerUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ─── READ (Staff view - for your teammate later) ───────────
export const getAssignmentsByStaff = async (staffUid) => {
  const q = query(collection(db, COLLECTION), where("staffUid", "==", staffUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// ─── REAL-TIME SUBSCRIPTION (Manager) ──────────────────────
export const subscribeAssignmentsByManager = (managerUid, callback) => {
  const q = query(collection(db, COLLECTION), where("assignedByUid", "==", managerUid));
  
  return onSnapshot(q, (snapshot) => {
    const assignments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(assignments);
  });
};

// ─── UPDATE ────────────────────────────────────────────────
export const updateAssignment = async (assignmentId, updates) => {
  const docRef = doc(db, COLLECTION, assignmentId);
  await updateDoc(docRef, updateAssignmentModel(updates));
};

// ─── BULK UPDATE (for future use) ──────────────────────────
export const updateAssignmentStatus = async (assignmentId, status, managerComment) => {
  const updates = { status, managerComment };
  if (status === "approved" || status === "rejected") {
    updates.updatedAt = new Date().toISOString();
  }
  await updateAssignment(assignmentId, updates);
};