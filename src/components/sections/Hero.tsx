import { motion, useScroll, useTransform } from 'motion/react';
import { USER_INFO as STATIC_USER_INFO } from '../../data';
import { FileCode2, MapPin, FileText, Download } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

const titleContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.4 } }
};

const charVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)", scale: 0.95 },
  show: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

export default function Hero() {
  const [userInfo, setUserInfo] = useState(STATIC_USER_INFO);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'portfolio_settings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserInfo(prev => ({
          ...prev,
          name: data.name || prev.name,
          role: data.role || prev.role,
          email: data.email || prev.email,
          phone: data.phoneNumber || prev.phone,
          location: data.location || prev.location,
          intro: data.aboutSection || prev.intro,
          github: data.githubUsername ? `https://github.com/${data.githubUsername}` : prev.github,
          linkedin: data.linkedinUrl || prev.linkedin,
          status: data.status || prev.status,
          resumeUrl: data.resumeUrl || (prev as any).resumeUrl || '#',
          cvUrl: data.cvUrl || (prev as any).cvUrl || '#'
        }));
      }
    });
    return () => unsub();
  }, []);

  const nameInput = userInfo.name || "VANSH KHANNA";

  const handleViewDocument = (e: React.MouseEvent<HTMLAnchorElement>, url?: string) => {
    if (!url || url === '#') {
      e.preventDefault();
      return;
    }
    if (url.startsWith('data:')) {
      e.preventDefault();
      try {
        const arr = url.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr], {type: mime});
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
      } catch(err) {
        console.error("Failed to decode base64 document", err);
        window.open(url, '_blank');
      }
    }
  };

  const heroRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section ref={heroRef} className="p-8 lg:p-12 relative flex-1 flex flex-col justify-between min-h-[500px] lg:min-h-[calc(100vh-3.5rem)] overflow-hidden">
      
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <motion.div style={{ opacity }} className="relative z-10 flex flex-col lg:flex-row justify-between w-full h-full max-w-6xl mx-auto items-center pt-8 lg:pt-16">
        <motion.div
           variants={containerVariants}
          initial="hidden"
          animate="show"
          className="relative z-10 lg:w-1/2 flex-shrink-0"
        >
          {/* Top: SYSTEM INITIALIZED */}
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-12">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </div>
            <span className="text-xs font-mono tracking-[0.2em] text-white/50 uppercase">System Initialized</span>
          </motion.div>
          
          {/* Terminal Layout with Clean Premium Typography */}
          <motion.div variants={itemVariants} className="space-y-8 font-sans">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">User</span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display tracking-tight text-white font-medium">{userInfo.name}</h1>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Role</span>
              <h2 className="text-2xl sm:text-3xl font-display tracking-tight text-white/80">{userInfo.role}</h2>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Status</span>
              <div className="flex items-center gap-3">
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
                <span className="text-lg font-mono tracking-tight text-white/80 uppercase">{userInfo.status || "ONLINE"}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 max-w-md pt-4">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Mission</span>
              <p className="text-lg font-light text-white/70 leading-relaxed font-sans">
                {userInfo.intro}
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-1.5 h-5 bg-white/70 ml-2 align-middle"
                />
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-12">
            <a 
              href={(userInfo as any).resumeUrl && (userInfo as any).resumeUrl !== '#' ? (userInfo as any).resumeUrl : "#"} 
              target={(userInfo as any).resumeUrl && (userInfo as any).resumeUrl !== '#' && !(userInfo as any).resumeUrl.startsWith('data:') ? "_blank" : "_self"}
              onClick={(e) => handleViewDocument(e, (userInfo as any).resumeUrl)}
              rel="noopener noreferrer"
              className="px-6 py-3 bg-white text-black hover:bg-white/90 font-medium text-sm transition-all rounded-full flex items-center gap-2 group"
            >
              <FileText className="w-4 h-4" />
              View Resume
            </a>
            <a 
              href={(userInfo as any).cvUrl && (userInfo as any).cvUrl !== '#' ? (userInfo as any).cvUrl : "#"} 
              target={(userInfo as any).cvUrl && (userInfo as any).cvUrl !== '#' && !(userInfo as any).cvUrl.startsWith('data:') ? "_blank" : "_self"}
              onClick={(e) => handleViewDocument(e, (userInfo as any).cvUrl)}
              rel="noopener noreferrer"
              className="px-6 py-3 bg-transparent border border-white/20 text-white hover:border-white/40 hover:bg-white/5 font-medium text-sm transition-all rounded-full flex items-center gap-2 group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              Download CV
            </a>
          </motion.div>
        </motion.div>

        {/* Right side graphic - Animated Neural Network */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="hidden lg:flex w-1/2 justify-end items-center relative h-full"
        >
          <NetworkVisualization />
        </motion.div>

      </motion.div>
    </section>
  );
}

