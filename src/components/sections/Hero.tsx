import React from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { FileText, Download, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } }
};

const titleContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.02, delayChildren: 0.15 } }
};

const charVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } }
};

export default function Hero() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Dummy user metadata fallback, replace with your actual state or prop
  const userInfo = {
    role: "Full-Stack Engineer & AI Dev",
    intro: "Building production-grade web applications with pixel-perfect layouts, interactive state orchestrations, and secure backend servers."
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center bg-[#0A0A0B] overflow-hidden p-8 lg:p-16 border-b border-white/10">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      <motion.div style={{ opacity }} className="relative z-10 flex flex-col lg:flex-row justify-between w-full h-full max-w-6xl mx-auto items-center pt-8 lg:pt-16">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-2xl text-left"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4 text-[#00FF41]">
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-ping" />
            <span className="font-mono text-xs uppercase tracking-widest">{userInfo.role}</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-3xl sm:text-6xl md:text-7xl xl:text-[90px] font-display font-black leading-[0.85] tracking-tighter mb-8 text-white mt-8 uppercase w-full">
            VANSH KHANNA
            <motion.div variants={titleContainerVariants} className="flex flex-nowrap whitespace-nowrap text-transparent overflow-hidden" style={{ WebkitTextStroke: '1px #fff' }}>
              {"DEVELOPER".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={charVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </motion.h1>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 font-mono text-xs sm:text-sm mb-8 text-white/60">
            <div className="flex items-center gap-2">
              <span className="text-[#00FF41]">&gt;</span> Loc: New Delhi, India
            </div>
            <div className="hidden sm:inline text-white/20">|</div>
            <div className="flex items-center gap-2">
              <span className="text-[#00FF41]">&gt;</span> Status: Ready for Production
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.15 }}
            className="mt-8 text-sm md:text-lg font-light max-w-md text-white/70 leading-relaxed min-h-[80px]"
          >
            {userInfo.intro}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-8">
            <button 
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-6 py-2.5 bg-[#00FF41]/5 border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/10 font-mono text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-sm flex items-center gap-2 group cursor-pointer"
            >
              Explore Node Projects
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <a 
              href="/resume.pdf" 
              download
              className="px-6 py-2.5 bg-transparent border border-white/20 text-white/70 hover:border-[#00FF41]/30 hover:text-[#00FF41] hover:bg-[#00FF41]/10 font-mono text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-sm flex items-center gap-2 group cursor-pointer"
            >
              Request Resume
              <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}