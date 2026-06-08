import { showSuccess, showError } from '../../lib/notifications';
import { saveToFirebase } from '../../lib/firebaseUtils';
import React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function SkillsAdmin() {
  const [skills, setSkills] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    skillName: '',
    category: '',
    proficiencyLevel: 0,
    experienceLevel: '',
    displayOrder: 0,
    relatedTechnologies: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'skills'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setSkills(data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        skillName: formData.skillName,
        category: formData.category,
        proficiencyLevel: formData.proficiencyLevel,
        experienceLevel: formData.experienceLevel,
        displayOrder: formData.displayOrder,
        relatedTechnologies: formData.relatedTechnologies.split(',').map(s => s.trim()).filter(Boolean),
      };

      const success = await saveToFirebase('skills', payload, editingId, 'Save Skill');
      if (success) {
        if (editingId) setEditingId(null);
        setFormData({
          skillName: '', category: '', proficiencyLevel: 0, experienceLevel: '', displayOrder: 0, relatedTechnologies: ''
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (skill: any) => {
    setEditingId(skill.id);
      setFormData({
      skillName: skill.skillName || '',
      category: skill.category || '',
      proficiencyLevel: skill.proficiencyLevel || 0,
      experienceLevel: skill.experienceLevel || '',
      displayOrder: skill.displayOrder || 0,
      relatedTechnologies: (skill.relatedTechnologies || []).join(', ')
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) await deleteDoc(doc(db, 'skills', id));
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">Skills Registry <span className="text-white/40 text-sm ml-2">/ SYS_SKILLS</span></h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Initialize / Edit Node</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="skillName" placeholder="SKILL_NAME" value={formData.skillName} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="category" placeholder="CATEGORY" value={formData.category} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input type="number" name="proficiencyLevel" placeholder="PROFICIENCY (1-100)" value={formData.proficiencyLevel} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="experienceLevel" placeholder="EXP_LEVEL" value={formData.experienceLevel} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input type="number" name="displayOrder" placeholder="DISPLAY_ORDER" value={formData.displayOrder} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <input name="relatedTechnologies" placeholder="RELATED_TECH (comma separated)" value={formData.relatedTechnologies} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50">
            {isSaving ? 'SAVING...' : editingId ? 'EXECUTE_UPDATE' : 'COMPILE_NEW'}
          </button>
          {editingId && <button type="button" disabled={isSaving} onClick={() => setEditingId(null)} className="flex-1 bg-white/5 text-white/60 border border-white/10 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">TERMINATE_EDIT</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map(skill => (
          <div key={skill.id} className="border border-white/10 bg-[#121214] p-4 flex flex-col gap-2 relative group hover:border-white/30 transition-colors">
            <h4 className="text-white font-bold font-display uppercase tracking-widest leading-tight">{skill.skillName}</h4>
            <div className="text-[#00FF41]/70 font-mono text-[10px] uppercase tracking-wider mb-2">{skill.category} • LVL: {skill.proficiencyLevel}</div>
            
            <div className="w-full bg-white/5 h-1 mb-2">
              <div className="bg-[#00FF41] h-1 shadow-[0_0_10px_rgba(0,255,65,0.5)]" style={{ width: `${Math.min(100, Math.max(0, skill.proficiencyLevel || 0))}%` }}></div>
            </div>

            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
              <button onClick={() => handleEdit(skill)} className="flex-1 border border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/5 hover:bg-[#00FF41]/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">MODIFY</button>
              <button onClick={() => handleDelete(skill.id)} className="flex-1 border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
