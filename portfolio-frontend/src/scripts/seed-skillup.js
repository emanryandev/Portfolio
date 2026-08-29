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

const markdownDesc = `# Skill-Up HRMS 🏢\n\n![Skill-Up HRMS](https://img.shields.io/badge/Version-1.0.0-blue)\n![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=flat&logo=laravel&logoColor=white)\n![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)\n![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)\n\nA comprehensive Human Resources Management System built with the latest technologies to serve the **Skill-Up** organization. The system aims to facilitate the management of employees, attendance, clients, and daily tasks in a seamless and professional manner.\n\n---\n\n## 🌟 Core Features\n\n1. **Employees Management:**\n   - Add, edit, and delete employee records (supporting detailed data such as job titles, working hours, and hiring dates).\n   - View a comprehensive profile for each employee.\n2. **Attendance Tracking:**\n   - Record employees' clock-in and clock-out times.\n   - Customized reports for attendance status, working hours, and performance tracking.\n3. **Task Management:**\n   - Assign tasks to employees and track progress.\n   - Interactive Task Board to monitor task statuses (Pending, In Progress, Completed).\n4. **Clients Management:**\n   - A dedicated database for company clients, commercial registration numbers, and contact files.\n5. **Reporting & Analytics:**\n   - A smart Dashboard displaying an overview of the company's performance.\n   - Professional export of task and attendance reports.\n6. **System Logs:**\n   - Full tracking of all actions performed on the system to ensure security and transparency.\n\n---\n\n## 🛠️ Tech Stack\n\n### Backend\n- **Framework:** Laravel (PHP)\n- **Database:** MySQL\n- **Authentication:** Laravel Sanctum (Token-based Auth)\n\n### Frontend\n- **Library:** React.js (18+)\n- **Styling:** Tailwind CSS\n- **Routing:** React Router DOM\n- **State/API:** Axios & Context API\n- **Build Tool:** Vite\n\n---\n\n## 🚀 Local Setup\n\n### 1. Prerequisites\n- Install PHP (8.1 or newer)\n- Install Composer\n- Install Node.js & npm\n- Install MySQL Database\n\n### 2. Installation Steps\n\`\`\`bash\n# 1. Clone the repository\ngit clone https://github.com/figo05-ai/Skill-Up-PHP.git\ncd Skill-Up-PHP\n\n# 2. Install backend dependencies\ncomposer install\n\n# 3. Install frontend dependencies\nnpm install\n\n# 4. Setup environment file\ncp .env.example .env\n# Update the database credentials in the .env file\n\n# 5. Prepare the system\nphp artisan key:generate\nphp artisan migrate\nphp artisan storage:link\n\n# 6. Run the server\nphp artisan serve\n\n# 7. Run the frontend in a separate Terminal window\nnpm run dev\n\`\`\`\n\n---\n\n## 🌍 Deployment\n\n1. Pull the project onto your hosting server (e.g., Hostinger).\n2. Update the \`.env\` file with production settings:\n   \`\`\`env\n   APP_ENV=production\n   APP_DEBUG=false\n   APP_URL=https://yourdomain.com\n   \`\`\`\n3. Run the following commands via SSH:\n   \`\`\`bash\n   composer install --optimize-autoloader --no-dev\n   npm run build\n   php artisan storage:link\n   php artisan optimize\n   \`\`\`\n4. Ensure the domain's Document Root is pointed to the \`public\` directory.\n\n---\n\n## 🔐 Default Admin Accounts\nPlease refer to the system administrator to obtain the Admin Credentials.\n\n---\n*Developed with ❤️ for the Skill-Up organization.*`;

async function run() {
  const projectRef = doc(db, 'projects', 'skill-up-hrms');
  
  await setDoc(projectRef, {
    title: 'Skill-Up HRMS',
    slug: 'skill-up-hrms',
    client_name: 'Skill-Up Organization',
    summary: 'A comprehensive Human Resources Management System built with the latest technologies to serve the Skill-Up organization.',
    description: markdownDesc,
    image_url: '',
    live_url: '',
    github_url: 'https://github.com/figo05-ai/Skill-Up-PHP.git',
    technologies: ['React', 'Laravel', 'Tailwind CSS', 'MySQL', 'Vite'],
    team_contributions: [],
    is_featured: true,
    published_at: new Date().toISOString(),
    order: 2,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
  console.log('Skill-Up HRMS project has been added successfully!');
}

run().catch(console.error);
