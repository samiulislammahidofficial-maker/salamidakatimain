import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  setDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  increment
} from 'firebase/firestore';
import { db, auth } from '../firebase';

export type SalamiType = 'money' | 'food' | 'both';

export interface Submission {
  id: string;
  university: string;
  department: string;
  amount: number;
  type: SalamiType;
  comment?: string;
  seniorName?: string;
  seniorFbLink?: string;
  timestamp: number;
  likes: number;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
}

export interface Department {
  id: string;
  name: string;
  universityId: string;
}

export interface MemeComment {
  id: string;
  text: string;
  timestamp: number;
}

export interface Meme {
  id: string;
  expectation?: string;
  reality?: string;
  imageUrl?: string;
  likes: number;
  comments: MemeComment[];
  timestamp: number;
}

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface DataContextType {
  submissions: Submission[];
  universities: University[];
  departments: Department[];
  memes: Meme[];
  addSubmission: (submission: Omit<Submission, 'id' | 'timestamp' | 'likes'>) => Promise<void>;
  likeSubmission: (id: string) => Promise<void>;
  addDepartment: (universityId: string, name: string) => Promise<void>;
  addMeme: (meme: Omit<Meme, 'id' | 'likes' | 'comments' | 'timestamp'>) => Promise<void>;
  likeMeme: (id: string) => Promise<void>;
  addMemeComment: (memeId: string, text: string) => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const seedData = async () => {
      const univSnap = await getDocs(collection(db, 'universities'));
      if (univSnap.empty) {
        const INITIAL_UNIVERSITIES = [
          { id: 'du', name: 'Dhaka University', shortName: 'DU' },
          { id: 'buet', name: 'BUET', shortName: 'BUET' },
          { id: 'nsus', name: 'North South University', shortName: 'NSU' },
          { id: 'brac', name: 'BRAC University', shortName: 'BRACU' },
          { id: 'ju', name: 'Jahangirnagar University', shortName: 'JU' },
        ];
        for (const u of INITIAL_UNIVERSITIES) {
          await setDoc(doc(db, 'universities', u.id), { name: u.name, shortName: u.shortName });
        }
      }

      const deptSnap = await getDocs(collection(db, 'departments'));
      if (deptSnap.empty) {
        const INITIAL_DEPARTMENTS = [
          { id: 'cse-du', name: 'CSE', universityId: 'du' },
          { id: 'iba-du', name: 'IBA', universityId: 'du' },
          { id: 'eee-buet', name: 'EEE', universityId: 'buet' },
          { id: 'cse-buet', name: 'CSE', universityId: 'buet' },
          { id: 'bba-nsu', name: 'BBA', universityId: 'nsus' },
          { id: 'cse-brac', name: 'CSE', universityId: 'brac' },
          { id: 'pharm-ju', name: 'Pharmacy', universityId: 'ju' },
        ];
        for (const d of INITIAL_DEPARTMENTS) {
          await setDoc(doc(db, 'departments', d.id), { name: d.name, universityId: d.universityId });
        }
      }

      const subSnap = await getDocs(collection(db, 'submissions'));
      if (subSnap.empty) {
        const INITIAL_SUBMISSIONS = [
          { university: 'du', department: 'cse-du', amount: 500, type: 'both', comment: 'ভাইয়া জোস! কাচ্চি খাওয়াইছে 😋', seniorName: 'রাহিম ভাই', seniorFbLink: 'https://facebook.com/rahim', timestamp: Date.now() - 100000, likes: 12 },
          { university: 'buet', department: 'eee-buet', amount: 50, type: 'money', comment: 'জীবনটাই মিথ্যা 💀', timestamp: Date.now() - 200000, likes: 45 },
          { university: 'nsus', department: 'bba-nsu', amount: 1000, type: 'money', comment: 'বড়লোক ভাইয়া 😎', timestamp: Date.now() - 300000, likes: 8 },
          { university: 'du', department: 'iba-du', amount: 0, type: 'food', comment: 'শুধু সিঙ্গারা দিছে 😭', timestamp: Date.now() - 400000, likes: 23 },
        ];
        for (const s of INITIAL_SUBMISSIONS) {
          await addDoc(collection(db, 'submissions'), s);
        }
      }

      const memeSnap = await getDocs(collection(db, 'memes'));
      if (memeSnap.empty) {
        const INITIAL_MEMES = [
          {
            expectation: "৫০০ টাকা + কাচ্চি ভাইয়া খাওয়াবে 😎",
            reality: "১টা সিঙ্গারা আর হাফ চা 😭",
            likes: 124,
            timestamp: Date.now() - 100000,
          },
          {
            expectation: "সিনিয়র ভাইয়া ডাকছে, সালামি দিবে মনে হয় 🤑",
            reality: "অ্যাসাইনমেন্ট করে দিতে বলছে 💀",
            likes: 89,
            timestamp: Date.now() - 200000,
          }
        ];
        for (const m of INITIAL_MEMES) {
          await addDoc(collection(db, 'memes'), m);
        }
      }
    };

    seedData();

    // Universities
    const unsubUniversities = onSnapshot(collection(db, 'universities'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as University));
      setUniversities(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'universities'));

    // Departments
    const unsubDepartments = onSnapshot(collection(db, 'departments'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
      setDepartments(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'departments'));

    // Submissions
    const qSubmissions = query(collection(db, 'submissions'), orderBy('timestamp', 'desc'));
    const unsubSubmissions = onSnapshot(qSubmissions, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
      setSubmissions(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'submissions'));

    // Memes
    const qMemes = query(collection(db, 'memes'), orderBy('timestamp', 'desc'));
    const unsubMemes = onSnapshot(qMemes, async (snapshot) => {
      const memesData = await Promise.all(snapshot.docs.map(async (memeDoc) => {
        const meme = { id: memeDoc.id, ...memeDoc.data() } as any;
        
        // Fetch comments for each meme
        const commentsSnapshot = await getDocs(collection(db, `memes/${memeDoc.id}/comments`));
        const comments = commentsSnapshot.docs.map(cDoc => ({ id: cDoc.id, ...cDoc.data() } as MemeComment));
        
        return { ...meme, comments };
      }));
      setMemes(memesData);
      setLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, 'memes'));

    return () => {
      unsubUniversities();
      unsubDepartments();
      unsubSubmissions();
      unsubMemes();
    };
  }, []);

  const addSubmission = async (submission: Omit<Submission, 'id' | 'timestamp' | 'likes'>) => {
    const path = 'submissions';
    try {
      await addDoc(collection(db, path), {
        ...submission,
        timestamp: Date.now(),
        likes: 0,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const likeSubmission = async (id: string) => {
    const path = `submissions/${id}`;
    try {
      const docRef = doc(db, 'submissions', id);
      await updateDoc(docRef, {
        likes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const addDepartment = async (universityId: string, name: string) => {
    const path = 'departments';
    try {
      await addDoc(collection(db, path), {
        name,
        universityId
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const addMeme = async (meme: Omit<Meme, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
    const path = 'memes';
    try {
      await addDoc(collection(db, path), {
        ...meme,
        likes: 0,
        timestamp: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const likeMeme = async (id: string) => {
    const path = `memes/${id}`;
    try {
      const docRef = doc(db, 'memes', id);
      await updateDoc(docRef, {
        likes: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const addMemeComment = async (memeId: string, text: string) => {
    const path = `memes/${memeId}/comments`;
    try {
      await addDoc(collection(db, path), {
        text,
        timestamp: Date.now()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  return (
    <DataContext.Provider value={{ 
      submissions, universities, departments, memes, 
      addSubmission, likeSubmission, addDepartment, addMeme, likeMeme, addMemeComment,
      loading
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
