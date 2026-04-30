import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAYH2LknXO2VuBYsag6qNj4A3oBgjAunXE",
    authDomain: "fsktm-29ed3.firebaseapp.com",
    projectId: "fsktm-29ed3",
    storageBucket: "fsktm-29ed3.firebasestorage.app",
    messagingSenderId: "10409911302",
    appId: "1:10409911302:web:b14d9dce788d1dcaba8f87",
    measurementId: "G-KBGMDLBEKE"
  };

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);