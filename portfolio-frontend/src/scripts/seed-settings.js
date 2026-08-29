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
  const settingsRef = doc(db, 'settings', 'general');
  
  await setDoc(settingsRef, {
    site_name: 'Synapse',
    site_tagline: 'Full Stack Developers & Designers',
    contact_email: 'hello@synapse.com',
    contact_phone: '+1 (555) 000-0000',
    contact_location: 'Alexandria, Egypt',
    seo_default_description: 'A specialized trio of developers combining deep expertise across the entire stack to build products that perform.',
    logo_url: '/images/logo/logo.jpeg'
  });
  
  console.log('Settings seeded successfully!');
}

run().catch(console.error);
