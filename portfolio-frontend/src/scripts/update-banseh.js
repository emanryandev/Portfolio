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
  const memberRef = doc(db, 'team', 'banseh-salah');
  
  await setDoc(memberRef, {
    name: "Banseh Salah",
    slug: "banseh-salah",
    role: "Penetration Tester | API Security",
    bio: "Cybersecurity Specialist with 2 years of hands-on experience in Web Application, API, and Cloud Security assessments. Proven track record in executing comprehensive penetration testing, vulnerability validation, and re-testing across production environments. Expertise in analyzing backend architectures, identifying OWASP Top 10 vulnerabilities, evaluating cloud infrastructure security, and producing executive-ready technical reports to enforce robust offensive security defense.",
    email: "salahbanseh@gmail.com",
    image_url: null,
    skills: [
      "Web Application Penetration Testing", "API Security Testing", "Cloud Security", 
      "Vulnerability Assessment", "OWASP Top 10", "JWT & OAuth 2.0 Security", 
      "Burp Suite Professional", "Postman", "Nmap", "Wireshark", "Metasploit", 
      "Python", "Linux Administration", "System Hardening"
    ],
    social_links: [
      { platform: "linkedin", url: "https://linkedin.com/in/banseh-salah" }
    ],
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }, { merge: true });
  
  console.log('Banseh Salah profile updated successfully!');
}

run().catch(console.error);
