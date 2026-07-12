import { Github, Linkedin, Terminal, ShieldAlert, Menu, X } from 'lucide-react';
import { USER_INFO } from '../../data';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  onContactClick: () => void;
  onCertificationsClick: () => void;
}

export default function Header({ onContactClick, onCertificationsClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className="sticky top-0 z-40 h-14 shrink-0 border-b border-white/10 flex items-center px-4 md:px-8 justify-between bg-[#0A0A0B]/80 backdrop-blur-md"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-white font-display font-medium tracking-tight text-sm cursor-pointer" onClick={() => scrollTo('hero')}>
          <Terminal className="w-4 h-4 text-white" />
          <span className="text-white font-mono uppercase hover:text-white transition-colors">{USER_INFO.name}</span>
        </div>
        <div className="h-3 w-[1px] bg-white/20 hidden lg:block"></div>
        <div className="text-[10px] font-mono text-white/50 tracking-widest hidden lg:block uppercase">SYS_ACTIVE</div>
      </div>
      
      {/* Desktop Navigation */}
      <nav className="hidden xl:flex flex-1 justify-center items-center gap-4 lg:gap-8 text-[11px] font-mono text-white/50 lowercase tracking-widest">
        <button onClick={() => scrollTo('hero')} className="group relative px-3 py-1.5 transition-colors hover:text-white overflow-hidden">
          <span className="relative z-10">/home</span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
          <span className="absolute inset-0 bg-white/[0.03] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></span>
        </button>
        <button onClick={() => scrollTo('projects')} className="group relative px-3 py-1.5 transition-colors hover:text-white overflow-hidden">
          <span className="relative z-10">/projects</span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
          <span className="absolute inset-0 bg-white/[0.03] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></span>
        </button>
        <button onClick={() => scrollTo('journey')} className="group relative px-3 py-1.5 transition-colors hover:text-white overflow-hidden">
          <span className="relative z-10">/journey</span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
          <span className="absolute inset-0 bg-white/[0.03] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></span>
        </button>
        <button onClick={onCertificationsClick} className="group relative px-3 py-1.5 transition-colors hover:text-white overflow-hidden flex items-center">
          <span className="relative z-10 flex items-center gap-1.5">
            /certifications
            <svg width="12" height="14" viewBox="0 0 14 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 -ml-4 group-hover:ml-0"><path d="M9 2H3C2.44772 2 2 2.44772 2 3V15C2 15.5523 2.44772 16 3 16H11C11.5523 16 12 15.5523 12 15V5L9 2Z"/><path d="M8 2V5H12"/></svg>
          </span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
          <span className="absolute inset-0 bg-white/[0.03] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></span>
        </button>
        <Link to="/admin" className="group relative px-3 py-1.5 transition-colors hover:text-white overflow-hidden">
          <span className="relative z-10">/login</span>
          <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right group-hover:origin-left"></span>
          <span className="absolute inset-0 bg-white/[0.03] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"></span>
        </Link>
      </nav>

        <div className="flex items-center gap-3 sm:gap-4 text-[10px] font-mono text-white">
          <nav className="flex items-center gap-3 sm:gap-4 text-white/60">
            <a href="https://github.com/devbyvansh" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Github className="w-4 h-4" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/vanshkhanna09" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Linkedin className="w-4 h-4" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="tel:8860665274" className="sm:hidden hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </a>
            <button onClick={onContactClick} className="hidden sm:block ml-2 px-3 sm:px-4 py-1.5 sm:py-2 border border-white/30 bg-white/5 text-white text-[9px] sm:text-[10px] font-mono tracking-widest uppercase hover:bg-white/20 hover:border-white/60 transition-all rounded-sm shadow-none">
              Contact
            </button>
          </nav>
        
        {/* Mobile menu toggle */}
        <button 
          className="xl:hidden flex text-white/60 hover:text-white transition-colors items-center gap-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-14 left-0 w-full bg-[#0A0A0B]/95 backdrop-blur-xl border-b border-white/10 xl:hidden flex flex-col items-center py-6 gap-6 z-50 shadow-2xl overflow-hidden"
          >
            <nav className="flex flex-col items-center gap-2 text-[12px] font-mono text-white/80 lowercase tracking-widest w-full">
              <button onClick={() => scrollTo('hero')} className="hover:text-white transition-colors w-full text-center py-4 border-b border-white/5">/home</button>
              <button onClick={() => scrollTo('projects')} className="hover:text-white transition-colors w-full text-center py-4 border-b border-white/5">/projects</button>
              <button onClick={() => scrollTo('journey')} className="hover:text-white transition-colors w-full text-center py-4 border-b border-white/5">/journey</button>
              <button onClick={() => { setMobileMenuOpen(false); onCertificationsClick(); }} className="hover:text-white transition-colors w-full text-center py-4 border-b border-white/5">/certifications</button>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors w-full text-center py-4 border-b border-white/5 block">/login</Link>
            </nav>
            
            <button onClick={() => { setMobileMenuOpen(false); onContactClick(); }} className="mt-4 px-6 py-3 border border-white/30 bg-white/5 text-white text-[10px] font-mono tracking-widest uppercase hover:bg-white/20 hover:border-white/60 transition-all rounded-sm w-3/4 max-w-xs shadow-none">
              Contact
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
