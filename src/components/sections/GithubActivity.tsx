import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { GitHubCalendar } from 'react-github-calendar';
import { Tooltip } from 'react-tooltip';
import { ErrorBoundary } from '../ErrorBoundary';
import 'react-tooltip/dist/react-tooltip.css';

const containerVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(5px)", scale: 0.98 },
  show: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
};

export default function GithubActivity() {
  const [selectedYear, setSelectedYear] = useState<number | 'last'>(2026);
  const currentYear = Math.max(2026, new Date().getFullYear());
  const years = Array.from({ length: currentYear - 2026 + 1 }, (_, i) => currentYear - i);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-16 border-b border-white/10 bg-[#0A0A0B] relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[#00FF41]/10 to-transparent rounded-full blur-3xl"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FF41]/[0.01] to-transparent pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4"
        >
          <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] font-bold text-white flex items-center gap-4">
            <span className="w-8 h-[1px] bg-[#00FF41]"></span>
            GitHub Activity
          </h3>
          
          <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1 text-xs font-mono transition-all duration-300 border ${
                  selectedYear === year 
                    ? 'border-[#00FF41] text-[#00FF41] bg-[#00FF41]/10 shadow-[0_0_10px_rgba(0,255,65,0.2)]' 
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/30 bg-transparent'
                }`}
              >
                {year}
              </button>
            ))}
            <span className="text-[10px] font-mono opacity-40 italic text-[#00FF41] ml-4 hidden md:block border border-[#00FF41]/20 px-2 py-0.5 rounded-sm">SYS_LOG: CONTRIBUTIONS</span>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex items-center justify-center p-8 border border-white/10 bg-[#121214] rounded-xl relative group min-h-[220px]"
        >
          <div className="absolute inset-0 bg-[#00FF41]/0 group-hover:bg-[#00FF41]/10 blur-xl transition-all duration-700 pointer-events-none -z-10 rounded-xl"></div>
          <div className="absolute inset-0 bg-[#00FF41]/5 pointer-events-none z-0 rounded-xl group-hover:opacity-0 transition-opacity duration-700"></div>
          
          <div className="relative z-10 w-full overflow-x-auto scrollbar-hide flex justify-center py-4">
            <ErrorBoundary fallback={
              <div className="text-white/40 text-xs font-mono py-10 flex flex-col items-center gap-2">
                <span>[NO_CONTRIBUTIONS_FOUND]</span>
                <span className="opacity-50">No activity data available for {selectedYear === 'last' ? 'the last 12 months' : selectedYear}.</span>
              </div>
            }>
              <GitHubCalendar 
                key={selectedYear}
                username="devbyvansh" 
                year={selectedYear}
                colorScheme="dark"
                transformData={(data) => {
                  if (!data || data.length === 0) {
                    return [{
                      date: typeof selectedYear === 'number' ? `${selectedYear}-01-01` : new Date().toISOString().split('T')[0],
                      count: 0,
                      level: 0
                    }];
                  }
                  return data;
                }}
                theme={{
                  light: ['#1a1a1c', '#004411', '#008822', '#00cc33', '#00FF41'],
                  dark: ['#1a1a1c', '#004411', '#008822', '#00cc33', '#00FF41']
                }}
                fontSize={14}
                blockSize={14}
                blockMargin={5}
                renderBlock={(block, activity) => React.cloneElement(block as React.ReactElement, {
                  'data-tooltip-id': 'github-tooltip',
                  'data-tooltip-content': `${activity.count} contributions on ${activity.date}`,
                  className: 'hover:opacity-80 cursor-crosshair'
                })}
              />
            </ErrorBoundary>
            <Tooltip 
              id="github-tooltip" 
              delayShow={50}
              style={{ 
                backgroundColor: '#121214', 
                color: '#00FF41', 
                border: '1px solid rgba(0, 255, 65, 0.3)', 
                fontSize: '11px', 
                fontFamily: 'monospace',
                borderRadius: '8px',
                zIndex: 100,
                boxShadow: '0 4px 15px rgba(0, 255, 65, 0.1)'
              }} 
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}