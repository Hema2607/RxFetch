import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY, // Use environment variable
    authDomain: "pharma-ece29.firebaseapp.com",
    projectId: "pharma-ece29",
    storageBucket: "pharma-ece29.appspot.com", // Fixed typo
    messagingSenderId: "999579885234",
    appId: "1:999579885234:web:cc01592d1039c3d7f033ab",
    measurementId: "G-R0M55P1L0D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);