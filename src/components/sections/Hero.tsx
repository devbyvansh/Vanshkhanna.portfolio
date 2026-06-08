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
  hidden: { opacity: 0, y: 40, filter: "blur(10px)", scale: 0.9 },
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
          className="relative z-10 lg:w-3/5 flex-shrink-0"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-2 mb-4 text-[#00FF41]">
            <div className="h-[1px] w-8 bg-[#00FF41]"></div>
            <span className="text-[10px] font-mono tracking-[0.5em]">CORE_DIRECTIVE</span>
            <span className="text-[10px] font-mono opacity-60 ml-2 border border-[#00FF41]/30 px-2 py-0.5 rounded-sm bg-[#00FF41]/5 backdrop-blur-sm">SYS.STATUS: {userInfo.status}</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-3xl sm:text-6xl md:text-7xl xl:text-[90px] font-display font-black leading-[0.85] tracking-tighter mb-8 text-white mt-8 uppercase w-full">
            <span className="block text-2xl sm:text-5xl md:text-6xl xl:text-[60px] text-white/90 tracking-tight mb-2">
              HI, I AM
            </span>
            <motion.div variants={titleContainerVariants} className="flex flex-nowrap whitespace-nowrap text-transparent overflow-hidden" style={{ WebkitTextStroke: '1px #fff' }}>
              {Array.from(nameInput).map((char, index) => (
                <motion.span
                  key={index}
                  variants={charVariants}
                  className={char === " " ? "w-3 sm:w-5 md:w-8" : "inline-block drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"}
                  style={{ opacity: 0.9 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.div>
          </motion.h1>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 font-mono text-xs sm:text-sm mb-8 text-white/60">
            <div className="flex items-center gap-2 border border-white/10 bg-white/5 py-1.5 px-3 rounded-sm backdrop-blur-sm">
              <MapPin className="w-3 h-3 text-[#00FF41]" />
              <span>LOC: {userInfo.location}</span>
            </div>
            <div className="flex items-center gap-2 border border-white/10 bg-white/5 py-1.5 px-3 rounded-sm backdrop-blur-sm">
              <FileCode2 className="w-3 h-3 text-[#00FF41]" />
              <span>ROLE: {userInfo.role}</span>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-8 text-sm md:text-lg font-light max-w-md text-white/70 leading-relaxed min-h-[80px]"
          >
            {userInfo.intro}
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear", delay: 1 }}
              className="inline-block w-[0.5em] h-[1em] bg-[#00FF41] ml-1 align-middle"
            />
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-8">
            <a 
              href={(userInfo as any).resumeUrl && (userInfo as any).resumeUrl !== '#' ? (userInfo as any).resumeUrl : "#"} 
              target={(userInfo as any).resumeUrl && (userInfo as any).resumeUrl !== '#' && !(userInfo as any).resumeUrl.startsWith('data:') ? "_blank" : "_self"}
              onClick={(e) => handleViewDocument(e, (userInfo as any).resumeUrl)}
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-[#00FF41]/5 border border-[#00FF41]/30 text-[#00FF41] hover:bg-[#00FF41]/10 font-mono text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-sm flex items-center gap-2 group cursor-pointer"
            >
              <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
              View Resume
            </a>
            <a 
              href={(userInfo as any).cvUrl && (userInfo as any).cvUrl !== '#' ? (userInfo as any).cvUrl : "#"} 
              target={(userInfo as any).cvUrl && (userInfo as any).cvUrl !== '#' && !(userInfo as any).cvUrl.startsWith('data:') ? "_blank" : "_self"}
              onClick={(e) => handleViewDocument(e, (userInfo as any).cvUrl)}
              rel="noopener noreferrer"
              className="px-6 py-2.5 bg-transparent border border-white/20 text-white/70 hover:border-[#00FF41]/30 hover:text-[#00FF41] hover:bg-[#00FF41]/10 font-mono text-sm uppercase tracking-widest transition-all duration-300 backdrop-blur-sm flex items-center gap-2 group cursor-pointer"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
              Download CV
            </a>
          </motion.div>
        </motion.div>


      </motion.div>
    </section>
  );
}
