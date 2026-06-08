import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [history, setHistory] = useState<{type: 'system' | 'user' | 'prompt', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState<'name' | 'email' | 'message' | 'done'>('name');
  const [data, setData] = useState({ name: '', email: '', message: '' });
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [adminEmail, setAdminEmail] = useState('vanshkhanna800@gmail.com');

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'portfolio_settings'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().email) {
        setAdminEmail(docSnap.data().email);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHistory([
         { type: 'system', text: 'INITIALIZING SECURE CHANNEL...' },
         { type: 'system', text: 'CONNECTION ESTABLISHED.' },
         { type: 'system', text: 'PLEASE ENTER CREDENTIALS TO PROCEED.' },
      ]);
      setStep('name');
      setData({ name: '', email: '', message: '' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const getPrompt = () => {
    switch(step) {
      case 'name': return 'user@root:~/contact/name$';
      case 'email': return 'user@root:~/contact/email$';
      case 'message': return 'user@root:~/contact/msg$';
      default: return 'user@root:~$';
    }
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!input.trim() && step !== 'done') return;
      
      const newHistory = [...history, { type: 'prompt', text: `${getPrompt()} ${input}` }];
      
      if (step === 'name') {
        setData(p => ({ ...p, name: input }));
        setStep('email');
        newHistory.push({ type: 'system', text: 'ACKNOWLEDGED. PLEASE ENTER EMAIL:' });
      } else if (step === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
           newHistory.push({ type: 'system', text: 'ERROR: INVALID EMAIL FORMAT. PLEASE TRY AGAIN:' });
        } else {
          setData(p => ({ ...p, email: input }));
          setStep('message');
          newHistory.push({ type: 'system', text: 'VALID FORMAT. PLEASE ENTER MESSAGE:' });
        }
      } else if (step === 'message') {
        const userMessage = input;
        setData(p => ({ ...p, message: userMessage }));
        setStep('done');
        newHistory.push({ type: 'system', text: 'ENCRYPTING PAYLOAD...' });
        
        try {
          // Push to Firebase
          await addDoc(collection(db, 'contact_messages'), {
            name: data.name,
            email: data.email,
            message: userMessage,
            submissionDate: new Date().toISOString(),
            isRead: false
          });
          
          try {
            await fetch(`https://formsubmit.co/ajax/${adminEmail}`, {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    message: userMessage,
                    _subject: `New Portfolio Message from ${data.name}!`
                })
            });
            newHistory.push({ type: 'system', text: 'EMAIL NOTIFICATION SENT SUCCESSFULLY.' });
          } catch (e) {
            console.error('Email failed to send but saved to db', e);
          }

          newHistory.push({ type: 'system', text: 'TRANSMITTING.......................... [OK]' });
          newHistory.push({ type: 'system', text: 'COMMUNICATION LOG SAVED AND SENT.' });
        } catch (err) {
          console.error(err);
          newHistory.push({ type: 'system', text: 'TRANSMISSION FAILED. OPENING MAIL CLIENT AS BACKUP...' });
          const subject = encodeURIComponent(`New message from ${data.name}`);
          const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${userMessage}`);
          window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
        }
        
        newHistory.push({ type: 'system', text: 'TYPE "exit" TO TERMINATE SESSION.' });
        
      } else if (step === 'done') {
        if (input.trim().toLowerCase() === 'exit') {
          onClose();
          return;
        } else {
           newHistory.push({ type: 'system', text: 'COMMAND NOT FOUND. TYPE "exit" TO TERMINATE.' });
        }
      }

      setHistory(newHistory as any);
      setInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0A0A0B]/80 backdrop-blur-sm z-[100]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-2xl bg-[#0D0D0E] border border-white/10 rounded-lg shadow-2xl z-[101] overflow-hidden flex flex-col h-[400px] sm:h-[500px]"
          >
            {/* Modal Header */}
            <div className="h-10 border-b border-white/10 bg-[#151516] flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-2 text-[10px] font-mono opacity-50 text-white">
                 <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                 <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                 <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                 <span className="ml-2">contact_module.exe // TERMINAL</span>
              </div>
              <button 
                onClick={onClose} 
                className="text-white/40 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Terminal Body */}
            <div 
              className="flex-1 p-6 font-mono text-[11px] sm:text-sm overflow-y-auto space-y-2 text-white/80 cursor-text scrollbar-hide" 
              onClick={() => inputRef.current?.focus()}
            >
              {history.map((line, i) => (
                <div key={i} className={`flex ${line.type === 'system' ? 'text-[#00FF41] opacity-90' : 'text-white'}`}>
                  <span>{line.text}</span>
                </div>
              ))}
              
              <div className="flex items-center text-[#00FF41] mt-2 group relative">
                <span className="mr-2 shrink-0">{getPrompt()}</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent outline-none border-none text-white shadow-none focus:ring-0 p-0"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleKeyDown({ key: 'Enter', preventDefault: () => {} } as any);
                  }}
                  className="ml-2 w-6 h-6 flex shrink-0 items-center justify-center bg-[#00FF41]/10 hover:bg-[#00FF41]/30 text-[#00FF41] rounded-sm transition-colors border border-[#00FF41]/30"
                  aria-label="Submit"
                  type="button"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                </button>
              </div>
              <div ref={bottomRef} className="h-4 shrink-0" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
