import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Radio, Cpu, Layers } from 'lucide-react';

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 400;

export default function Journey() {
  const [activeLayer, setActiveLayer] = useState('layer1');

  return (
    <motion.section 
      id="journey"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
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
            Computational Journey
          </h3>
        </motion.div>

        <div className="flex flex-col gap-8">
          <div className="w-full overflow-hidden border border-white/5 bg-white/[0.02] rounded-xl relative cursor-crosshair group animate-in fade-in duration-200">
            <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-auto min-h-[300px]">
              {/* Scalable Vector Graphics details go here */}
              <text x="50" y="200" fill="#00FF41" className="font-mono text-xs">Journey Telemetry Active</text>
            </svg>
          </div>

          <div className="min-h-[160px] sm:min-h-[160px] border border-[#00FF41]/20 bg-[#00FF41]/[0.03] rounded-xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-center backdrop-blur-sm animate-in fade-in slide-in-from-bottom-2 duration-200">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10, position: "absolute" }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="relative z-10"
              >
                <div className="text-[10px] sm:text-xs font-mono text-[#00FF41] mb-3 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 animate-pulse" /> Active Node: {activeLayer.toUpperCase()}
                </div>
                <p className="text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-3xl">
                  Deepening full-stack execution layers, structuring robust databases, and building pixel-perfect application UI layers.
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}