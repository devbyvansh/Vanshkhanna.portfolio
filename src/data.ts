import { Activity, BrainCircuit, Code2, Database, Network, Server, Sparkles, Terminal, Wrench } from 'lucide-react';

export const USER_INFO = {
  name: "VANSH KHANNA",
  role: "AI Engineer",
  location: "Delhi, India",
  status: "OPEN TO WORK",
  email: "vanshkhanna800@gmail.com",
  github: "https://github.com/devbyvansh",
  linkedin: "https://www.linkedin.com/in/vanshkhanna09",
  phone: "8860665274",
  intro: "Building intelligent systems with Python, Machine Learning, and Generative AI Passionate about transforming data into impactful solutions Constantly exploring the latest advancements in AI"
};

export const SKILL_CATEGORIES = [
  {
    title: "Programming",
    icon: Code2,
    skills: [
      { name: "Python", level: 95 },
      { name: "SQL", level: 90 },
      { name: "NumPy", level: 85 },
      { name: "Pandas", level: 88 }
    ]
  },
  {
    title: "Machine Learning",
    icon: BrainCircuit,
    skills: [
      { name: "Regression", level: 92 },
      { name: "Classification", level: 94 },
      { name: "Clustering", level: 85 },
      { name: "Feature Engineering", level: 90 },
      { name: "Model Evaluation", level: 88 }
    ]
  },
  {
    title: "Deep Learning",
    icon: Network,
    skills: [
      { name: "TensorFlow", level: 92 },
      { name: "Keras", level: 88 },
      { name: "PyTorch", level: 85 },
      { name: "CNN", level: 90 },
      { name: "Neural Networks", level: 95 }
    ]
  },
  {
    title: "Data Science",
    icon: Activity,
    skills: [
      { name: "Data Cleaning", level: 95 },
      { name: "EDA", level: 90 },
      { name: "Visualization", level: 88 },
      { name: "Statistics", level: 85 }
    ]
  },
  {
    title: "AI",
    icon: Sparkles,
    skills: [
      { name: "Generative AI", level: 95 },
      { name: "NLP", level: 90 },
      { name: "LLMs", level: 92 },
      { name: "Prompt Engineering", level: 98 },
      { name: "AI Agents", level: 88 }
    ]
  }
];

export const JOURNEY = [
  {
    id: "01",
    title: "Python Foundations",
    description: "Learned Python programming, OOP, data structures, functions, modules, and problem-solving."
  },
  {
    id: "02",
    title: "SQL & Databases",
    description: "Learned SQL, database design, querying, joins, aggregation, and data management."
  },
  {
    id: "03",
    title: "Data Analysis",
    description: "Worked with NumPy, Pandas, Data Cleaning, Data Visualization, and Exploratory Data Analysis."
  },
  {
    id: "04",
    title: "Machine Learning",
    description: "Built regression, classification, clustering, feature engineering, model evaluation, and predictive models."
  },
  {
    id: "05",
    title: "Deep Learning",
    description: "Learned Neural Networks, TensorFlow, Keras, CNNs, and advanced AI architectures."
  },
  {
    id: "06",
    title: "Artificial Intelligence",
    description: "Focused on NLP, Generative AI, LLMs, Prompt Engineering, AI Agents, and Intelligent Systems."
  }
];

export const PROJECTS = [
  {
    id: "01",
    title: "NexusDB Dashboard",
    description: "A high-performance analytics dashboard for a distributed database. Real-time telemetry, query optimization, and latency tracking visualization.",
    tech: ["React", "TypeScript", "D3.js", "WebSockets"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "02",
    title: "Aura Authentication",
    description: "A scalable, zero-trust authentication microservice supporting passwordless login, OAuth 2.0, and biometric MFA flows.",
    tech: ["Go", "Redis", "PostgreSQL", "Docker"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "03",
    title: "Terminal.sh",
    description: "Browser-based terminal emulator providing SSH access to remote containers with full interactive TTY support.",
    tech: ["Node.js", "Xterm.js", "Socket.io", "C++"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2000&auto=format&fit=crop"
  },
  {
    id: "04",
    title: "Distributed Cache",
    description: "In-memory LRU cache with consistent hashing and raft consensus for high availability.",
    tech: ["Rust", "gRPC", "Tokio"],
    liveUrl: "#",
    githubUrl: "#",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop"
  }
];

export const CERTIFICATIONS = [
  {
    id: "CRT-01",
    title: "Machine Learning Specialization",
    issuer: "Stanford / DeepLearning.AI",
    date: "2024",
    skills: ["Regression", "Classification", "Recommender Systems"],
    status: "VERIFIED",
    url: "https://www.coursera.org/specializations/machine-learning-introduction"
  },
  {
    id: "CRT-02",
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    date: "2024",
    skills: ["Neural Networks", "CNNs", "Transformers"],
    status: "VERIFIED",
    url: "https://www.coursera.org/specializations/deep-learning"
  },
  {
    id: "CRT-03",
    title: "Generative AI Fundamentals",
    issuer: "Google Cloud",
    date: "2025",
    skills: ["LLMs", "Prompt Engineering", "Responsible AI"],
    status: "VERIFIED",
    url: "https://cloud.google.com/training/generative-ai"
  },
  {
    id: "CRT-04",
    title: "Data Science Professional",
    issuer: "IBM",
    date: "2023",
    skills: ["Python", "SQL", "Data Visualization"],
    status: "VERIFIED",
    url: "https://www.coursera.org/professional-certificates/ibm-data-science"
  }
];
