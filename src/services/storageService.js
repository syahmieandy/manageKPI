import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "../firebase/config";
import { initializeApp } from "firebase/app";

const storage = getStorage();

export const uploadEvidenceFile = async (file, kpiId) => {
  if (!file) return null;

  const fileRef = ref(storage, `kpiEvidence/${kpiId}/${file.name}`);

  await uploadBytes(fileRef, file);

  const url = await getDownloadURL(fileRef);

  return url;
};