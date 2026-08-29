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
  const academyRef = doc(db, 'projects', 'academy');
  await updateDoc(academyRef, {
    team_contributions: [
      {
        id: 'tc_1',
        team_member_id: 'felopater-nabil',
        role: 'Full Stack Developer',
        contribution_description: 'Built the complete web-based system from scratch, designing both the frontend interfaces and backend architecture.',
        order: 1
      },
      {
        id: 'tc_2',
        team_member_id: 'banseh-salah',
        role: 'Penetration Tester',
        contribution_description: 'Conducted comprehensive penetration testing and security assessments on the entire website to ensure robust security and data protection.',
        order: 2
      },
      {
        id: 'tc_3',
        team_member_id: 'eman-alaa',
        role: 'DevOps Engineer',
        contribution_description: 'Managed the deployment pipelines and published the application on the internet.',
        order: 3
      }
    ]
  });
  console.log('Fixed Banseh role in Academy project.');
}

run().catch(console.error);
