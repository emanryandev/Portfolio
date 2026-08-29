import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCOePLzuVxAxx-jpQ4rI2NtHNWgK1P2D9c",
  authDomain: "synapse-portfolio-435c2.firebaseapp.com",
  projectId: "synapse-portfolio-435c2",
  storageBucket: "synapse-portfolio-435c2.firebasestorage.app",
  messagingSenderId: "309057878204",
  appId: "1:309057878204:web:02c23ad7a301e86f2838b9",
  measurementId: "G-FWRBP32B1Q"
};

import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
// const analytics = getAnalytics(app); // Analytics can be initialized later if needed

export { app, auth, db, storage };
