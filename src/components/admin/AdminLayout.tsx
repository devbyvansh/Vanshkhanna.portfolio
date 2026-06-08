import { showSuccess, showError } from '../../lib/notifications';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { signOut, onAuthStateChanged, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

const adminContentVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  show: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { 
      duration: 0.4, 
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.05,
      when: 'beforeChildren'
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    filter: 'blur(5px)',
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } 
  }
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      if (res.user.email !== 'vanshkhanna800@gmail.com') {
        showError('Unauthorized access', 'auth', new Error('Only the administrator has access to this panel.'));
        await signOut(auth);
      } else {
        showSuccess('Authentication Successful');
      }
    } catch (e) {
      showError('Authentication Failed', 'auth', e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0A0B]">
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-t-2 border-[#00FF41] animate-spin mb-4"></div>
          <p className="text-[#00FF41] font-mono text-xs tracking-widest uppercase animate-pulse">Initializing Secure Connection...</p>
        </div>
      </div>
    );
  }

  if (!user || user.email !== 'vanshkhanna800@gmail.com') {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#0A0A0B] text-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="border border-[#00FF41]/20 bg-[#121214] p-8 max-w-md w-full relative z-10 shadow-[0_0_50px_rgba(0,255,65,0.05)]">
           <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
           <div className="flex justify-center mb-6">
             <div className="w-12 h-12 rounded-full border border-red-500/30 flex items-center justify-center bg-red-500/10">
               <span className="text-red-500 text-xl">!</span>
             </div>
           </div>
           <h2 className="text-[#00FF41] font-mono text-xl uppercase tracking-[0.2em] mb-2 font-bold">ACCESS DENIED</h2>
           <p className="text-white/40 font-mono text-xs uppercase mb-8">System requires Level-5 clearance. Identity unverified.</p>
           
           <button onClick={handleLogin} className="w-full bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-3 uppercase tracking-widest text-sm hover:bg-[#00FF41]/20 transition-colors">
              AUTHENTICATE VIA OAUTH
           </button>
           <button onClick={() => navigate('/')} className="w-full mt-4 text-white/40 hover:text-white transition-colors font-mono text-xs uppercase tracking-widest">
              &larr; RETURN TO PUBLIC MATRIX
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans selection:bg-[#00FF41]/30 selection:text-emerald-200">
      <nav className="w-full md:w-64 p-6 border-b md:border-b-0 md:border-r border-white/10 bg-[#0D0D0E] flex flex-col gap-4 font-mono text-sm relative z-10 shrink-0">
        <div className="mb-2 md:mb-6 flex space-x-2 items-center justify-between md:justify-start">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#00FF41] animate-pulse"></div>
            <h3 className="text-[#00FF41] uppercase tracking-[0.2em] font-bold">SYS.ADMIN</h3>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col gap-4 pb-0">
          {[
            { path: '/admin', label: 'Dashboard' },
            { path: '/admin/projects', label: 'Projects' },
            { path: '/admin/skills', label: 'Skills' },
            { path: '/admin/certifications', label: 'Certifications' },
            { path: '/admin/achievements', label: 'Achievements' },
            { path: '/admin/timeline', label: 'Timeline' },
            { path: '/admin/messages', label: 'Messages' },
            { path: '/admin/blog', label: 'Blog' },
            { path: '/admin/media', label: 'Media' },
            { path: '/admin/resume', label: 'Resume / CV' },
            { path: '/admin/settings', label: 'Settings' },
            { path: '/admin/knowledge', label: 'Knowledge' },
          ].map(link => (
            <Link key={link.path} to={link.path} className={`text-white/60 hover:text-white hover:bg-white/5 px-2 py-1.5 transition-colors uppercase tracking-widest text-xs flex items-center gap-2 whitespace-nowrap group ${location.pathname === link.path ? 'bg-white/5 text-white border-l-2 border-[#00FF41]' : ''}`}>
              <span className={`text-[#00FF41]/40 hidden md:inline transition-opacity ${location.pathname === link.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>&gt;</span> {link.label}
            </Link>
          ))}
        </div>
        
        {/* Mobile Navigation Dropdown */}
        <div className="md:hidden mt-2 relative">
          <select 
            className="w-full bg-[#121214] text-white border border-white/10 p-3 font-mono text-xs uppercase tracking-widest outline-none appearance-none focus:border-[#00FF41]/50 transition-colors"
            value={location.pathname}
            onChange={(e) => navigate(e.target.value)}
          >
            {[
              { path: '/admin', label: 'Dashboard' },
              { path: '/admin/projects', label: 'Projects' },
              { path: '/admin/skills', label: 'Skills' },
              { path: '/admin/certifications', label: 'Certifications' },
              { path: '/admin/achievements', label: 'Achievements' },
              { path: '/admin/timeline', label: 'Timeline' },
              { path: '/admin/messages', label: 'Messages' },
              { path: '/admin/blog', label: 'Blog' },
              { path: '/admin/media', label: 'Media' },
              { path: '/admin/resume', label: 'Resume / CV' },
              { path: '/admin/settings', label: 'Settings' },
              { path: '/admin/knowledge', label: 'Knowledge' },
            ].map(link => (
              <option key={link.path} value={link.path} className="bg-[#121214] text-white">
                {link.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#00FF41]/60">
            ▼
          </div>
        </div>

        <div className="mt-4 md:mt-auto flex justify-between gap-4 md:block">
          <Link to="/" className="flex-1 md:w-full text-center md:text-left text-white/40 hover:text-white text-[10px] md:text-xs uppercase tracking-widest block py-3 md:py-2 border border-white/10 md:border-0 md:border-t mb-0 md:mb-2 bg-white/5 md:bg-transparent">
            &larr; Exit
          </Link>
          <button onClick={handleLogout} className="flex-1 md:w-full bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-3 md:py-2 uppercase tracking-widest text-[10px] md:text-xs hover:bg-[#00FF41]/20 transition-colors shrink-0">
            Logout
          </button>
        </div>
      </nav>
      <main className="p-8 flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              variants={adminContentVariants}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
