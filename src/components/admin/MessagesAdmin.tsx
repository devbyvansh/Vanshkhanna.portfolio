import { showSuccess, showError } from '../../lib/notifications';
import { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'contact_messages'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setMessages(data.sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()));
    });
    return () => unsub();
  }, []);

  const handleToggleRead = async (msg: any) => {
    await updateDoc(doc(db, 'contact_messages', msg.id), {
      isRead: !msg.isRead
    });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      await deleteDoc(doc(db, 'contact_messages', id));
    }
  };

  const handleExport = () => {
    const csvStr = messages.map(m => `"${m.name}","${m.email}","${m.subject}","${m.message}","${m.submissionDate}"`).join('\n');
    const blob = new Blob([`Name,Email,Subject,Message,Date\n${csvStr}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'messages.csv';
    a.click();
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-6">
        <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41]">Inbound Communications <span className="text-white/40 text-sm ml-2">/ SYS_MESSAGES</span></h2>
        <button onClick={handleExport} className="bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 text-xs font-mono text-white/80 transition-colors uppercase tracking-widest">
          Export_CSV
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mt-8">
        {messages.length === 0 ? (
          <div className="col-span-full py-12 text-center text-white/40 font-mono text-sm uppercase tracking-widest border border-white/5 bg-[#121214]">
            [ NO INBOUND TRANSMISSIONS ]
          </div>
        ) : null}
        {messages.map(msg => (
          <div key={msg.id} className={`border ${msg.isRead ? 'border-white/10 opacity-60' : 'border-[#00FF41]/40 shadow-[0_0_15px_rgba(0,255,65,0.1)]'} bg-[#121214] p-6 flex flex-col gap-4 relative group transition-all`}>
            {!msg.isRead && <div className="absolute top-0 right-0 w-2 h-2 bg-[#00FF41] mt-2 mr-2 animate-pulse"></div>}
            
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="text-white font-bold font-display uppercase tracking-widest mb-1">{msg.name}</h4>
                <p className="text-[#00FF41]/70 font-mono text-[10px] uppercase tracking-wider">{msg.email}</p>
              </div>
              <small className="text-white/30 font-mono text-[10px] uppercase text-right whitespace-nowrap border-b border-white/5 pb-1">REC: {new Date(msg.submissionDate).toLocaleString()}</small>
            </div>
            
            {msg.subject && <p className="text-white/60 font-mono text-xs border-l-2 border-white/20 pl-3">SUBJ: {msg.subject}</p>}
            
            <p className="text-white/80 font-mono text-sm leading-relaxed whitespace-pre-wrap flex-1">{msg.message}</p>
            
            <div className="flex gap-2 mt-auto pt-4 border-t border-white/5">
              <button 
                onClick={() => handleToggleRead(msg)} 
                className={`flex-1 border py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${msg.isRead ? 'border-white/20 text-white/40 bg-white/5 hover:bg-white/10' : 'border-[#00FF41]/30 text-[#00FF41] bg-[#00FF41]/5 hover:bg-[#00FF41]/10'}`}
              >
                {msg.isRead ? 'MARK_UNREAD' : 'MARK_READ'}
              </button>
              <button onClick={() => handleDelete(msg.id)} className="flex-1 border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500/10 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors">DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
