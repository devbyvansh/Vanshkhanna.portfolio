import React from 'react';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

const achievements: Achievement[] = [
  { id: '1', title: 'AWS Cloud Innovator', issuer: 'Amazon Web Services', date: '2025' },
  { id: '2', title: 'Advanced React Architecture', issuer: 'Meta Credentials', date: '2025' }
];

export default function Achievements() {
  return (
    <motion.section 
      id="achievements"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.25 }}
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
          <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] font-bold text-white flex items-center gap-4">
            <span className="w-2 h-2 bg-[#00FF41] inline-block shadow-[0_0_8px_#00FF41]"></span>
            Merit Badges & Authority
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement, index) => (
            <motion.div 
              key={achievement.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              viewport={{ once: true }}
              className="border border-white/10 p-6 bg-[#121214] flex gap-4 group hover:border-[#00FF41]/30 transition-colors animate-in fade-in duration-300"
            >
              <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-[#00FF41]/10 group-hover:text-[#00FF41] transition-colors text-white/50">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-display uppercase tracking-widest text-lg mb-1 group-hover:text-[#00FF41] transition-colors">{achievement.title}</h4>
                <p className="font-mono text-[10px] text-white/40 uppercase mb-2">{achievement.issuer} — {achievement.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}