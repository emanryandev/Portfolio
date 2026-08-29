import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOePLzuVxAxx-jpQ4rI2NtHNWgK1P2D9c",
  authDomain: "synapse-portfolio-435c2.firebaseapp.com",
  projectId: "synapse-portfolio-435c2",
  storageBucket: "synapse-portfolio-435c2.firebasestorage.app",
  messagingSenderId: "309057878204",
  appId: "1:309057878204:web:02c23ad7a301e86f2838b9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  const memberRef = doc(db, 'team', 'felopater-nabil');
  
  await updateDoc(memberRef, {
    bio: "Backend Laravel Developer with over two years of professional experience, alongside being a Management Information Systems student. I stand out through practical experience building scalable backend architectures with PHP, Laravel, and Linux, complemented by strong problem-solving skills. I am highly passionate about building robust systems and APIs while adopting industry best practices like Clean Architecture and System Design.",
    skills: arrayUnion("Redis", "RESTful API", "Clean Code", "Clean Architecture", "System Design"),
    updated_at: new Date().toISOString()
  });
  
  console.log('Felopater profile updated successfully with new skills and experience!');
}

run().catch(console.error);
