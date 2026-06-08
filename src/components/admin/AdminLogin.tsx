import React, { useState } from 'react';
import { showSuccess, showError } from '../../lib/notifications';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const checkAndNavigate = async (user: any) => {
    const userEmail = user.email?.toLowerCase();
    if (userEmail === 'vanshkhanna800@gmail.com') {
      try {
        await setDoc(doc(db, 'admins', user.uid), {
          email: userEmail,
          role: 'Super Admin',
          createdAt: new Date().toISOString()
        }, { merge: true });
        navigate('/admin');
      } catch (error) {
        showError('Set Admin Privileges', 'admins', error);
      }
    } else {
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        if (adminDoc.exists()) {
          navigate('/admin');
        } else {
          showError('Verify Admin Permissions', 'admins', new Error('Unauthorized Access: Authenticated user does not have administrator privileges.'));
          auth.signOut();
        }
      } catch (error) {
        showError('Verify Admin Access', 'admins', error);
        auth.signOut();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        await checkAndNavigate(result.user);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await checkAndNavigate(result.user);
      }
    } catch (error: any) {
      showError(isLogin ? 'Authentication' : 'Registration', 'auth', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0A0A0B] text-[#E0E0E0] font-sans selection:bg-[#00FF41]/30 selection:text-emerald-200">
      <div className="p-10 bg-[#121214] rounded-lg border border-white/10 w-full max-w-md shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h2 className="text-center mb-2 font-mono tracking-[0.2em] uppercase text-white/90 text-xl font-bold">
          System Access
        </h2>
        
        <p className="text-center text-white/40 font-mono text-xs mb-8">
          {isLogin ? 'Enter credentials to continue.' : 'Initialize new access node.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[#00FF41] font-mono text-xs uppercase tracking-widest mb-2">Identifier</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@system.io"
              className="w-full bg-[#0A0A0B] border border-white/10 text-white p-3 font-mono text-sm focus:border-[#00FF41]/50 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#00FF41] font-mono text-xs uppercase tracking-widest mb-2">Passcode</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-[#0A0A0B] border border-white/10 text-white p-3 font-mono text-sm focus:border-[#00FF41]/50 focus:outline-none transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 p-4 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 hover:bg-[#00FF41]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer font-mono text-sm tracking-widest uppercase"
          >
            {loading ? 'Processing...' : isLogin ? 'Authenticate' : 'Initialize'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-white/40 hover:text-[#00FF41] font-mono text-xs tracking-widest uppercase transition-colors"
          >
            {isLogin ? 'Request Access (Sign Up)' : 'Return to Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
