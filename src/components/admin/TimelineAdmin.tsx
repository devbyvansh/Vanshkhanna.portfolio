import { showSuccess, showError } from '../../lib/notifications';
import { saveToFirebase } from '../../lib/firebaseUtils';
import React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function TimelineAdmin() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: '',
    technology: '',
    category: '',
    milestoneType: '',
    order: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'timeline'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setTimeline(data.sort((a, b) => (a.order || 0) - (b.order || 0)));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        year: formData.year,
        technology: formData.technology.split(',').map(s => s.trim()).filter(Boolean),
        category: formData.category,
        milestoneType: formData.milestoneType,
        order: formData.order,
      };

      const success = await saveToFirebase('timeline', payload, editingId, 'Save Milestone');
      if (success) {
        if (editingId) setEditingId(null);
        setFormData({
          title: '', description: '', year: '', technology: '', category: '', milestoneType: '', order: 0
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
      setFormData({
      title: item.title || '',
      description: item.description || '',
      year: item.year || item.date || '',
      technology: (item.technology || []).join(', '),
      category: item.category || '',
      milestoneType: item.milestoneType || '',
      order: item.order || 0
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) await deleteDoc(doc(db, 'timeline', id));
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">Timeline Registry <span className="text-white/40 text-sm ml-2">/ SYS_TIMELINE</span></h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Initialize / Edit Node</h3>
        
        <input name="title" placeholder="TITLE" value={formData.title} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        <textarea name="description" placeholder="DESCRIPTION" value={formData.description} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none min-h-[80px]" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="year" placeholder="YEAR (e.g., 2023)" value={formData.year} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input type="number" name="order" placeholder="DISPLAY_ORDER" value={formData.order} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <input name="technology" placeholder="TECHNOLOGIES (comma separated)" value={formData.technology} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="category" placeholder="CATEGORY" value={formData.category} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="milestoneType" placeholder="MILESTONE_TYPE" value={formData.milestoneType} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50">
            {isSaving ? 'SAVING...' : editingId ? 'EXECUTE_UPDATE' : 'COMPILE_NEW'}
          </button>
          {editingId && <button type="button" disabled={isSaving} onClick={() => setEditingId(null)} className="flex-1 bg-white/5 text-white/60 border border-white/10 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">TERMINATE_EDIT</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {timeline.map(item => (
          <div key={item.id} className="border border-white/10 bg-[#121214] p-4 flex flex-col gap-2 relative group hover:border-white/30 transition-colors">
            <h4 className="text-white font-bold font-display uppercase tracking-widest leading-tight">{item.title}</h4>
            <p className="text-[#00FF41]/70 font-mono text-[10px] uppercase tracking-wider">{item.year || item.date} • ORD: {item.order}</p>
            <p className="text-white/40 text-xs font-mono line-clamp-2 mt-2 border-t border-white/5 pt-2">{item.description}</p>
            
            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
              <button onClick={() => handleEdit(item)} className="flex-1 border border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/5 hover:bg-[#00FF41]/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">MODIFY</button>
              <button onClick={() => handleDelete(item.id)} className="flex-1 border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
