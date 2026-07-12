/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Journey from './components/sections/Journey';
import Projects from './components/sections/Projects';
import GithubActivity from './components/sections/GithubActivity';
import ContactModal from './components/ui/ContactModal';
import CertificationsModal from './components/ui/CertificationsModal';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCertificationsOpen, setIsCertificationsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 56;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        isContactOpen ||
        isCertificationsOpen
      ) {
        return;
      }
      
      switch(e.key.toLowerCase()) {
        case 'h': scrollTo('hero'); break;
        case 'p': scrollTo('projects'); break;
        case 'j': scrollTo('journey'); break;
        case 'c': setIsCertificationsOpen(true); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isContactOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -60% 0px' }
    );

    const sections = ['hero', 'projects', 'journey'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans flex selection:bg-[#ffffff]/30 selection:text-white w-full relative">
      {/* Left Control Rail */}
      <aside 
        className="w-16 border-r border-white/10 hidden xl:flex flex-col items-center py-8 gap-12 bg-[#0D0D0E] shrink-0 fixed inset-y-0 left-0 z-50"
      >
        <div className="w-8 h-8 border-2 border-[#ffffff] flex items-center justify-center font-bold text-xs italic text-white">VK</div>
        <nav className="flex flex-col gap-8 relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/5 -z-10"></div>
          <button onClick={() => scrollTo('hero')} className={`relative flex items-center justify-center w-4 h-4 transition-all duration-300 ${activeSection === 'hero' ? 'bg-[#ffffff] shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-125' : 'bg-white opacity-40 hover:opacity-100 hover:bg-[#ffffff] hover:scale-110'}`} title="Home (H)">
            {activeSection === 'hero' && <span className="absolute w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_5px_#fff]"></span>}
          </button>
          <button onClick={() => scrollTo('projects')} className={`relative flex items-center justify-center w-4 h-4 border-2 transition-all duration-300 rotate-45 ${activeSection === 'projects' ? 'border-[#ffffff] bg-[#ffffff]/20 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-125' : 'border-white bg-transparent opacity-40 hover:opacity-100 hover:border-[#ffffff] hover:scale-110'}`} title="Projects (P)">
            {activeSection === 'projects' && <span className="absolute w-1.5 h-1.5 bg-[#ffffff] rounded-full animate-pulse blur-[1px]"></span>}
          </button>
          <button onClick={() => scrollTo('journey')} className={`relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-all duration-300 ${activeSection === 'journey' ? 'border-[#ffffff] bg-[#ffffff]/20 shadow-[0_0_15px_rgba(255,255,255,0.3)] scale-125' : 'border-white bg-transparent opacity-40 hover:opacity-100 hover:border-[#ffffff] hover:scale-110'}`} title="Journey (J)">
            {activeSection === 'journey' && <span className="absolute w-1.5 h-1.5 bg-[#ffffff] rounded-full animate-pulse blur-[1px]"></span>}
          </button>
          <button onClick={() => setIsCertificationsOpen(true)} className={`relative flex items-center justify-center transition-all duration-300 ${isCertificationsOpen ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] scale-110' : 'text-white/40 hover:text-white hover:scale-110'}`} title="Certifications (C)">
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 2H3C2.44772 2 2 2.44772 2 3V15C2 15.5523 2.44772 16 3 16H11C11.5523 16 12 15.5523 12 15V5L9 2Z"/><path d="M8 2V5H12"/></svg>
            {isCertificationsOpen && <span className="absolute -right-[2px] -top-[2px] w-1.5 h-1.5 bg-white rounded-full animate-pulse blur-[0.5px]"></span>}
          </button>
        </nav>
        <div className="mt-auto flex flex-col items-center gap-4">
          <div className="[writing-mode:vertical-lr] text-[10px] uppercase tracking-[0.3em] font-mono opacity-30 text-white">v2.0.48_STABLE</div>
          <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 xl:ml-16">
        <Header onContactClick={() => setIsContactOpen(true)} onCertificationsClick={() => setIsCertificationsOpen(true)} />
        
        <main className="flex-1 flex flex-col relative bg-[#0A0A0B]">
          <div id="hero" className="w-full border-b border-white/10 relative">
            <Hero />
          </div>
             
          <div id="projects" className="w-full border-b border-white/10">
            <Projects />
          </div>

          <div id="journey" className="w-full border-b border-white/10">
            <Journey />
          </div>

          <div id="github" className="w-full border-b border-white/10">
            <GithubActivity />
          </div>
        </main>
        
        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="h-20 border-t border-white/10 flex items-center justify-center px-8 bg-[#0D0D0E] shrink-0 text-white/60 font-mono text-xs select-none"
        >
          &copy; 2026 Vansh Khanna. All Rights Reserved.
        </motion.footer>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <CertificationsModal isOpen={isCertificationsOpen} onClose={() => setIsCertificationsOpen(false)} />
    </div>
  );
}
