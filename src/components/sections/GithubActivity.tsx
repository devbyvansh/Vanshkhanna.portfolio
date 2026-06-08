import React from 'react';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } }
};

export default function GithubActivity() {
  return (
    <motion.section 
      id="github"
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
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] font-bold text-white flex items-center gap-4">
            <span className="w-2 h-2 bg-[#00FF41] inline-block shadow-[0_0_8px_#00FF41]"></span>
            Kernel Activity Logs
          </h3>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="w-full flex items-center justify-center p-8 border border-white/10 bg-[#121214] rounded-xl relative group min-h-[220px]"
        >
          <div className="text-center font-mono text-xs text-white/40">
            [SYS_INF]: Dynamic activity integrations online.
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}