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

const markdownDesc = `# Hindrah 🏢\n**HR Establishment and Management for Enterprises in Saudi Arabia**\n\n## 📖 About The Project\nHindrah is an interactive landing page for a company specializing in providing an "engineered" human resources system for Saudi enterprises. The project focuses on highlighting the company's services, which include clear structuring, precise competency matching, and measurable regulatory compliance, fully aligned with Saudi labor laws and market requirements.\n\n## 🛠️ Tech Stack\n* **Core Framework:** [React 19](https://react.dev/)\n* **Build Tool:** [Vite](https://vitejs.dev/)\n* **Language:** [TypeScript](https://www.typescriptlang.org/)\n* **Styling:** Custom CSS relying on CSS Variables, combined with utility classes.\n* **Animations & Interactions:** \`framer-motion\`\n* **Other Utilities:** \n  * \`react-countup\` (for animated number statistics)\n  * \`react-intersection-observer\` (for scroll-triggered animations)\n  * \`clsx\` & \`tailwind-merge\` (for dynamic CSS class management)\n* **Linting:** \`oxlint\`\n\n## 📂 Project Structure\nThe project is built with a simple and organized structure:\n\`\`\`text\nHindrah/\n├── public/                 # Public assets (Icons, Images, SEO)\n│   ├── assets/             # Static images and files\n│   ├── favicon.svg         # Website favicon\n│   ├── robots.txt          # Search engine instructions\n│   └── sitemap.xml         # Website sitemap\n├── src/                    # Main source code\n│   ├── components/         # UI Components (Website Sections)\n│   ├── App.tsx             # Main component that aggregates all page sections\n│   ├── index.css           # Global CSS styles\n│   └── main.tsx            # Application entry point\n├── index.html              # Main HTML file including SEO configurations\n├── package.json            # Dependencies and scripts\n├── vite.config.ts          # Vite configuration\n└── tsconfig.json           # TypeScript configuration\n\`\`\`\n\n## 🧩 Components & Sections\nThe website is a Single Page Application (SPA) where sections flow seamlessly to provide an integrated user journey. It is divided into the following components (located in \`src/components/\`):\n\n1. **Header & Footer:** Website header and footer for main links and navigation.\n2. **Hero:** The opening interface presenting the core message "We re-engineer HR operations."\n3. **Stats & AnimatedCounter:** Interactive display of company numbers and statistics.\n4. **Principles:** Core working principles and system values.\n5. **Services:** Displays the six interconnected modules of the system:\n   - Organizational Structuring\n   - Recruitment and Hiring\n   - Regulatory Compliance\n   - Performance Management\n   - Salaries and Benefits\n   - Training and Development\n6. **Sectors:** Targeted business sectors.\n7. **Methodology:** The workflow methodology with partners.\n8. **Impact:** The tangible impact of the provided services.\n9. **Testimonials:** Client reviews and success partners.\n10. **Plans:** Available pricing plans and packages.\n11. **FAQ:** Frequently Asked Questions.\n12. **Articles:** Articles and blog section for HR knowledge sharing.\n13. **Contact & CTA / MobileCTA:** Call to Action prompts and the contact form to get started.\n14. **ScrollReveal:** A wrapper component to add scroll reveal animations to various elements.\n\n## 🚀 Getting Started\n\nTo run the project in your local development environment, follow these steps:\n\n1. **Install Dependencies:**\n   \`\`\`bash\n   npm install\n   \`\`\`\n\n2. **Run the Development Server:**\n   \`\`\`bash\n   npm run dev\n   \`\`\`\n   The website will run on your local environment (usually at \`http://localhost:5173\`).\n\n3. **Lint the Code:**\n   \`\`\`bash\n   npm run lint\n   \`\`\`\n\n4. **Build for Production:**\n   \`\`\`bash\n   npm run build\n   \`\`\`\n\n5. **Preview the Production Build:**\n   \`\`\`bash\n   npm run preview\n   \`\`\`\n\n## 🌐 SEO Optimization\nThe \`index.html\` file includes advanced Search Engine Optimization (SEO) settings, such as:\n- Complete Meta Tags.\n- Open Graph (OG) settings for sharing links on social media platforms (Facebook, Twitter).\n- Schema.org structured data in JSON-LD format to define the organization type for search engines.\n`;

async function run() {
  const projectRef = doc(db, 'projects', 'hindrah');
  
  await setDoc(projectRef, {
    title: 'Hindrah',
    slug: 'hindrah',
    client_name: 'Hindrah HR Establishment',
    summary: 'HR Establishment and Management for Enterprises in Saudi Arabia, featuring a highly interactive landing page.',
    description: markdownDesc,
    image_url: '',
    live_url: '',
    github_url: '',
    technologies: ['React 19', 'TypeScript', 'Vite', 'Framer Motion', 'Tailwind CSS'],
    team_contributions: [
      {
        id: 'tc_hindrah_1',
        team_member_id: 'felopater-nabil',
        role: 'Full Stack Developer',
        contribution_description: 'Developed the interactive SPA using React 19 and Framer Motion, ensuring high performance and advanced SEO configurations.',
        order: 1
      },
      {
        id: 'tc_hindrah_2',
        team_member_id: 'eman-alaa',
        role: 'DevOps Engineer',
        contribution_description: 'Managed the deployment pipelines, cloud hosting, and production optimization for the landing page.',
        order: 2
      }
    ],
    is_featured: true,
    published_at: new Date().toISOString(),
    order: 4,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  
  console.log('Hindrah project has been added successfully!');
}

run().catch(console.error);
