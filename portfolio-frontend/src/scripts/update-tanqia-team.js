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
  const projectRef = doc(db, 'projects', 'tanqia');
  
  await updateDoc(projectRef, {
    team_contributions: [
      {
        id: 'tc_tanqia_1',
        team_member_id: 'felopater-nabil',
        role: 'Full Stack Developer',
        contribution_description: 'Designed the system architecture, developed the custom business logic in Laravel, and built the responsive frontend using Bootstrap.',
        order: 1
      },
      {
        id: 'tc_tanqia_2',
        team_member_id: 'banseh-salah',
        role: 'Quality Assurance & Testing',
        contribution_description: 'Performed rigorous testing of custom business logic and ensured the system is bug-free before production deployment.',
        order: 2
      },
      {
        id: 'tc_tanqia_3',
        team_member_id: 'eman-alaa',
        role: 'DevOps Engineer',
        contribution_description: 'Handled the Linux server configuration, cloud hosting, and production deployment.',
        order: 3
      }
    ]
  });
  
  console.log('Added Banseh to Tanqia project successfully!');
}

run().catch(console.error);
