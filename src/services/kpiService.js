import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { createKpiModel, updateKpiModel } from "../models/kpiModel";

const COL = "kpis";

export const subscribeKpi = (callback) => {
  const kpisRef = collection(db, COL);

  return onSnapshot(kpisRef, (snapshot) => {
    const cleanData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(cleanData);
  });
};

export const createKpi = async (data) => {
  const ref = await addDoc(collection(db, COL), createKpiModel(data));
  return ref.id;
};

export const getKpis = async () => {
  const kpisRef = collection(db, COL);
  const kpis = await getDocs(kpisRef);
  return kpis.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getKpisByManager = async (managerUid) => {
  const q = query(collection(db, COL), where("createdBy", "==", managerUid));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateKpi = async (kpiId, updates) => {
  await updateDoc(doc(db, COL, kpiId), updateKpiModel(updates));
};

export const deleteKpi = async (kpiId) => {
  await deleteDoc(doc(db, COL, kpiId));
};
