import { motion, useScroll, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Trophy } from 'lucide-react';

export default function Achievements() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const sectionRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  useEffect(() => {
    try {
      const q = query(collection(db, 'achievements'), orderBy('date', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAchievements(data);
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
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #00FF41 1px, transparent 1px)', backgroundSize: '30px 30px' }} className="w-full h-[150%] -top-1/4 absolute"></div>
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
            Milestones & Recognition
          </h3>
          <span className="text-[10px] font-mono opacity-40 italic text-[#00FF41] border border-[#00FF41]/20 px-2 py-0.5 rounded-sm">SYS: ACHIEVEMENTS</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
              className="border border-white/10 p-6 bg-[#121214] flex gap-4 group hover:border-[#00FF41]/30 transition-colors"
            >
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#00FF41]/10 group-hover:text-[#00FF41] transition-colors text-white/50">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-display uppercase tracking-widest text-lg mb-1 group-hover:text-[#00FF41] transition-colors">{achievement.title}</h4>
                <div className="font-mono text-[10px] text-[#00FF41]/70 mb-2 uppercase tracking-wider">{achievement.issuer} • {achievement.date}</div>
                <p className="text-white/50 text-sm font-mono leading-relaxed">
                  {achievement.description}
                </p>
                {achievement.credentialUrl && (
                  <a href={achievement.credentialUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 text-[10px] font-mono text-[#00FF41] border border-[#00FF41]/30 bg-[#00FF41]/5 px-3 py-1 uppercase tracking-wider hover:bg-[#00FF41]/20 transition-colors">
                    View Verification
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
