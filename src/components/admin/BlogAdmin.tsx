import { showSuccess, showError } from '../../lib/notifications';
import { saveToFirebase } from '../../lib/firebaseUtils';
import React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function BlogAdmin() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    draftMode: true
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'blog_posts'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setPosts(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        draftMode: formData.draftMode,
      };

      const success = await saveToFirebase('blog_posts', payload, editingId, 'Save Post');
      if (success) {
        if (editingId) setEditingId(null);
        setFormData({ title: '', content: '', draftMode: true });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditingId(post.id);
      setFormData({
      title: post.title || '',
      content: post.content || '',
      draftMode: post.draftMode ?? true
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) await deleteDoc(doc(db, 'blog_posts', id));
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">Transmission Logs <span className="text-white/40 text-sm ml-2">/ SYS_BLOG</span></h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Initialize / Edit Protocol</h3>
        
        <input name="title" placeholder="LOG_IDENTIFIER (Title)" value={formData.title} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        <textarea name="content" placeholder="CONTENT_PAYLOAD (Markdown)" value={formData.content} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none min-h-[200px]" required />
        
        <label className="flex items-center gap-2 cursor-pointer text-white/60 font-mono text-xs transition-colors hover:text-white mt-2">
          <input type="checkbox" name="draftMode" checked={formData.draftMode} onChange={handleChange} className="accent-[#00FF41]" />
          DRAFT_MODE (Unpublished)
        </label>
        
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50">
            {isSaving ? 'SAVING...' : editingId ? 'EXECUTE_UPDATE' : 'COMPILE_NEW'}
          </button>
          {editingId && <button type="button" disabled={isSaving} onClick={() => setEditingId(null)} className="flex-1 bg-white/5 text-white/60 border border-white/10 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">TERMINATE_EDIT</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(post => (
          <div key={post.id} className={`border border-white/10 bg-[#121214] p-4 flex flex-col gap-2 relative group hover:border-white/30 transition-colors ${post.draftMode ? 'opacity-60' : ''}`}>
            <h4 className="text-white font-bold font-display uppercase tracking-widest leading-tight">{post.title} {post.draftMode && <span className="text-orange-500 text-[10px] bg-orange-500/10 px-1 py-0.5 ml-2 border border-orange-500/20 align-top inline-block leading-none">DRAFT</span>}</h4>
            <div className="text-white/40 text-xs font-mono line-clamp-3 mb-2 whitespace-pre-wrap">{post.content.substring(0, 150)}...</div>
            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
              <button onClick={() => handleEdit(post)} className="flex-1 border border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/5 hover:bg-[#00FF41]/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">MODIFY</button>
              <button onClick={() => handleDelete(post.id)} className="flex-1 border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
