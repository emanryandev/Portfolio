import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

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
  await updateDoc(doc(db, 'team', 'felopater-nabil'), { image_url: '/images/team/felopater.jpg' });
  await updateDoc(doc(db, 'team', 'banseh-salah'), { image_url: '/images/team/banseh.jpg' });
  await updateDoc(doc(db, 'team', 'eman-alaa'), { image_url: '/images/team/eman.jpg' });
  
  console.log('Team images updated successfully!');
}

run().catch(console.error);
