import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD-cYYoPN0i8QyxxiQCFhuy3eH4IKumLO0",
  authDomain: "biolik-terroir.firebaseapp.com",
  projectId: "biolik-terroir",
  storageBucket: "biolik-terroir.firebasestorage.app",
  messagingSenderId: "170054788822",
  appId: "1:170054788822:web:98204c864ca77d845f0b77",
  measurementId: "G-FBZMJ4731E"
};
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
