import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCOePLzuVxAxx-jpQ4rI2NtHNWgK1P2D9c",
  authDomain: "synapse-portfolio-435c2.firebaseapp.com",
  projectId: "synapse-portfolio-435c2",
  storageBucket: "synapse-portfolio-435c2.firebasestorage.app",
  messagingSenderId: "309057878204",
  appId: "1:309057878204:web:02c23ad7a301e86f2838b9",
  measurementId: "G-FWRBP32B1Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  console.log("Migrating Team Members...");
  const teamColl = collection(db, 'team');
  const teamSnap = await getDocs(teamColl);
  
  for (const document of teamSnap.docs) {
    const data = document.data();
    let dept = 'none';
    if (data.name.toLowerCase().includes('figo')) {
      dept = 'backend';
    } else if (data.name.toLowerCase().includes('basmala')) {
      dept = 'pentesting';
    } else if (data.name.toLowerCase().includes('eman')) {
      dept = 'devops';
    }
    
    await updateDoc(doc(db, 'team', document.id), {
      department: dept
    });
    console.log(`Updated team member ${data.name} to department: ${dept}`);
  }

  console.log("Migrating Services...");
  const serviceColl = collection(db, 'services');
  const serviceSnap = await getDocs(serviceColl);
  
  for (const document of serviceSnap.docs) {
    const data = document.data();
    let cat = 'global';
    
    if (data.name.includes("Backend")) {
      cat = "backend";
    } else if (data.name.includes("Penetration") || data.name.includes("Pentesting")) {
      cat = "pentesting";
    } else if (data.name.includes("DevOps")) {
      cat = "devops";
    }
    
    await updateDoc(doc(db, 'services', document.id), {
      category: cat
    });
    console.log(`Updated service ${data.name} to category: ${cat}`);
  }
  
  console.log('Migration complete!');
  process.exit(0);
}

migrate().catch(console.error);
