import { motion, AnimatePresence } from 'motion/react';
import { JOURNEY as STATIC_JOURNEY } from '../../data';
import { useState, useMemo, useEffect, useRef } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const LAYER_SIZES = [3, 4, 5, 4, 3, 1];
const SVG_WIDTH = 1000;
const SVG_HEIGHT = 350;
const Y_SPACING = 50;

export default function Journey() {
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [journeyData, setJourneyData] = useState(STATIC_JOURNEY);
  const sectionRef = useRef(null);

  useEffect(() => {
    try {
      const q = query(collection(db, 'timeline'), orderBy('year', 'asc'));
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              year: d.year,
              title: d.title,
              description: d.description,
              metrics: [],
              tech: Array.isArray(d.technology) ? d.technology : typeof d.technology === 'string' ? d.technology.split(',').map((t: string) => t.trim()) : []
            };
          });
          setJourneyData(data as any);
        }
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const nodes = useMemo(() => {
    const layerCount = LAYER_SIZES.length;
    const layerWidth = SVG_WIDTH / layerCount;
    
    return LAYER_SIZES.map((size, layerIdx) => {
      const cx = layerWidth * (layerIdx + 0.5);
      const totalHeight = (size - 1) * Y_SPACING;
      const startY = SVG_HEIGHT / 2 - totalHeight / 2;
      
      return Array.from({ length: size }).map((_, nodeIdx) => {
        return {
          id: `node-${layerIdx}-${nodeIdx}`,
          layerIdx,
          nodeIdx,
          cx,
          cy: startY + nodeIdx * Y_SPACING
        };
      });
    });
  }, []);

  const edges = useMemo(() => {
    const lines = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const currentLayer = nodes[i];
      const nextLayer = nodes[i + 1];
      for (const current of currentLayer) {
        for (const next of nextLayer) {
          lines.push({
            id: `edge-${current.id}-${next.id}`,
            x1: current.cx,
            y1: current.cy,
            x2: next.cx,
            y2: next.cy,
            sourceLayer: i,
            targetLayer: i + 1
          });
        }
      }
    }
    return lines;
  }, [nodes]);

  const activeJourney = journeyData[(activeLayer < journeyData.length ? activeLayer : journeyData.length - 1)] || journeyData[0];

  return (
    <motion.section 
      ref={sectionRef}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="p-8 lg:p-16 border-b border-white/10 bg-[#0A0A0B] relative overflow-hidden"
    >
      {/* Removed heavy scrolling parallax on the blurred element to prevent intense paint lag */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-white rounded-full mix-blend-screen blur-3xl 2xl:w-[600px] 2xl:h-[600px]"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ffffff]/[0.01] to-transparent pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex justify-between items-center mb-12"
        >
          <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] font-bold text-white flex items-center gap-4">
            <span className="w-8 h-[1px] bg-white"></span>
            Neural Pathway: AI Journey
          </h3>
          <span className="text-[10px] font-mono opacity-40 italic text-white hidden sm:block border border-white/20 px-2 py-0.5 rounded-sm">SYS_LOG: NETWORK_TOPOLOGY</span>
        </motion.div>

        <div className="flex flex-col gap-8">
          {/* Neural Network SVG Container */}
          <div 
            className="w-full overflow-hidden border border-white/5 bg-white/[0.02] rounded-xl relative cursor-crosshair group animate-in fade-in duration-1000"
          >
            <svg 
              viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} 
              className="w-[800px] sm:w-full h-auto z-10 relative left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0"
              style={{ maxWidth: 'min(100%, 1000px)' }}
            >
              <defs>
                <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Edges */}
              {edges.map(edge => {
                const isActive = activeLayer === edge.sourceLayer || activeLayer === edge.targetLayer;
                
                return (
                  <line
                    key={edge.id}
                    x1={edge.x1}
                    y1={edge.y1}
                    x2={edge.x2}
                    y2={edge.y2}
                    stroke={isActive ? "#ffffff" : "#ffffff"}
                    strokeOpacity={isActive ? 0.5 : 0.03}
                    strokeWidth={isActive ? 2 : 1}
                    className="transition-all duration-300 ease-out"
                  />
                );
              })}

              {/* Nodes and Hover Triggers */}
              {nodes.map((layer, layerIdx) => (
                <g 
                  key={`layer-${layerIdx}`}
                  onMouseEnter={() => setActiveLayer(layerIdx)}
                  onClick={() => setActiveLayer(layerIdx)}
                  className="cursor-pointer"
                >
                  <rect 
                    x={(SVG_WIDTH / LAYER_SIZES.length) * layerIdx} 
                    y={0} 
                    width={SVG_WIDTH / LAYER_SIZES.length} 
                    height={SVG_HEIGHT} 
                    fill="transparent" 
                  />
                  
                  {layer.map(node => {
                    const isActiveLayer = layerIdx === activeLayer;
                    return (
                      <g key={node.id}>
                        {isActiveLayer && (
                          <circle 
                            cx={node.cx} 
                            cy={node.cy} 
                            r={20} 
                            fill="#ffffff" 
                            opacity="0.15" 
                            className="animate-pulse"
                          />
                        )}
                        <circle
                          cx={node.cx}
                          cy={node.cy}
                          r={isActiveLayer ? 8 : 6}
                          fill={isActiveLayer ? "#ffffff" : "#1a1a1a"}
                          stroke={isActiveLayer ? "#ffffff" : "#333333"}
                          strokeWidth={isActiveLayer ? 2 : 1}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  })}
                  
                  {/* Layer Label on graph */}
                  <text 
                    x={(SVG_WIDTH / LAYER_SIZES.length) * (layerIdx + 0.5)} 
                    y={SVG_HEIGHT - 20} 
                    fill={layerIdx === activeLayer ? "#ffffff" : "#444"} 
                    fontSize="16"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="tracking-[0.2em] uppercase font-bold transition-colors duration-300"
                  >
                    L_{layerIdx}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Details Panel */}
          <div 
            className="min-h-[160px] sm:min-h-[160px] border border-white/20 bg-white/[0.03] rounded-xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-center backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-white shadow-none"></div>
            <div className="absolute opacity-10 -right-10 -top-10 text-[120px] font-bold font-mono text-white select-none pointer-events-none transform -skew-x-12">
              {activeJourney?.id}
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer}
                initial={{ opacity: 0, x: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(4px)", position: "absolute" }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="relative z-10"
              >
                <div className="text-[10px] sm:text-xs font-mono text-white mb-3 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Node {activeJourney?.id} <span className="opacity-50 mx-2">//</span> Activation Pattern Detected
                </div>
                <h4 className="text-xl md:text-2xl text-white font-display font-bold mb-3 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  {activeJourney?.title}
                </h4>
                <p className="text-sm font-light text-white/70 max-w-2xl font-mono leading-relaxed">
                  {activeJourney?.description}
                </p>
                
                {activeJourney?.tech && activeJourney.tech.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {activeJourney.tech.map((tech: string) => (
                      <span key={tech} className="font-mono text-[9px] text-white/70 bg-white/10 border border-white/30 px-2 py-1 uppercase tracking-wider rounded-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
