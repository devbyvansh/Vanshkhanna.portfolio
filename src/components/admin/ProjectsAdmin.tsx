import { showSuccess, showError } from '../../lib/notifications';
import React, { useState } from 'react';
import { useFirebaseDoc } from '../../hooks/useFirebaseDoc';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../lib/firebase';

export default function ProjectsAdmin() {
  const { data: projects, isSaving, saveProject, removeProject } = useFirebaseDoc('projects');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: '',
    category: '',
    githubUrl: '',
    liveDemoUrl: '',
    image: '',
    featuredStatus: false,
    completionDate: '',
    projectStatus: ''
  });
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
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
      setFormData(prev => ({ ...prev, image: reader.result as string }));
      setTimeout(() => {
        setUploading(false);
        showSuccess('Image Uploaded Successfully');
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
    const payload = {
      title: formData.title,
      description: formData.description,
      techStack: formData.techStack.split(',').map(s => s.trim()).filter(Boolean),
      category: formData.category,
      githubUrl: formData.githubUrl,
      liveDemoUrl: formData.liveDemoUrl,
      image: formData.image,
      featuredStatus: formData.featuredStatus,
      completionDate: formData.completionDate,
      projectStatus: formData.projectStatus,
    };

    const success = await saveProject(payload, editingId);
    if (success) {
      if (editingId) setEditingId(null);
      setFormData({
        title: '', description: '', techStack: '', category: '',
        githubUrl: '', liveDemoUrl: '', image: '', featuredStatus: false,
        completionDate: '', projectStatus: ''
      });
    }
  };

  const handleEdit = (project: any) => {
    setEditingId(project.id);
      setFormData({
      title: project.title || '',
      description: project.description || '',
      techStack: (project.techStack || project.tech || []).join(', '),
      category: project.category || '',
      githubUrl: project.githubUrl || '',
      liveDemoUrl: project.liveDemoUrl || project.liveUrl || '',
      image: project.image || '',
      featuredStatus: project.featuredStatus || false,
      completionDate: project.completionDate || '',
      projectStatus: project.projectStatus || ''
    });
  };

  const handleDelete = async (id: string) => {
    await removeProject(id);
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">Project Manifest <span className="text-white/40 text-sm ml-2">/ SYS_PROJECTS</span></h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Initialize / Edit Object</h3>
        <input name="title" placeholder="TITLE_IDENTIFIER" value={formData.title} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        <textarea name="description" placeholder="OBJECT_DESCRIPTION" value={formData.description} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none min-h-[100px]" />
        <input name="techStack" placeholder="TECH_STACK (comma separated arrays)" value={formData.techStack} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        <div className="grid grid-cols-2 gap-4">
          <input name="category" placeholder="CATEGORY" value={formData.category} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <div className="relative group">
            {formData.image.startsWith('data:') ? (
               <div className="w-full p-2 bg-black/50 border border-[#00FF41]/30 text-[#00FF41] font-mono text-xs flex justify-between items-center group">
                 <span className="truncate mr-2">FILE_ATTACHED [{(formData.image.length / 1024).toFixed(0)}KB]</span>
                 <button type="button" onClick={() => setFormData(prev => ({...prev, image: ''}))} className="text-red-500 hover:text-red-400">CLEAR</button>
               </div>
            ) : (
               <input name="image" placeholder="IMAGE_URL (or upload below)" value={formData.image} onChange={handleChange} className="w-full p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
            )}
          </div>
        </div>
        
        {/* Upload File feature */}
        <div className="border border-white/10 border-dashed p-4 flex flex-col items-center justify-center relative hover:bg-white/5 transition-colors cursor-pointer bg-black/30">
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />
          <span className="font-mono text-xs text-white/50 group-hover:text-[#00FF41]">
            {uploading ? `UPLOADING... ${progress}%` : '[ CLICK TO COMPUTE & UPLOAD IMAGE ASSET ]'}
          </span>
          {formData.image && formData.image.startsWith('https://firebasestorage') && (
            <div className="mt-2 text-xs font-mono text-[#00FF41]">Image stored remotely.</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input name="githubUrl" placeholder="GITHUB_REPO_URL" value={formData.githubUrl} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="liveDemoUrl" placeholder="LIVE_DEMO_URL" value={formData.liveDemoUrl} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input name="completionDate" placeholder="TIMESTAMP (YYYY-MM-DD)" value={formData.completionDate} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="projectStatus" placeholder="STATUS" value={formData.projectStatus} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <label className="flex items-center gap-2 cursor-pointer text-white/60 font-mono text-xs transition-colors hover:text-white">
          <input type="checkbox" name="featuredStatus" checked={formData.featuredStatus} onChange={handleChange} className="accent-[#00FF41]" />
          ENABLE_FEATURED_STATUS
        </label>

        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={uploading || isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {isSaving ? 'SAVING...' : editingId ? 'EXECUTE_UPDATE' : 'COMPILE_NEW'}
          </button>
          {editingId && <button type="button" disabled={uploading || isSaving} onClick={() => setEditingId(null)} className="flex-1 bg-white/5 text-white/60 border border-white/10 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">TERMINATE_EDIT</button>}
        </div>
      </form>

      <div className="grid xl:grid-cols-2 gap-4">
        {projects.map(proj => (
          <div key={proj.id} className="border border-white/10 bg-[#121214] p-4 flex flex-col gap-2 relative group hover:border-white/30 transition-colors">
            <h4 className="text-white font-bold font-display uppercase tracking-widest">{proj.title} {proj.featuredStatus && <span className="text-[#00FF41] text-[10px] bg-[#00FF41]/10 px-1 py-0.5 ml-2 border border-[#00FF41]/20 align-top inline-block leading-none">FEATURED</span>}</h4>
            <p className="text-white/40 text-xs font-mono line-clamp-2">{proj.description}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleEdit(proj)} className="flex-1 border border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/5 hover:bg-[#00FF41]/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">MODIFY</button>
              <button onClick={() => handleDelete(proj.id)} className="flex-1 border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
