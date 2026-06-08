import React from 'react';
import { motion } from 'motion/react';

interface Skill {
  id: string;
  name: string;
  proficiencyLevel: number;
}

const skills: Skill[] = [
  { id: '1', name: 'React / Next.js', proficiencyLevel: 95 },
  { id: '2', name: 'Node.js / Express', proficiencyLevel: 90 },
  { id: '3', name: 'TypeScript / JS', proficiencyLevel: 95 },
  { id: '4', name: 'Firebase', proficiencyLevel: 88 },
  { id: '5', name: 'SQL / NoSQL', proficiencyLevel: 85 },
  { id: '6', name: 'Tailwind CSS', proficiencyLevel: 98 },
];

export default function Skills() {
  return (
    <motion.section 
      id="skills"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.25 }}
      className="p-8 lg:p-16 border-b border-white/10 bg-[#0A0A0B] relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.02]">
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#00FF41] blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] font-bold text-white flex items-center gap-4">
            <span className="w-2 h-2 bg-[#00FF41] inline-block shadow-[0_0_8px_#00FF41]"></span>
            Core Core Capabilities
          </h3>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <motion.div 
              key={skill.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              viewport={{ once: true }}
              className="border border-white/10 p-6 bg-[#121214] hover:border-[#00FF41]/30 transition-colors"
            >
              <div className="flex justify-between font-mono text-xs text-white/80 uppercase tracking-widest mb-4">
                <span>{skill.name}</span>
                <span className="text-[#00FF41]">{skill.proficiencyLevel}%</span>
              </div>
              <div className="w-full bg-white/5 h-1 relative overflow-hidden rounded-full">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiencyLevel}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="bg-[#00FF41] h-1 shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                ></motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}