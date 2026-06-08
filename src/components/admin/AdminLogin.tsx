import React, { useState } from 'react';
import { showSuccess, showError } from '../../lib/notifications';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updatePassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLegacyPassword, setShowLegacyPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper to generate a programmatic background password based on email
  const getDeterministicPassword = (emailStr: string) => {
    return `${emailStr.trim().toLowerCase()}_passwordless_sys_node_2026!`;
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    // Prompt the user to select their account to avoid auto-selecting cached credentials if they have multiple accounts
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      await checkAndNavigate(result.user);
    } catch (error: any) {
      if (error?.code === 'auth/popup-blocked') {
        showError('Google Sign-In', 'auth', new Error('Popup blocked by browser. Please click the unlock popup indicator in your URL bar, or open the app in a new tab to authenticate.'));
      } else {
        showError('Google Sign-In', 'auth', error);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      showError('Reset Password', 'auth', new Error('Please enter your email identifier first.'));
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showSuccess('Reset Password (please check your inbox).');
    } catch (error: any) {
      showError('Reset Password', 'auth', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const lowercaseEmail = email.trim().toLowerCase();
    const deterministicPassword = getDeterministicPassword(lowercaseEmail);

    try {
      if (isLogin) {
        if (showLegacyPassword) {
          // Attempt login using their original manually typed passcode
          const result = await signInWithEmailAndPassword(auth, lowercaseEmail, password);
          
          // Legacy login succeeded! Quietly migrate user to passwordless in the background for next time
          try {
            if (result.user) {
              await updatePassword(result.user, deterministicPassword);
              showSuccess('Account successfully migrated to passwordless login! Next time only your email is needed.');
            }
          } catch (migrateErr) {
            console.warn('Silent passwordless migration skipped:', migrateErr);
          }
          await checkAndNavigate(result.user);
        } else {
          // Normal passwordless flow: try the deterministic password first
          try {
            const result = await signInWithEmailAndPassword(auth, lowercaseEmail, deterministicPassword);
            await checkAndNavigate(result.user);
          } catch (error: any) {
            if (error?.code === 'auth/wrong-password' || error?.code === 'auth/invalid-credential') {
              // User has a custom legacy password from before the update! Show fallback field so they can migrate
              setShowLegacyPassword(true);
              setLoading(false);
              showError('Legacy Credentials Required', 'auth', new Error('This account is registered with a legacy passcode. Please enter your passcode below to authorize and migrate to passwordless.'));
              return;
            } else {
              throw error;
            }
          }
        }
      } else {
        // Sign-up: Register using passwordless deterministic password directly
        const result = await createUserWithEmailAndPassword(auth, lowercaseEmail, deterministicPassword);
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
          {showLegacyPassword 
            ? 'Migrating legacy terminal access node.' 
            : isLogin 
              ? 'Enter identifier to continue.' 
              : 'Initialize new access node.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-[#00FF41] font-mono text-xs uppercase tracking-widest mb-2">Identifier</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={showLegacyPassword}
              placeholder="admin@system.io"
              className="w-full bg-[#0A0A0B] border border-white/10 text-white p-3 font-mono text-sm focus:border-[#00FF41]/50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            />
          </div>

          {showLegacyPassword && (
            <div>
              <label className="block text-[#00FF41] font-mono text-xs uppercase tracking-widest mb-2">Legacy Passcode</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#0A0A0B] border border-white/10 text-white p-3 font-mono text-sm focus:border-[#00FF41]/50 focus:outline-none transition-colors animate-pulse"
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-4 p-4 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 hover:bg-[#00FF41]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer font-mono text-sm tracking-widest uppercase"
          >
            {loading ? 'Processing...' : isLogin ? (showLegacyPassword ? 'Authorize & Migrate' : 'Authenticate') : 'Initialize'}
          </button>
        </form>

        <div className="relative flex py-4 items-center">
          <div className="flex-grow border-t border-white/5"></div>
          <span className="flex-shrink mx-4 text-white/20 font-mono text-[10px] uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-white/5"></div>
        </div>

        <button 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 p-4 bg-[#4285F4]/10 text-[#4285F4] border border-[#4285F4]/30 hover:bg-[#4285F4]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer font-mono text-sm tracking-widest uppercase"
        >
          <svg className="w-4 h-4 text-[#4285F4]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Google Identity Authenticate
        </button>

        <div className="mt-6 flex flex-col gap-3 items-center border-t border-white/5 pt-6 justify-center">
          {isLogin && showLegacyPassword && (
            <button 
              type="button"
              disabled={loading}
              onClick={handleResetPassword}
              className="text-white/40 hover:text-[#00FF41] font-mono text-xs tracking-widest uppercase transition-colors"
            >
              Forgot Passcode?
            </button>
          )}
          <button 
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setShowLegacyPassword(false);
              setPassword('');
            }}
            className="text-white/40 hover:text-[#00FF41] font-mono text-xs tracking-widest uppercase transition-colors"
          >
            {isLogin ? 'Request Access (Sign Up)' : 'Return to Login'}
          </button>
        </div>
      </div>
    </div>
  );
}