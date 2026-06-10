import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../firebase/config";
import { initializeApp } from "firebase/app";

// ⚠️ We reconstruct app safely using existing Firebase config pattern
// BUT we actually don't need app if storage is initialized separately

const storage = getStorage(); // 🔥 IMPORTANT FIX (no app needed)

export const uploadEvidenceFile = async (file, kpiId) => {
  if (!file) return null;

  const fileRef = ref(storage, `kpiEvidence/${kpiId}/${file.name}`);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);

  return url;
};