const NetworkVisualization = () => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes = [
    { id: 'ml', label: 'Machine Learning', x: 50, y: 10 },
    { id: 'dl', label: 'Deep Learning', x: 85, y: 35 },
    { id: 'genai', label: 'Generative AI', x: 75, y: 80 },
    { id: 'python', label: 'Python', x: 25, y: 80 },
    { id: 'rag', label: 'RAG', x: 15, y: 35 },
    { id: 'agents', label: 'Agents', x: 50, y: 45 },
  ];

  const edges = [
    { source: 'agents', target: 'ml' },
    { source: 'agents', target: 'dl' },
    { source: 'agents', target: 'genai' },
    { source: 'agents', target: 'python' },
    { source: 'agents', target: 'rag' },
    { source: 'ml', target: 'dl' },
    { source: 'dl', target: 'genai' },
    { source: 'genai', target: 'python' },
    { source: 'python', target: 'rag' },
    { source: 'rag', target: 'ml' }
  ];

  return (
    <div className="relative w-[500px] h-[500px]">
      {/* Background soft glow */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-blue-500/20 rounded-full blur-[100px]" 
      />

      {/* Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {edges.map((edge, i) => {
          const source = nodes.find(n => n.id === edge.source)!;
          const target = nodes.find(n => n.id === edge.target)!;
          const isHovered = hoveredNode === source.id || hoveredNode === target.id;
          
          return (
            <g key={i}>
              {/* Base line */}
              <motion.line 
                x1={`${source.x}%`} y1={`${source.y}%`} 
                x2={`${target.x}%`} y2={`${target.y}%`}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
              {/* Animated particle flow */}
              <motion.line 
                x1={`${source.x}%`} y1={`${source.y}%`} 
                x2={`${target.x}%`} y2={`${target.y}%`}
                stroke={isHovered ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.15)"}
                strokeWidth={isHovered ? "2" : "1.5"}
                strokeDasharray="4 20"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: -24 }}
                transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: "linear" }}
              />
            </g>
          );
        })}
      </svg>

      {/* Nodes */}
      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: `${node.x}%`, top: `${node.y}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + Math.random() * 0.5 }}
        >
          {/* Node point */}
          <div 
            className="relative group cursor-pointer p-4"
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Pulse */}
            <motion.div 
              animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-white/30 rounded-full pointer-events-none"
            />
            {/* Core */}
            <div className={`w-3 h-3 rounded-full border border-white/50 transition-all duration-300 ${hoveredNode === node.id ? 'bg-white shadow-[0_0_20px_#fff] scale-150' : 'bg-[#0A0A0B]'}`} />
            
            {/* Label */}
            <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#121214]/90 backdrop-blur-md border border-white/10 transition-all duration-300 pointer-events-none z-20
              ${hoveredNode === node.id ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
            >
              <span className="text-[10px] font-mono text-white/90 tracking-widest uppercase">{node.label}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
