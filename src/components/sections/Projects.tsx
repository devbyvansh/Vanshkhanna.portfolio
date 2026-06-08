import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Folder, Github, ExternalLink } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.2, ease: 'easeOut' } 
  }
};

interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  category: string;
}

const projects: Project[] = [
  { id: '1', title: 'Cyber Security Dashboard', description: 'Advanced cybersecurity panel with real-time firewalls and telemetry visualizations.', tech: ['React', 'Node.js', 'D3.js', 'Firebase'], category: 'web', githubUrl: '#', liveUrl: '#' },
  { id: '2', title: 'Decentralized Identity Engine', description: 'Programmatic cryptographic nodes tracking credentials with key signing paradigms.', tech: ['TypeScript', 'Solidity', 'Express'], category: 'ai', githubUrl: '#', liveUrl: '#' },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('all');
  const filteredProjects = activeCategory === 'all' ? projects : projects.filter(p => p.category === activeCategory);

  return (
    <motion.section 
      id="projects"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px" }}
      transition={{ duration: 0.2 }}
      className="p-8 lg:p-16 border-b border-white/10 bg-[#0A0A0B] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex justify-between items-center mb-12"
        >
          <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] text-white font-bold flex items-center gap-4">
            <span className="w-2 h-2 bg-[#00FF41] inline-block shadow-[0_0_8px_#00FF41]"></span>
            System Node Registry
          </h3>
        </motion.div>

        {/* Filter Buttons */}
        <div className="flex gap-4 mb-8 font-mono text-xs">
          {['all', 'web', 'ai'].map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 border transition-all cursor-pointer ${activeCategory === cat ? 'bg-[#00FF41]/10 text-[#00FF41] border-[#00FF41]/40' : 'border-white/10 text-white/50 hover:text-white'}`}
            >
              {cat.toUpperCase()}Registry
            </button>
          ))}
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                layout
                className="group border border-white/10 bg-[#121214] p-6 hover:border-[#00FF41]/40 transition-colors duration-300 rounded-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <Folder className="w-8 h-8 text-[#00FF41]/80" />
                  <div className="flex gap-3">
                    {project.githubUrl && <a href={project.githubUrl} className="text-white/40 hover:text-[#00FF41] transition-colors"><Github className="w-5 h-5" /></a>}
                    {project.liveUrl && <a href={project.liveUrl} className="text-white/40 hover:text-[#00FF41] transition-colors"><ExternalLink className="w-5 h-5" /></a>}
                  </div>
                </div>
                <h4 className="font-bold tracking-widest text-lg text-white uppercase group-hover:text-[#00FF41] transition-colors mb-2">{project.title}</h4>
                <p className="text-sm text-white/60 font-light mb-6 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="font-mono text-[10px] text-white/50 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">{t}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}