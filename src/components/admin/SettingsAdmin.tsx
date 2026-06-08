import { showSuccess, showError } from '../../lib/notifications';
import { saveToFirebase } from '../../lib/firebaseUtils';
import React from 'react';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function SettingsAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phoneNumber: '',
    githubUsername: '',
    linkedinUrl: '',
    aboutSection: '',
    seoTitle: '',
    seoDescription: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'portfolio_settings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
      setFormData({
          name: data.name || '',
          role: data.role || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          githubUsername: data.githubUsername || '',
          linkedinUrl: data.linkedinUrl || '',
          aboutSection: data.aboutSection || '',
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || ''
        });
      }
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
      };
      
      await saveToFirebase('settings', payload, 'portfolio_settings', 'Save Settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">System Config <span className="text-white/40 text-sm ml-2">/ SYS_SETTINGS</span></h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Global Environment Variables</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="name" placeholder="FULL_NAME" value={formData.name} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="role" placeholder="PRIMARY_ROLE" value={formData.role} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="email" placeholder="CONTACT_EMAIL" value={formData.email} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="phoneNumber" placeholder="CONTACT_PHONE" value={formData.phoneNumber} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="githubUsername" placeholder="GITHUB_HANDLE" value={formData.githubUsername} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="linkedinUrl" placeholder="LINKEDIN_URL" value={formData.linkedinUrl} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <textarea name="aboutSection" placeholder="SYS_BIOGRAPHY" value={formData.aboutSection} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none min-h-[100px]" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="seoTitle" placeholder="SEO_TITLE" value={formData.seoTitle} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="seoDescription" placeholder="SEO_DESCRIPTION" value={formData.seoDescription} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50">
            {isSaving ? 'SAVING...' : 'SAVE_CONFIGURATION'}
          </button>
        </div>
      </form>
    </div>
  );
}
