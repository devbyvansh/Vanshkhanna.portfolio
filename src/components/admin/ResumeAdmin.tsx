import { showSuccess, showError } from '../../lib/notifications';
import { saveToFirebase } from '../../lib/firebaseUtils';
import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';

export default function ResumeAdmin() {
  const [formData, setFormData] = useState({
    resumeUrl: '',
    cvUrl: '',
    name: 'Vansh Khanna'
  });
  
  const [uploading, setUploading] = useState<{ [key: string]: boolean }>({
    resumeUrl: false,
    cvUrl: false
  });
  const [progress, setProgress] = useState<{ [key: string]: number }>({
    resumeUrl: 0,
    cvUrl: 0
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'portfolio_settings'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFormData({
          resumeUrl: data.resumeUrl || '',
          cvUrl: data.cvUrl || '',
          name: data.name || 'Vansh Khanna'
        });
      }
    });
    return () => unsub();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'resumeUrl' | 'cvUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Clear the input value
    e.target.value = '';

    if (file.size > 700 * 1024) {
      showError('Read File', 'local', new Error("File is too large (max 700KB for database storage). Please use a compressed version or paste a URL instead."));
      return;
    }

    setUploading(prev => ({ ...prev, [field]: true }));
    setProgress(prev => ({ ...prev, [field]: 0 }));

    const reader = new FileReader();

    // Simulate progress for UI feedback since readAsDataURL is very fast
    let simulatedProgress = 0;
    const interval = setInterval(() => {
      simulatedProgress += 20;
      if (simulatedProgress <= 100) {
        setProgress(prev => ({ ...prev, [field]: simulatedProgress }));
      }
    }, 100);

    reader.onloadend = () => {
      clearInterval(interval);
      setProgress(prev => ({ ...prev, [field]: 100 }));
      setFormData(prev => ({
        ...prev,
        [field]: reader.result as string
      }));
      setTimeout(() => {
        setUploading(prev => ({ ...prev, [field]: false }));
        showSuccess(`Uploaded ${field === 'resumeUrl' ? 'Resume' : 'CV'}`);
      }, 300);
    };

    reader.onerror = () => {
      clearInterval(interval);
      setUploading(prev => ({ ...prev, [field]: false }));
      showError('Read File', 'local', new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        resumeUrl: formData.resumeUrl,
        cvUrl: formData.cvUrl,
        name: formData.name || 'Vansh Khanna',
      };
      
      await saveToFirebase('settings', payload, 'portfolio_settings', 'Update Resume Logs');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">Resume & CV <span className="text-white/40 text-sm ml-2">/ SYS_DOCS</span></h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Document Resources</h3>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-white/60 font-mono text-xs mb-2 flex justify-between">
              RESUME_RESOURCE
              {uploading.resumeUrl && <span className="text-[#00FF41]">UPLOADING... {progress.resumeUrl}%</span>}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
               {formData.resumeUrl.startsWith('data:') ? (
                 <div className="flex-1 p-2 bg-black/50 border border-[#00FF41]/30 text-[#00FF41] font-mono text-xs flex justify-between items-center group">
                   <span className="truncate mr-2">FILE_ATTACHED [{(formData.resumeUrl.length / 1024).toFixed(0)}KB]</span>
                   <button type="button" onClick={() => setFormData(prev => ({...prev, resumeUrl: ''}))} className="text-red-500 hover:text-red-400">CLEAR</button>
                 </div>
               ) : (
                 <input name="resumeUrl" placeholder="Paste URL here..." value={formData.resumeUrl} onChange={handleChange} className="flex-1 p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
               )}
               <div className="relative">
                 <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'resumeUrl')} disabled={uploading.resumeUrl} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                 <button type="button" disabled={uploading.resumeUrl} className="w-full sm:w-auto px-4 py-2 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 font-mono text-xs hover:bg-[#00FF41]/20 transition-colors pointer-events-none whitespace-nowrap disabled:opacity-50">
                   {uploading.resumeUrl ? 'UPLOADING...' : 'OR UPLOAD FILE'}
                 </button>
               </div>
            </div>
          </div>

          <div>
            <label className="text-white/60 font-mono text-xs mb-2 flex justify-between">
              CV_RESOURCE
              {uploading.cvUrl && <span className="text-[#00FF41]">UPLOADING... {progress.cvUrl}%</span>}
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
               {formData.cvUrl.startsWith('data:') ? (
                 <div className="flex-1 p-2 bg-black/50 border border-[#00FF41]/30 text-[#00FF41] font-mono text-xs flex justify-between items-center group">
                   <span className="truncate mr-2">FILE_ATTACHED [{(formData.cvUrl.length / 1024).toFixed(0)}KB]</span>
                   <button type="button" onClick={() => setFormData(prev => ({...prev, cvUrl: ''}))} className="text-red-500 hover:text-red-400">CLEAR</button>
                 </div>
               ) : (
                 <input name="cvUrl" placeholder="Paste URL here..." value={formData.cvUrl} onChange={handleChange} className="flex-1 p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
               )}
               <div className="relative">
                 <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, 'cvUrl')} disabled={uploading.cvUrl} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                 <button type="button" disabled={uploading.cvUrl} className="w-full sm:w-auto px-4 py-2 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 font-mono text-xs hover:bg-[#00FF41]/20 transition-colors pointer-events-none whitespace-nowrap disabled:opacity-50">
                   {uploading.cvUrl ? 'UPLOADING...' : 'OR UPLOAD FILE'}
                 </button>
               </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={uploading.resumeUrl || uploading.cvUrl || isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? 'SAVING...' : 'SAVE_DOCUMENTS'}
          </button>
        </div>
      </form>
    </div>
  );
}
