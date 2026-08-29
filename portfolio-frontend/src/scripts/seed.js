import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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

const team = [
  {
    name: 'Felopater Nabil',
    slug: 'felopater-nabil',
    role: 'Backend & Full-Stack Developer',
    bio: 'Backend Laravel Developer with strong practical experience building robust backend architectures and full-stack systems. Specialized in PHP, Laravel, MySQL, and modern frontend tools like React and Tailwind CSS.',
    image_url: '/images/team/felopater.jpg',
    order: 1,
  },
  {
    name: 'Eman Alaa',
    slug: 'eman-alaa',
    role: 'Cloud & DevSecOps Engineer',
    bio: 'Cloud & DevSecOps Engineer with robust hands-on expertise in AWS infrastructure, Linux system administration, and containerization. Architecting auto-healing cloud environments and CI/CD workflows.',
    image_url: '/images/team/eman.jpg',
    order: 2,
  },
  {
    name: 'Banseh Salah',
    slug: 'banseh-salah',
    role: 'Penetration Tester',
    bio: 'Cybersecurity specialist with hands-on experience in Web Application and API Penetration Testing. Strong understanding of OWASP Top 10, Authentication, API Security, and secure software development practices.',
    image_url: '/images/team/banseh.jpg',
    order: 3,
  }
];

const projects = [
  {
    title: 'Skillup01 - Employee Attendance',
    slug: 'skillup01',
    client_name: 'Skillup01',
    summary: 'Employee Attendance Management System.',
    description: 'Developed the complete web-based system (Full Stack) from scratch, designing both the frontend interfaces and backend architecture to manage and track employee attendance across multiple companies.',
    image_url: null,
    live_url: 'https://skillup01.com',
    github_url: null,
    technologies: ['React.js', 'Bootstrap', 'PHP', 'Laravel', 'MySQL'],
    is_featured: true,
    published_at: new Date().toISOString(),
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    title: 'Tanqia Skills',
    slug: 'tanqia-skills',
    client_name: 'Tanqia',
    summary: 'Employee Task & Skill Management System.',
    description: 'Developed a comprehensive full-stack web platform from scratch with role-based access to streamline task delegation and performance tracking. Implemented advanced backend features including bulk Excel data processing.',
    image_url: null,
    live_url: 'https://tanqia.site',
    github_url: null,
    technologies: ['PHP', 'Laravel', 'Tailwind CSS', 'Alpine.js', 'MySQL', 'Docker'],
    is_featured: true,
    published_at: new Date().toISOString(),
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

const services = [
  {
    name: 'Complete Digital Solution',
    slug: 'complete-solution',
    description: 'End-to-end software development including design, backend, frontend, QA, and deployment.',
    price_type: 'custom',
    price: null,
    features: [
      'Custom Architecture Design',
      'Full-Stack Development',
      'QA & Testing',
      'Production Deployment'
    ],
    is_active: true,
    is_featured: true,
    order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    name: 'Backend API Development',
    slug: 'backend-api-development',
    description: 'Robust, secure, and scalable RESTful API development.',
    price_type: 'starting_at',
    price: '2500',
    features: [
      'Secure Architecture',
      'Database Design',
      'Documentation',
    ],
    is_active: true,
    is_featured: false,
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

async function seed() {
  console.log('Seeding team...');
  for (const member of team) {
    await setDoc(doc(db, 'team', member.slug), member);
  }

  console.log('Seeding projects...');
  for (const project of projects) {
    await setDoc(doc(db, 'projects', project.slug), project);
  }

  console.log('Seeding services...');
  for (const service of services) {
    await setDoc(doc(db, 'services', service.slug), service);
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
