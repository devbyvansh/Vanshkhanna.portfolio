import { showSuccess, showError } from '../../lib/notifications';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, writeBatch, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { PROJECTS, SKILL_CATEGORIES, CERTIFICATIONS } from '../../data';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    certifications: 0,
    skills: 0,
    achievements: 0,
    contactMessages: 0
  });
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    const unsubscibers: (() => void)[] = [];

    const watchCollection = (col: string, key: keyof typeof stats) => {
      const q = query(collection(db, col));
      const unsub = onSnapshot(q, (snapshot) => {
        setStats(prev => ({ ...prev, [key]: snapshot.size }));
      }, (error) => console.error(`Error loading ${col}:`, error));
      unsubscibers.push(unsub);
    };

    watchCollection('projects', 'projects');
    watchCollection('certifications', 'certifications');
    watchCollection('skills', 'skills');
    watchCollection('achievements', 'achievements');
    watchCollection('contact_messages', 'contactMessages');

    return () => {
      unsubscibers.forEach(unsub => unsub());
    };
  }, []);

  const handleSeedData = async () => {
    if (!window.confirm("This will add default static data (Projects, Skills, Certifications) to your database. Continue?")) return;
    setIsSeeding(true);
    
    try {
      const batch = writeBatch(db);
      
      // Seed Projects
      PROJECTS.forEach((proj, idx) => {
        const ref = doc(collection(db, 'projects'));
        batch.set(ref, {
          title: proj.title,
          description: proj.description,
          techStack: proj.tech,
          githubUrl: proj.githubUrl,
          liveDemoUrl: proj.liveUrl,
          image: proj.image,
          createdAt: new Date(Date.now() - idx * 1000).toISOString()
        });
      });
      
      // Seed Skills
      SKILL_CATEGORIES.forEach((cat) => {
        cat.skills.forEach((skill, idx) => {
          const ref = doc(collection(db, 'skills'));
          batch.set(ref, {
            skillName: skill.name,
            category: cat.title,
            proficiencyLevel: skill.level,
            displayOrder: idx,
            createdAt: new Date().toISOString()
          });
        });
      });

      // Seed Certs
      CERTIFICATIONS.forEach((cert) => {
        const ref = doc(collection(db, 'certifications'));
        batch.set(ref, {
          certificateTitle: cert.title,
          issuingOrganization: cert.issuer,
          issueDate: cert.date,
          credentialUrl: cert.url,
          createdAt: new Date().toISOString()
        });
      });

      await batch.commit();
      showSuccess('Seed Data');
    } catch (err: any) {
      showError('Seed Default Data', 'multiple', err);
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-mono uppercase tracking-widest text-[#00FF41]">Dashboard Summary <span className="text-white/40 text-sm ml-2">/ SYS_STATS</span></h2>
        
        {stats.projects === 0 && (
          <button 
            onClick={handleSeedData}
            disabled={isSeeding}
            className="border border-[#00FF41]/30 bg-[#00FF41]/10 text-[#00FF41] px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-[#00FF41]/20 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isSeeding ? 'SYNCING_DATA...' : 'SYNC_DEFAULT_DATA'}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          { label: 'Total Projects', value: stats.projects },
          { label: 'Total Certifications', value: stats.certifications },
          { label: 'Total Skills', value: stats.skills },
          { label: 'Total Achievements', value: stats.achievements },
          { label: 'Contact Messages', value: stats.contactMessages },
        ].map(stat => (
          <div key={stat.label} className="border border-white/10 bg-[#121214] p-6 group hover:border-[#00FF41]/40 transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 group-hover:via-[#00FF41]/50 to-transparent"></div>
            <h4 className="text-white/40 font-mono text-xs uppercase tracking-widest mb-2">{stat.label}</h4>
            <p className="text-4xl font-bold font-display text-white group-hover:text-[#00FF41] transition-colors">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
