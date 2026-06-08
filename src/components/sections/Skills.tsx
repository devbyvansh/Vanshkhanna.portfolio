import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function Skills() {
  const [skills, setSkills] = useState<any[]>([]);
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  useEffect(() => {
    try {
      const q = query(collection(db, 'skills'), orderBy('displayOrder', 'asc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setSkills(data);
      });
      return () => unsub();
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-16 border-b border-white/10 bg-[#0A0A0B] relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
        <div style={{ backgroundImage: 'linear-gradient(45deg, #00FF41 1px, transparent 1px)', backgroundSize: '60px 60px' }} className="w-full h-[150%] -top-1/4 absolute rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] font-bold text-white flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#00FF41]"></span>
            Technical Competencies
          </h3>
          <span className="text-[10px] font-mono opacity-40 italic text-[#00FF41] border border-[#00FF41]/20 px-2 py-0.5 rounded-sm">SYS: SKILLS</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div 
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="border border-white/10 p-6 bg-[#121214] hover:border-[#00FF41]/30 transition-colors"
            >
              <h4 className="text-white font-display uppercase tracking-widest text-lg mb-2">{skill.skillName}</h4>
              <p className="font-mono text-[10px] text-[#00FF41]/70 mb-4">{skill.category} • {skill.experienceLevel || 'N/A'}</p>
              
              <div className="w-full bg-white/5 h-1 mb-2">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiencyLevel}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="bg-[#00FF41] h-1 shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                ></motion.div>
              </div>
              <div className="flex justify-end font-mono text-[10px] text-white/40 mb-4">
                LVL {skill.proficiencyLevel}
              </div>

              {skill.relatedTechnologies && skill.relatedTechnologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skill.relatedTechnologies.map((tech: string) => (
                    <span key={tech} className="font-mono text-[9px] text-white/60 bg-white/5 border border-white/10 px-2 py-1 rounded-sm uppercase tracking-wider">{tech}</span>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
