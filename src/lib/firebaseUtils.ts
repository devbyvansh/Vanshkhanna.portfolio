import { collection, addDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { showSuccess, showError } from './notifications';
import { toast } from 'sonner';

export const saveToFirebase = async (
  collectionName: string,
  data: any,
  docId: string | null = null,
  successMessage: string = 'Save Data'
) => {
  try {
    const payload = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    if (docId) {
      if (collectionName === 'settings') {
        await setDoc(doc(db, collectionName, docId), payload, { merge: true });
      } else {
        await updateDoc(doc(db, collectionName, docId), payload);
      }
    } else {
      payload.createdAt = new Date().toISOString();
      await addDoc(collection(db, collectionName), payload);
    }
    
    showSuccess(successMessage);
    return true;
  } catch (error) {
    showError(successMessage, collectionName, error);
    return false;
  }
};
