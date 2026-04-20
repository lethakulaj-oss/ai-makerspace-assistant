import {
  Cpu,
  Boxes,
  Users,
  BookOpen,
  FolderKanban,
  CalendarDays,
} from "lucide-react";

export const stats = [
  {
    label: "GPU Workstations",
    value: "2",
    description: "Dedicated AI towers for project development",
    icon: <Cpu size={20} />,
  },
  {
    label: "Portal Modules",
    value: "8+",
    description: "Assistant, hardware, users, templates, learning, and more",
    icon: <Boxes size={20} />,
  },
  {
    label: "Active Users",
    value: "32",
    description: "Students, faculty, staff, and administrators",
    icon: <Users size={20} />,
  },
  {
    label: "Learning Assets",
    value: "14",
    description: "Guides, tutorials, templates, and deployment help",
    icon: <BookOpen size={20} />,
  },
  {
    label: "Project Templates",
    value: "6",
    description: "Reusable paths for popular AI project types",
    icon: <FolderKanban size={20} />,
  },
  {
    label: "Upcoming Workshops",
    value: "4",
    description: "Hands-on sessions for AI builders and researchers",
    icon: <CalendarDays size={20} />,
  },
];

export const hardwareResources = [
  {
    name: "AI Workstation – RTX 4500",
    category: "GPU Workstation",
    status: "Available",
    bestFor: "Deep learning, LLMs, computer vision",
    description:
      "High-performance workstation suitable for GPU-heavy model development and advanced AI experimentation.",
    specs: [
      "NVIDIA RTX 4500 ADA • 24 GB GDDR6",
      "Intel Core Ultra 9 285 • 24 cores",
      "64 GB DDR5 memory",
      "2 TB NVMe SSD",
      "Windows 11 Pro",
    ],
  },
  {
    name: "AI Workstation – RTX 4000",
    category: "GPU Workstation",
    status: "In Use",
    bestFor: "ML training, data science, model testing",
    description:
      "Balanced workstation for AI development, experimentation, and mid-to-heavy compute workloads.",
    specs: [
      "NVIDIA RTX 4000 ADA • 20 GB GDDR6",
      "Intel Core Ultra 9 285 • 24 cores",
      "64 GB DDR5 memory",
      "2 TB NVMe SSD",
      "Windows 11 Pro",
    ],
  },
  {
    name: "Dell 27” 4K USB-C Hub Monitor",
    category: "Display",
    status: "Available",
    bestFor: "Visualization, dashboards, model monitoring",
    description:
      "4K external display for workstation setups, data visualization, and presentation-ready project demos.",
    specs: [
      "Dell Pro 27 Plus 4K USB-C Hub Monitor",
      "27-inch display",
      "4K resolution",
      "USB-C hub support",
      "Advanced exchange support",
    ],
  },
];

export const softwareResources = [
  {
    name: "Python",
    category: "Programming",
    description: "Core language for AI, data science, automation, APIs, and experimentation.",
  },
  {
    name: "FastAPI",
    category: "Backend",
    description: "Backend framework for serving project assistant recommendations and APIs.",
  },
  {
    name: "PyTorch",
    category: "ML Framework",
    description: "Deep learning framework for model development, experimentation, and training.",
  },
  {
    name: "TensorFlow",
    category: "ML Framework",
    description: "Neural network and production-ready ML workflows for broader project support.",
  },
  {
    name: "Hugging Face",
    category: "Model Hub",
    description: "LLM/model hosting, inference resources, and deployment ecosystem.",
  },
  {
    name: "Docker",
    category: "Deployment",
    description: "Containerization support for reliable app packaging and deployment.",
  },
  {
    name: "Jupyter",
    category: "Notebook",
    description: "Interactive experimentation environment for AI, analytics, and prototyping.",
  },
  {
    name: "VS Code",
    category: "IDE",
    description: "Primary development environment for frontend, backend, and AI workflows.",
  },
];

