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
  const memberRef = doc(db, 'team', 'eman-alaa');
  
  await setDoc(memberRef, {
    name: "Eman Alaa Gebril",
    slug: "eman-alaa",
    role: "Cloud & DevSecOps Engineer",
    bio: "Cloud & DevSecOps Engineer with robust hands-on expertise in AWS infrastructure, Linux system administration, and containerization. Proven track record of architecting auto-healing cloud environments, managing CI/CD workflows, and troubleshooting complex production deployments. Adept at utilizing Docker, reverse proxies, and advanced monitoring to ensure highly available, secure applications across cloud and on-premise setups.",
    email: "emanlaryan27@gmail.com",
    image_url: null,
    skills: [
      "AWS", "Terraform", "Docker", "Kubernetes", "gVisor",
      "GitHub Actions", "Jenkins", "Ansible", "Linux Administration", "Bash Scripting", 
      "Nginx", "eBPF", "Falco", "Prometheus", "Grafana", "MySQL", "Redis"
    ],
    social_links: [
      { platform: "linkedin", url: "https://linkedin.com/in/eman-alaa-685207398" },
      { platform: "github", url: "https://github.com/emanryandev" }
    ],
    order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { merge: true });
  
  console.log('Eman Alaa profile updated successfully!');
}

run().catch(console.error);
