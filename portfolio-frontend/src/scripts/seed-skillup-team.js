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
  const projectRef = doc(db, 'projects', 'skill-up-hrms');
  
  await updateDoc(projectRef, {
    team_contributions: [
      {
        id: 'tc_skillup_1',
        team_member_id: 'felopater-nabil',
        role: 'Full Stack Developer',
        contribution_description: 'Developed the core HRMS dashboard, employee management features, and the secure backend API.',
        order: 1
      },
      {
        id: 'tc_skillup_2',
        team_member_id: 'banseh-salah',
        role: 'Penetration Tester',
        contribution_description: 'Ensured maximum data privacy and conducted deep security assessments to protect sensitive employee and company records.',
        order: 2
      },
      {
        id: 'tc_skillup_3',
        team_member_id: 'eman-alaa',
        role: 'DevOps Engineer',
        contribution_description: 'Configured the production servers, optimized performance, and managed the deployment pipelines for the HRMS.',
        order: 3
      }
    ]
  });
  
  console.log('Skill-Up HRMS project team contributions added successfully!');
}

run().catch(console.error);
