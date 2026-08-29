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

const markdownDesc = `# Tanqia - Tailored Web Solution 🌐\n\n## 📌 Overview\nTanqia is a comprehensive web application developed to meet specific business requirements. The project encompasses the full software development lifecycle, from initial system architecture and backend logic to final deployment and cloud hosting, ensuring a seamless and optimized workflow for its users.\n\n## 🛠️ Tech Stack\n*   **Backend:** PHP, Laravel Framework\n*   **Database:** MySQL\n*   **Frontend:** HTML5, CSS3, JavaScript, Bootstrap\n*   **DevOps & Hosting:** Linux, Git, Cloud Hosting (Deployment)\n\n## ✨ Key Features\n*   **Custom Business Logic:** Tailored functionalities designed to solve specific operational bottlenecks.\n*   **Responsive UI/UX:** A clean, user-friendly interface that adapts to all devices.\n*   **Secure Authentication:** Protected routes and secure user data management.\n*   **Production Deployment:** Fully hosted and optimized for live production environments.\n\n## 🚀 How to Run Locally\n\n1. Clone the repository:\n\`\`\`bash\n   git clone https://github.com/figo05-ai/Tanqia.git\n\`\`\`\n2. Install backend dependencies:\n\`\`\`bash\n   composer install\n\`\`\`\n3. Set up environment:\n\`\`\`bash\n   cp .env.example .env\n   php artisan key:generate\n\`\`\`\n4. Run migrations:\n\`\`\`bash\n   php artisan migrate\n\`\`\`\n5. Start the server:\n\`\`\`bash\n   php artisan serve\n\`\`\``;

async function run() {
  const projectRef = doc(db, 'projects', 'tanqia');
  
  await setDoc(projectRef, {
    title: 'Tanqia - Tailored Web Solution',
    slug: 'tanqia',
    client_name: 'Tanqia',
    summary: 'A comprehensive web application developed to meet specific business requirements with custom business logic and secure authentication.',
    description: markdownDesc,
    image_url: '',
    live_url: '',
    github_url: 'https://github.com/figo05-ai/Tanqia.git',
    technologies: ['Laravel', 'PHP', 'MySQL', 'Bootstrap', 'JavaScript'],
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
        team_member_id: 'eman-alaa',
        role: 'DevOps Engineer',
        contribution_description: 'Handled the Linux server configuration, cloud hosting, and production deployment.',
        order: 2
      }
    ],
    is_featured: false,
    published_at: new Date().toISOString(),
    order: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
  console.log('Tanqia project has been added successfully!');
}

run().catch(console.error);
