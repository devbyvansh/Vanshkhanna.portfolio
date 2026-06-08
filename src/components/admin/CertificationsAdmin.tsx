import { showSuccess, showError } from '../../lib/notifications';
import { saveToFirebase } from '../../lib/firebaseUtils';
import React from 'react';
import { useState, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function CertificationsAdmin() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    certificateTitle: '',
    issuingOrganization: '',
    issueDate: '',
    credentialUrl: '',
    credentialId: '',
    certificateImage: '',
    certificateCategory: '',
    description: '',
    verificationStatus: false
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'certifications'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setCertifications(data);
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
        certificateTitle: formData.certificateTitle,
        issuingOrganization: formData.issuingOrganization,
        issueDate: formData.issueDate,
        credentialUrl: formData.credentialUrl,
        credentialId: formData.credentialId,
        certificateImage: formData.certificateImage,
        certificateCategory: formData.certificateCategory,
        description: formData.description,
        verificationStatus: formData.verificationStatus,
      };

      const success = await saveToFirebase('certifications', payload, editingId, 'Save Certificate');
      if (success) {
        if (editingId) setEditingId(null);
        setFormData({
          certificateTitle: '', issuingOrganization: '', issueDate: '', credentialUrl: '', credentialId: '', certificateImage: '', certificateCategory: '', description: '', verificationStatus: false
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (cert: any) => {
    setEditingId(cert.id);
      setFormData({
      certificateTitle: cert.certificateTitle || '',
      issuingOrganization: cert.issuingOrganization || '',
      issueDate: cert.issueDate || '',
      credentialUrl: cert.credentialUrl || '',
      credentialId: cert.credentialId || '',
      certificateImage: cert.certificateImage || '',
      certificateCategory: cert.certificateCategory || '',
      description: cert.description || '',
      verificationStatus: cert.verificationStatus || false
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) await deleteDoc(doc(db, 'certifications', id));
  };

  return (
    <div>
      <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41] mb-6">Certifications Registry <span className="text-white/40 text-sm ml-2">/ SYS_CERTS</span></h2>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mb-12 p-6 border border-white/10 bg-[#121214] relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF41]/50 to-transparent"></div>
        <h3 className="text-white/60 font-mono text-xs uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Initialize / Edit Object</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="certificateTitle" placeholder="CERTIFICATE_TITLE" value={formData.certificateTitle} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="issuingOrganization" placeholder="ISSUING_ORG" value={formData.issuingOrganization} onChange={handleChange} required className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input name="issueDate" placeholder="ISSUE_DATE (YYYY-MM-DD)" value={formData.issueDate} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="certificateCategory" placeholder="CATEGORY" value={formData.certificateCategory} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
          <input name="credentialId" placeholder="CREDENTIAL_ID" value={formData.credentialId} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        </div>

        <input name="credentialUrl" placeholder="CREDENTIAL_URL" value={formData.credentialUrl} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        <input name="certificateImage" placeholder="IMAGE_URL_REF" value={formData.certificateImage} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none" />
        <textarea name="description" placeholder="OBJECT_DESCRIPTION" value={formData.description} onChange={handleChange} className="p-2 bg-black/50 border border-white/10 text-white font-mono text-xs focus:border-[#00FF41]/50 focus:outline-none min-h-[80px]" />
        
        <label className="flex items-center gap-2 cursor-pointer text-white/60 font-mono text-xs transition-colors hover:text-white mt-2">
          <input type="checkbox" name="verificationStatus" checked={formData.verificationStatus} onChange={handleChange} className="accent-[#00FF41]" />
          ENABLE_VERIFICATION_STATUS
        </label>
        
        <div className="flex gap-2 mt-4">
          <button type="submit" disabled={isSaving} className="flex-1 bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/30 py-2 font-mono text-xs tracking-widest uppercase hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50">
            {isSaving ? 'SAVING...' : editingId ? 'EXECUTE_UPDATE' : 'COMPILE_NEW'}
          </button>
          {editingId && <button type="button" disabled={isSaving} onClick={() => setEditingId(null)} className="flex-1 bg-white/5 text-white/60 border border-white/10 py-2 font-mono text-xs tracking-widest uppercase hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50">TERMINATE_EDIT</button>}
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {certifications.map(cert => (
          <div key={cert.id} className="border border-white/10 bg-[#121214] p-4 flex flex-col gap-2 relative group hover:border-white/30 transition-colors">
            <h4 className="text-white font-bold font-display uppercase tracking-widest leading-tight">{cert.certificateTitle}</h4>
            <p className="text-[#00FF41]/70 font-mono text-[10px] uppercase tracking-wider">{cert.issuingOrganization} • {cert.issueDate}</p>
            {cert.verificationStatus && <span className="absolute top-2 right-2 text-[#00FF41] text-[9px] border border-[#00FF41]/30 bg-[#00FF41]/10 px-1 py-0.5">VERIFIED</span>}
            
            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
              <button onClick={() => handleEdit(cert)} className="flex-1 border border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/5 hover:bg-[#00FF41]/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">MODIFY</button>
              <button onClick={() => handleDelete(cert.id)} className="flex-1 border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 py-1 font-mono text-[10px] uppercase tracking-widest transition-colors">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
