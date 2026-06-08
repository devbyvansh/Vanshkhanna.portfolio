import { showSuccess, showError } from '../../lib/notifications';
import { saveToFirebase } from '../../lib/firebaseUtils';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';

export default function MediaAdmin() {
  const [media, setMedia] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    type: 'Image'
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'media_files'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setMedia(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset value
    e.target.value = '';

    if (file.size > 700 * 1024) {
      showError('Read File', 'local', new Error("File is too large (max 700KB for database storage). Please use a compressed version or paste a URL instead."));
      return;
    }

    setUploading(true);
    setProgress(0);

    const reader = new FileReader();

    // Simulate progress for UI feedback since readAsDataURL is very fast
    let simulatedProgress = 0;
    const interval = setInterval(() => {
      simulatedProgress += 20;
      if (simulatedProgress <= 100) {
        setProgress(simulatedProgress);
      }
    }, 100);

    reader.onloadend = () => {
      clearInterval(interval);
      setProgress(100);
      setFormData(prev => ({ ...prev, url: reader.result as string }));
      setTimeout(() => {
        setUploading(false);
        showSuccess('Asset Uploaded Successfully');
      }, 300);
    };

    reader.onerror = () => {
      clearInterval(interval);
      setUploading(false);
      showError('Read File', 'local', new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...formData };
      const success = await saveToFirebase('media_files', payload, null, 'Save Media');
      if (success) {
        setFormData({ name: '', url: '', type: 'Image' });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) await deleteDoc(doc(db, 'media_files', id));
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">Asset Registry <span className="text-white/40 text-sm ml-2">/ SYS_MEDIA</span></h2>
      <p className="text-white/60 font-mono text-sm mb-6 uppercase tracking-widest">Store assets and images via cloud storage for reference.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Initialize / Upload Asset</h3>
        
        <input name="name" placeholder="ASSET_IDENTIFIER" value={formData.name} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        
        <div className="relative group">
          {formData.url.startsWith('data:') ? (
             <div className="w-full p-2 bg-black/50 border border-[#00FF41]/30 text-[#00FF41] font-mono text-xs flex justify-between items-center group">
               <span className="truncate mr-2">FILE_ATTACHED [{(formData.url.length / 1024).toFixed(0)}KB]</span>
               <button type="button" onClick={() => setFormData(prev => ({...prev, url: ''}))} className="text-red-500 hover:text-red-400">CLEAR</button>
             </div>
          ) : (
             <input name="url" placeholder="ASSET_URL (or upload below)" value={formData.url} onChange={handleChange} required className="w-full p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          )}
        </div>
        
        <div className="border border-white/10 border-dashed p-4 flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors cursor-pointer bg-black/30">
          <input 
            type="file" 
            accept="image/*,.pdf,.doc,.docx" 
            onChange={handleFileUpload} 
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />
          <span className="font-mono text-xs text-white/50 group-hover:text-[#00FF41]">
            {uploading ? `UPLOADING... ${progress}%` : '[ CLICK TO COMPUTE & UPLOAD ASSET ]'}
          </span>
          {formData.url && formData.url.startsWith('https://firebasestorage') && (
            <div className="mt-2 text-xs font-mono text-[#00FF41]">Resource linked to Cloud Storage.</div>
          )}
        </div>

        <select name="type" value={formData.type} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none">
          <option value="Image">IMAGE</option>
          <option value="Certificate">CERTIFICATE</option>
          <option value="Resume">RESUME</option>
          <option value="Project Asset">PROJECT_ASSET</option>
        </select>
        
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={uploading || isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? 'SAVING...' : 'ADD_ASSET_REFERENCE'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map(item => (
          <div key={item.id} className="border border-white/10 bg-[#121214] p-4 flex flex-col relative group hover:border-[#00FF41]/30 transition-colors">
            <div className="h-24 w-full bg-[#0A0A0B] border border-white/5 flex items-center justify-center overflow-hidden mb-4 relative group-hover:border-[#00FF41]/20 transition-colors">
              {item.type === 'Image' || item.type === 'Certificate' || item.type === 'Project Asset' ? (
                <img src={item.url} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" onError={(e) => (e.currentTarget.style.display = 'none')} />
              ) : (
                <span className="text-2xl text-white/20 font-mono">FILE</span>
              )}
            </div>
            <h4 className="text-white font-bold font-mono text-xs tracking-widest leading-tight truncate" title={item.name}>{item.name.toUpperCase()}</h4>
            <span className="text-[#00FF41]/50 text-[10px] font-mono tracking-widest mb-4 uppercase">{item.type}</span>
            
            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
              <button type="button" onClick={() => {
                navigator.clipboard.writeText(item.url);
                showSuccess('Copy Link to Clipboard');
              }} className="flex-1 border border-white/10 text-white/60 bg-white/5 hover:bg-white/10 hover:text-white py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">COPY_LINK</button>
              <button type="button" onClick={() => handleDelete(item.id)} className="flex-1 border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
