import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot } from 'lucide-react';
import { collection, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Message {
  id: string;
  type: 'bot' | 'user';
  text: string;
  options?: string[];
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      type: 'bot',
      text: "Hello, I'm AURA.\n\nAsk me about:",
      options: ['Projects', 'Skills', 'Certifications', 'Experience', 'Contact Information', 'Who is Vansh?']
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live Sync State
  const [userInfo, setUserInfo] = useState<any>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [journey, setJourney] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    const unsubUser = onSnapshot(doc(db, 'settings', 'portfolio_settings'), (docSnap) => {
      if (docSnap.exists()) setUserInfo(docSnap.data());
    });
    const unsubProjects = onSnapshot(query(collection(db, 'projects'), orderBy('createdAt', 'desc')), (snap) => {
      setProjects(snap.docs.map(d => d.data()));
    });
    const unsubSkills = onSnapshot(query(collection(db, 'skills'), orderBy('displayOrder', 'asc')), (snap) => {
      setSkills(snap.docs.map(d => d.data()));
    });
    const unsubCerts = onSnapshot(collection(db, 'certifications'), (snap) => {
      setCertifications(snap.docs.map(d => d.data()));
    });
    const unsubJourney = onSnapshot(query(collection(db, 'timeline'), orderBy('year', 'asc')), (snap) => {
      setJourney(snap.docs.map(d => d.data()));
    });
    const unsubAchiev = onSnapshot(query(collection(db, 'achievements'), orderBy('createdAt', 'desc')), (snap) => {
      setAchievements(snap.docs.map(d => d.data()));
    });

    return () => {
      unsubUser();
      unsubProjects();
      unsubSkills();
      unsubCerts();
      unsubJourney();
      unsubAchiev();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOptionClick = (option: string) => {
    handleSend(option);
  };

  const generateResponse = (text: string) => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('who is') || lowerText.includes('about') || lowerText.includes('who are you')) {
      return `${userInfo.name || 'Vansh'} is an ${userInfo.role || 'Developer'} based in ${userInfo.location || 'somewhere'}. ${userInfo.aboutSection || userInfo.intro || ''}`;
    }
    
    if (lowerText.includes('project') || lowerText.includes('work')) {
      const projNames = projects.map(p => p.title).join(', ');
      return `Vansh has worked on several projects including: ${projNames}. Check out the Projects section for more details.`;
    }
    
    if (lowerText.includes('skill') || lowerText.includes('tech') || lowerText.includes('stack')) {
      const topSkills = Array.from(new Set(skills.map(s => s.category))).join(', ');
      return `Vansh's core expertise categories lie in: ${topSkills}. Specific skills include ${skills.slice(0,5).map(s => s.skillName).join(', ')}. Need specifics on any of these?`;
    }
    
    if (lowerText.includes('cert') || lowerText.includes('certification')) {
       return `Vansh holds certifications like: ${certifications.map(c => c.certificateTitle || c.title).join(', ')}.`;
    }

    if (lowerText.includes('achievement') || lowerText.includes('award') || lowerText.includes('win') || lowerText.includes('milestone')) {
       const achList = achievements.map(a => a.achievementTitle || a.title).filter(Boolean);
       if (achList.length === 0) return `Vansh hasn't listed specific achievements yet, check their journey for details!`;
       return `Vansh has accomplished some notable milestones: ${achList.join(', ')}.`;
    }
    
    if (lowerText.includes('experience') || lowerText.includes('journey')) {
      return `Vansh's journey includes mastering ${journey.map(j => j.title).filter(Boolean).join(', ')}. View the Timeline section for details!`;
    }
    
    if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('hire') || lowerText.includes('social')) {
       return `You can reach Vansh at ${userInfo.email || userInfo.phoneNumber || 'their contact email'}.\nLinkedIn: ${userInfo.linkedinUrl || 'N/A'}\nGitHub: ${userInfo.githubUsername ? `https://github.com/${userInfo.githubUsername}` : 'N/A'}\nResume: ${userInfo.resumeUrl ? 'Available to download' : 'N/A'}`;
    }
    
    return "I'm not sure about that. Try asking about Projects, Skills, Certifications, Experience, or Contact Info.";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    const userMsg: Message = { id: Date.now().toString(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate thinking
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        text: generateResponse(text)
      };
      setMessages(prev => [...prev, botMsg]);
    }, 500);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-14 h-14 bg-white text-[#0A0A0B] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] z-50 group"
          >
            <Bot className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-8 right-8 w-[380px] max-w-[calc(100vw-2rem)] h-[550px] max-h-[calc(100vh-4rem)] bg-[#0A0A0B] border border-white/20 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-[#0A0A0B] flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-white">AURA</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF41] animate-pulse shadow-[0_0_5px_#00FF41]"></span>
                    <span className="text-[10px] font-mono text-white/50 uppercase">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-white/50 hover:text-white transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs md:text-sm scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[85%] p-3 whitespace-pre-wrap break-words ${
                      msg.type === 'user' 
                        ? 'bg-white text-[#0A0A0B] rounded-2xl rounded-tr-sm' 
                        : 'bg-white/10 border border-white/10 text-white rounded-2xl rounded-tl-sm'
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                  
                  {msg.options && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 flex flex-wrap gap-2 w-[90%]"
                    >
                      {msg.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleOptionClick(opt)}
                          className="px-3 py-1.5 text-[10px] sm:text-xs border border-white/20 bg-white/5 text-white/90 hover:bg-white hover:text-[#0A0A0B] transition-colors rounded-full uppercase tracking-wider"
                        >
                          {opt}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/40 shrink-0">
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                  placeholder="Ask AURA..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm font-mono text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors"
                />
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-white text-[#0A0A0B] rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform shrink-0"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
