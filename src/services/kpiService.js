import { db } from "../firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { createKpiModel, updateKpiModel } from "../models/kpiModel";

const COL = "kpis";

export const createKpi = async (data) => {
  const ref = await addDoc(collection(db, COL), createKpiModel(data));
  return ref.id;
};

export const getKpisByManager = async (managerUid) => {
  const q = query(collection(db, COL), where("createdBy", "==", managerUid));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const updateKpi = async (kpiId, updates) => {
  await updateDoc(doc(db, COL, kpiId), updateKpiModel(updates));
};

export const deleteKpi = async (kpiId) => {
  await deleteDoc(doc(db, COL, kpiId));
};