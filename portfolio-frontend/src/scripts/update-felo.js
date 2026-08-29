import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
  
  await setDoc(memberRef, {
    name: "Felopater Nabil",
    slug: "felopater-nabil",
    role: "Backend Laravel Developer",
    bio: "Junior Backend Laravel Developer and Management Information Systems student. I stand out through practical experience building backend architectures with PHP, Laravel, and Linux, complemented by strong problem-solving skills. I chose backend development to build robust systems, and I am highly passionate about applying my knowledge practically while absorbing industry best practices.",
    email: "felopater455@gmail.com",
    image_url: null,
    skills: [
      "PHP", "Laravel", "Linux", "API Development", "MySQL", "Docker", "Git",
      "React.js", "Tailwind CSS", "Alpine.js", "Bootstrap", "HTML/CSS/JS",
      "Problem Solving", "Prompt Engineering", "Team Leadership"
    ],
    social_links: [
      { platform: "linkedin", url: "https://linkedin.com/in/felopter-alexandir" }
    ],
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { merge: true });
  
  console.log('Felopater Nabil profile updated successfully!');
}

run().catch(console.error);
