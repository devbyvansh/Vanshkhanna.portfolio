import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  useEffect(() => {
    try {
      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(data);
      }, (error) => {
        console.error("Failed to load projects from firebase", error);
      });
      return () => unsub();
    } catch (err) {
      console.error("Firebase not initialized or error", err);
    }
  }, []);

  return (
    <motion.section 
      ref={containerRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.3 }}
      className="p-8 lg:p-16 border-b border-white/10 bg-[#0A0A0B] relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent pointer-events-none scale-150"></div>
      
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex justify-between items-center mb-12"
        >
          <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] text-white font-bold flex items-center gap-4">
            <span className="w-8 h-[1px] bg-white"></span>
            Project Manifest
          </h3>
          <span className="text-[10px] font-mono opacity-40 italic text-white hidden sm:block border border-white/20 px-2 py-0.5 rounded-sm">SORT: RECENT</span>
        </motion.div>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-8"
        >
        {projects.map((project, index) => (
          <motion.div
            key={project.id || index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' }}
            className="h-full relative group"
          >
            {/* Ambient shadow glow on hover */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 hidden md:block blur-xl transition-all duration-300 -z-10 rounded-xl"></div>
            
            <div 
              className="h-full aspect-square sm:aspect-auto border border-white/10 bg-[#121214] rounded-xl group-hover:border-white/40 transition-colors duration-300 flex flex-col relative z-0"
            >
              <div 
                className="h-[45%] sm:h-64 shrink-0 w-full relative overflow-hidden rounded-t-xl"
              >
                <div className="absolute inset-0 bg-white/5 z-10 group-hover:opacity-0 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent z-10"></div>
                {(project as any).image ? (
                  <motion.img 
                    src={(project as any).image} 
                    alt={project.title}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="w-full h-full object-cover origin-center"
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A1A1C] flex items-center justify-center opacity-30">
                    <span className="font-mono text-xs uppercase tracking-widest text-white">No Asset</span>
                  </div>
                )}
              </div>
              
              <div className="p-4 sm:p-8 flex flex-col flex-1 bg-gradient-to-b from-[#121214] to-[#0A0A0B] rounded-b-xl relative">
                {/* Tech badge moved to content area to avoid overlapping image content */}
                <motion.div 
                   initial={{ y: 5, opacity: 0 }}
                   whileInView={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.1, duration: 0.2 }}
                  className="mb-4 inline-flex self-start px-2 sm:px-3 py-1 bg-white/5 border border-white/20 rounded-full items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  <span className="font-mono text-[9px] text-white uppercase tracking-widest">
                    {(project.techStack || project.tech || [''])[0] || 'SYSTEM'}
                  </span>
                </motion.div>
                
                <div className="flex items-start justify-between mb-2 sm:mb-4 gap-2 sm:gap-4">
                  <h4 className="font-medium tracking-tight text-base sm:text-xl text-white font-display group-hover:text-white transition-colors">{project.title}</h4>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0 mt-0.5 sm:mt-1">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        className="text-white/40 hover:text-white hover:-translate-y-0.5 transition-all"
                      >
                        <Github className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-auto" />
                      </a>
                    )}
                    {(project.liveDemoUrl || project.liveUrl) && (
                      <a 
                        href={project.liveDemoUrl || project.liveUrl} 
                        className="text-white/40 hover:text-white hover:-translate-y-0.5 transition-all"
                      >
                        <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 pointer-events-auto" />
                      </a>
                    )}
                  </div>
                </div>
                
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-8 font-sans line-clamp-2 sm:line-clamp-none">
                  {project.description}
                </p>
                
                <div className="mt-auto pt-4 flex flex-col gap-2">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">Tech stack:</span>
                  <div className="flex gap-2 flex-wrap">
                    {(project.tags || project.techStack || project.tech || []).map((tech: string, i: number) => (
                      <span 
                        key={tech} 
                        className="font-mono text-[10px] text-white/70 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full transition-colors cursor-default uppercase tracking-wider whitespace-nowrap hover:border-white/30 hover:text-white"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        </div>
      </div>
    </motion.section>
  );
}
