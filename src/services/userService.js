import { db, auth } from "../firebase/config";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from "firebase/auth";
import { createUserModel, updateUserModel } from "../models/userModel";

// ─── CREATE ────────────────────────────────────────────────
// Called during register — saves user to Firestore
export const createUserProfile = async (uid, name, email, role) => {
  const userData = createUserModel({ uid, name, email, role });
  await setDoc(doc(db, "users", uid), userData);
};

// ─── READ ──────────────────────────────────────────────────
// Get user profile from Firestore by uid
export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) throw new Error("User not found.");
  return snap.data();
};

// ─── UPDATE ────────────────────────────────────────────────
// Update name and/or photoURL in both Firestore + Firebase Auth
export const updateUserProfile = async (uid, updates) => {
  // Update Firestore
  await updateDoc(doc(db, "users", uid), updateUserModel(updates));

  // Sync name/photo to Firebase Auth display
  const authUpdates = {};
  if (updates.name) authUpdates.displayName = updates.name;
  if (updates.photoURL) authUpdates.photoURL = updates.photoURL;
  if (Object.keys(authUpdates).length > 0) {
    await updateProfile(auth.currentUser, authUpdates);
  }
};

// ─── CHANGE PASSWORD ───────────────────────────────────────
// Requires current password to re-authenticate first (Firebase rule)
export const changeUserPassword = async (currentPassword, newPassword) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  await reauthenticateWithCredential(user, credential); // verify old password
  await updatePassword(user, newPassword); // set new password
};

// ─── DELETE / DEACTIVATE ───────────────────────────────────
// Hard delete: removes Firestore doc + Firebase Auth account
export const deleteUserAccount = async (currentPassword) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  await reauthenticateWithCredential(user, credential);
  await deleteDoc(doc(db, "users", user.uid)); // remove Firestore data
  await deleteUser(user); // remove Auth account
};

// Soft deactivate: keeps data but marks account inactive
export const deactivateUserAccount = async (uid) => {
  await updateDoc(doc(db, "users", uid), updateUserModel({ isActive: false }));
};
