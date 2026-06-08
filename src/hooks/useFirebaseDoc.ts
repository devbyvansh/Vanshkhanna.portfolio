import { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { showSuccess, showError } from '../lib/notifications';

export function useFirebaseDoc(collectionName: string) {
  const [data, setData] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, collectionName), (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as any) }));
      setData(docs);
    });
    return () => unsub();
  }, [collectionName]);

  const saveProject = async (payload: any, id: string | null = null) => {
    setIsSaving(true);
    try {
      if (id) {
        await updateDoc(doc(db, collectionName, id), {
          ...payload,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, collectionName), {
          ...payload,
          createdAt: new Date().toISOString()
        });
      }
      showSuccess(id ? 'Project updated successfully' : 'Project created successfully');
      return true;
    } catch (error) {
      showError(id ? 'Update Project' : 'Create Project', collectionName, error);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const removeProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        showSuccess("Deleted successfully");
      } catch (error) {
        showError("Delete Document", collectionName, error);
      }
    }
  };

  return { data, isSaving, saveProject, removeProject };
}
