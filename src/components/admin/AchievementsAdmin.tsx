import { showSuccess, showError } from '../../lib/notifications';
import { saveToFirebase } from '../../lib/firebaseUtils';
import React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function AchievementsAdmin() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    achievementTitle: '',
    description: '',
    date: '',
    category: '',
    externalLink: '',
    badgeImage: '',
    priorityLevel: 0,
    pinned: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'achievements'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setAchievements(data.sort((a, b) => (b.priorityLevel || 0) - (a.priorityLevel || 0)));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        achievementTitle: formData.achievementTitle,
        description: formData.description,
        date: formData.date,
        category: formData.category,
        externalLink: formData.externalLink,
        badgeImage: formData.badgeImage,
        priorityLevel: formData.priorityLevel,
        pinned: formData.pinned,
      };

      const success = await saveToFirebase('achievements', payload, editingId, 'Save Achievement');
      if (success) {
        if (editingId) setEditingId(null);
        setFormData({
          achievementTitle: '', description: '', date: '', category: '', externalLink: '', badgeImage: '', priorityLevel: 0, pinned: false
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (ach: any) => {
    setEditingId(ach.id);
      setFormData({
      achievementTitle: ach.achievementTitle || '',
      description: ach.description || '',
      date: ach.date || '',
      category: ach.category || '',
      externalLink: ach.externalLink || '',
      badgeImage: ach.badgeImage || '',
      priorityLevel: ach.priorityLevel || 0,
      pinned: ach.pinned || false
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) await deleteDoc(doc(db, 'achievements', id));
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">Achievements Matrix <span className="text-white/40 text-sm ml-2">/ SYS_ACHIEVEMENTS</span></h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Initialize / Edit Record</h3>
        
        <input name="achievementTitle" placeholder="ACHIEVEMENT_TITLE" value={formData.achievementTitle} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        <textarea name="description" placeholder="DESCRIPTION" value={formData.description} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none min-h-[80px]" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="date" placeholder="DATE (YYYY-MM-DD)" value={formData.date} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="category" placeholder="CATEGORY" value={formData.category} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="externalLink" placeholder="EXTERNAL_URL" value={formData.externalLink} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="badgeImage" placeholder="BADGE_IMAGE_URL" value={formData.badgeImage} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <input type="number" name="priorityLevel" placeholder="PRIORITY_LEVEL (higher = top)" value={formData.priorityLevel} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        
        <label className="flex items-center gap-2 cursor-pointer text-white/60 font-mono text-xs transition-colors hover:text-white mt-2">
          <input type="checkbox" name="pinned" checked={formData.pinned} onChange={handleChange} className="accent-[#00FF41]" />
          PIN_TO_TOP
        </label>
        
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50">
            {isSaving ? 'SAVING...' : editingId ? 'EXECUTE_UPDATE' : 'COMPILE_NEW'}
          </button>
          {editingId && <button type="button" disabled={isSaving} onClick={() => setEditingId(null)} className="flex-1 bg-white/5 text-white/60 border border-white/10 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">TERMINATE_EDIT</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(ach => (
          <div key={ach.id} className="border border-white/10 bg-[#121214] p-4 flex flex-col gap-2 relative group hover:border-white/30 transition-colors">
            {ach.pinned && <div className="absolute top-0 right-0 w-0 h-0 border-t-[15px] border-r-[15px] border-t-[#00FF41] border-r-transparent"></div>}
            <h4 className="text-white font-bold font-display uppercase tracking-widest leading-tight">{ach.achievementTitle}</h4>
            {ach.category && <div className="text-[#00FF41]/70 font-mono text-[10px] uppercase tracking-wider">{ach.category}</div>}
            <p className="text-white/40 text-xs font-mono line-clamp-3 my-2">{ach.description}</p>
            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
              <button onClick={() => handleEdit(ach)} className="flex-1 border border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/5 hover:bg-[#00FF41]/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">MODIFY</button>
              <button onClick={() => handleDelete(ach.id)} className="flex-1 border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