export const learningResources = [
  {
    title: "Machine Learning Crash Course",
    type: "Course",
    description: "Google's free ML course covering fundamentals, TensorFlow, and real-world applications.",
    url: "https://developers.google.com/machine-learning/crash-course",
  },
  {
    title: "Deep Learning Specialization",
    type: "Coursera",
    description: "Andrew Ng's deep learning series covering neural networks, CNNs, RNNs, and more.",
    url: "https://www.coursera.org/specializations/deep-learning",
  },
  {
    title: "Hugging Face NLP Course",
    type: "Documentation",
    description: "Free course on transformers, fine-tuning, and deploying NLP models with Hugging Face.",
    url: "https://huggingface.co/learn/nlp-course",
  },
  {
    title: "FastAPI Official Documentation",
    type: "Documentation",
    description: "Backend setup patterns for serving project recommendations and APIs.",
    url: "https://fastapi.tiangolo.com",
  },
  {
    title: "PyTorch Tutorials",
    type: "Tutorial",
    description: "Official PyTorch tutorials for deep learning, computer vision, and NLP projects.",
    url: "https://pytorch.org/tutorials",
  },
  {
    title: "Docker Getting Started Guide",
    type: "Deployment",
    description: "Practical guide for packaging AI apps into containers for repeatable deployment.",
    url: "https://docs.docker.com/get-started",
  },
  {
    title: "Kaggle Learn",
    type: "Course",
    description: "Free micro-courses on Python, ML, deep learning, data visualization, and more.",
    url: "https://www.kaggle.com/learn",
  },
  {
    title: "CS50 AI with Python",
    type: "Course",
    description: "Harvard's free AI course covering search, knowledge, uncertainty, and neural networks.",
    url: "https://cs50.harvard.edu/ai",
  },
];

export const templates = [
  {
    name: "Sentiment Analysis Pipeline",
    level: "Beginner",
    description: "Classic NLP workflow with preprocessing, training, evaluation, and reporting.",
  },
  {
    name: "Image Classification System",
    level: "Intermediate",
    description: "Computer vision starter project with model training and hardware guidance.",
  },
  {
    name: "AI Chatbot Assistant",
    level: "Intermediate",
    description: "Conversational assistant project using APIs, prompts, and deployment basics.",
  },
  {
    name: "Recommendation Engine",
    level: "Advanced",
    description: "Project template for matching content, users, or resources with ranked outputs.",
  },
  {
    name: "Forecasting Dashboard",
    level: "Intermediate",
    description: "Time-series analytics path with model selection, visualization, and monitoring.",
  },
  {
    name: "Research Workflow Assistant",
    level: "Advanced",
    description: "A faculty/student helper for summarization, planning, and research support tasks.",
  },
];

export const users = [
  {
    name: "Jayanth Reddy",
    role: "Admin",
    department: "AI Makerspace",
    skill: "Advanced",
    project: "Project Development System",
    status: "Active",
  },
  {
    name: "A. Stelling",
    role: "Faculty",
    department: "University at Albany",
    skill: "Advanced",
    project: "Resource Planning",
    status: "Active",
  },
  {
    name: "Student Researcher 1",
    role: "Student",
    department: "Data Science",
    skill: "Intermediate",
    project: "Vision Prototype",
    status: "Active",
  },
  {
    name: "Student Researcher 2",
    role: "Student",
    department: "Computer Science",
    skill: "Beginner",
    project: "Chatbot MVP",
    status: "Pending",
  },
  {
    name: "Lab Support Staff",
    role: "Staff",
    department: "AI Makerspace",
    skill: "Intermediate",
    project: "Workshop Operations",
    status: "Active",
  },
];

export const workshops = [
  {
    date: "Apr 10",
    title: "AI Systems in Practice",
    description: "Workflows, local models, and compute guidance for makerspace users.",
  },
  {
    date: "Apr 16",
    title: "FastAPI + Frontend Integration",
    description: "Hands-on session on connecting project forms with backend recommendation APIs.",
  },
  {
    date: "Apr 22",
    title: "Hardware Readiness for AI Projects",
    description: "How to choose the right workstation, monitor, and software stack.",
  },
  {
    date: "Apr 29",
    title: "Demo Day Preparation",
    description: "Refine UI, system story, and technical explanation for faculty demos.",
  },
];
