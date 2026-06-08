import { motion, AnimatePresence } from 'motion/react';
import { CERTIFICATIONS as STATIC_CERTIFICATIONS } from '../../data';
import { useState, useEffect } from 'react';
import { Award, ShieldCheck, ChevronRight, ExternalLink, X } from 'lucide-react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface CertificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificationsModal({ isOpen, onClose }: CertificationsModalProps) {
  const [activeCert, setActiveCert] = useState<number | null>(null);
  const [certs, setCerts] = useState(STATIC_CERTIFICATIONS);

  useEffect(() => {
    try {
      const q = query(collection(db, 'certifications'), orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              title: d.certificateTitle || d.title,
              issuer: d.issuingOrganization || d.issuer,
              date: d.issueDate || d.date,
              url: d.credentialUrl || d.url
            };
          });
          setCerts(data as any);
        }
      });
      return () => unsub();
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Close with escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0A0A0B]/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-xl bg-[#0A0A0B] border-l border-white/10 shadow-2xl flex flex-col h-full overflow-y-auto"
          >
            <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0 sticky top-0 bg-[#0A0A0B]/90 backdrop-blur-md z-20">
              <div>
                <h3 className="text-sm md:text-base font-mono uppercase tracking-[0.3em] font-bold text-white mb-1">Achievements & Certifications</h3>
                <span className="text-[10px] font-mono opacity-40 italic text-white">SYS_LOG: CREDENTIALS_VERIFIED</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors bg-black/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-6">
              {certs.map((cert, idx) => {
                const isActive = activeCert === idx;

                return (
                  <motion.div
                    key={cert.id}
                    onClick={() => setActiveCert(isActive ? null : idx)}
                    layout
                    className={`group relative overflow-hidden border p-6 cursor-pointer transition-all duration-500 ${
                      isActive 
                        ? 'border-white/40 bg-white/[0.05] shadow-[0_0_20px_rgba(255,255,255,0.03)]' 
                        : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="absolute -right-6 -top-12 text-[120px] font-bold font-mono text-white/[0.02] group-hover:text-white/[0.04] transition-colors pointer-events-none select-none">
                      {idx + 1}
                    </div>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="certGlow"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.04)_0%,transparent_70%)] pointer-events-none"
                      />
                    )}

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded border transition-colors ${isActive ? 'border-white/40 text-white bg-white/5' : 'border-white/20 text-white/50 group-hover:text-white/80'}`}>
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] font-mono text-white/60 uppercase tracking-widest">{cert.id}</div>
                            <div className="text-xs font-mono text-white/40 uppercase">{cert.date}</div>
                          </div>
                        </div>
                        
                        <div className={`flex items-center gap-1 text-[10px] font-mono border px-2 py-1 rounded transition-colors ${
                          isActive 
                            ? 'border-white/40 text-white bg-white/5' 
                            : 'border-white/10 text-white/40'
                        }`}>
                          <ShieldCheck className="w-3 h-3" />
                          {cert.status}
                        </div>
                      </div>

                      <h4 className={`text-lg md:text-xl font-bold font-mono uppercase mb-2 ${isActive ? 'text-white' : 'text-white/80'}`}>
                        {cert.title}
                      </h4>
                      <p className={`text-sm font-mono mb-4 uppercase ${isActive ? 'text-white/70' : 'text-white/50'}`}>
                        ISSUER: {cert.issuer}
                      </p>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            <div className="text-[10px] font-mono text-white/40 uppercase mb-3">Acquired Skills / Competencies</div>
                            <div className="flex flex-wrap gap-2 mb-6">
                              {(cert.skills || []).map((skill: string, sIdx: number) => (
                                <span 
                                  key={sIdx}
                                  className="text-xs font-mono border border-white/20 bg-white/5 text-white/80 px-2 py-1 flex items-center gap-1"
                                >
                                  <ChevronRight className="w-3 h-3" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                            
                            {(cert as any).url && (
                               <a 
                                 href={(cert as any).url} 
                                 target="_blank" 
                                 rel="noreferrer"
                                 onClick={(e) => e.stopPropagation()}
                                 className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest text-[#0A0A0B] bg-white hover:bg-white/90 rounded transition-colors"
                               >
                                 View Credential <ExternalLink className="w-3 h-3" />
                               </a>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      
                    </div>
                    
                    {/* Active borders */}
                    {isActive && (
                      <>
                        <motion.div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" layoutId="topBorder" />
                        <motion.div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" layoutId="bottomBorder" />
                      </>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
