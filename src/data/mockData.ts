import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';

// Generate a simple anonymous ID for the session if not exists
const getAnonymousId = () => {
  let id = localStorage.getItem('salami_anon_id');
  if (!id) {
    id = 'anon_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('salami_anon_id', id);
  }
  return id;
};

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
  userId: string;
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
  userId: string;
}

export interface Meme {
  id: string;
  expectation?: string;
  reality?: string;
  imageUrl?: string;
  likes: number;
  comments: MemeComment[];
  timestamp: number;
  userId: string;
}

const INITIAL_UNIVERSITIES: University[] = [
  { id: 'du', name: 'Dhaka University', shortName: 'DU' },
  { id: 'buet', name: 'BUET', shortName: 'BUET' },
  { id: 'nsus', name: 'North South University', shortName: 'NSU' },
  { id: 'brac', name: 'BRAC University', shortName: 'BRACU' },
  { id: 'ju', name: 'Jahangirnagar University', shortName: 'JU' },
];

const INITIAL_DEPARTMENTS: Department[] = [
  { id: 'cse-du', name: 'CSE', universityId: 'du' },
  { id: 'iba-du', name: 'IBA', universityId: 'du' },
  { id: 'eee-buet', name: 'EEE', universityId: 'buet' },
  { id: 'cse-buet', name: 'CSE', universityId: 'buet' },
  { id: 'bba-nsu', name: 'BBA', universityId: 'nsus' },
  { id: 'cse-brac', name: 'CSE', universityId: 'brac' },
  { id: 'pharm-ju', name: 'Pharmacy', universityId: 'ju' },
];

export const useData = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [universities] = useState<University[]>(INITIAL_UNIVERSITIES);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [memes, setMemes] = useState<Meme[]>([]);
  const anonymousId = getAnonymousId();

  useEffect(() => {

    // Listen for submissions
    const qSubmissions = query(collection(db, 'submissions'), orderBy('timestamp', 'desc'));
    const unsubscribeSubmissions = onSnapshot(qSubmissions, (snapshot) => {
      const subs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Submission));
      setSubmissions(subs);
    }, (error) => {
      console.error("Firestore Submissions Error:", error);
    });

    // Listen for user-added departments
    const unsubscribeDepts = onSnapshot(collection(db, 'departments'), (snapshot) => {
      const addedDepts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
      setDepartments([...INITIAL_DEPARTMENTS, ...addedDepts]);
    }, (error) => {
      console.error("Firestore Departments Error:", error);
    });

    // Listen for memes
    const qMemes = query(collection(db, 'memes'), orderBy('timestamp', 'desc'));
    const unsubscribeMemes = onSnapshot(qMemes, (snapshot) => {
      const memeList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), comments: [] } as Meme));
      
      // For each meme, listen for comments
      memeList.forEach(meme => {
        onSnapshot(query(collection(db, 'memes', meme.id, 'comments'), orderBy('timestamp', 'asc')), (commentSnapshot) => {
          const comments = commentSnapshot.docs.map(d => ({ id: d.id, ...d.data() } as MemeComment));
          setMemes(prev => prev.map(m => m.id === meme.id ? { ...m, comments } : m));
        });
      });

      setMemes(memeList);
    }, (error) => {
      console.error("Firestore Memes Error:", error);
    });

    return () => {
      unsubscribeSubmissions();
      unsubscribeDepts();
      unsubscribeMemes();
    };
  }, []);

  const addSubmission = async (submission: Omit<Submission, 'id' | 'timestamp' | 'likes' | 'userId'>) => {
    try {
      await addDoc(collection(db, 'submissions'), {
        ...submission,
        timestamp: Date.now(),
        likes: 0,
        userId: anonymousId
      });
    } catch (error) {
      console.error("Error adding submission:", error);
    }
  };

  const likeSubmission = async (id: string) => {
    try {
      const subRef = doc(db, 'submissions', id);
      const subSnap = await getDoc(subRef);
      if (subSnap.exists()) {
        await updateDoc(subRef, {
          likes: (subSnap.data().likes || 0) + 1
        });
      }
    } catch (error) {
      console.error("Error liking submission:", error);
    }
  };

  const addDepartment = async (universityId: string, name: string) => {
    try {
      const docRef = await addDoc(collection(db, 'departments'), {
        name,
        universityId
      });
      return { id: docRef.id, name, universityId };
    } catch (error) {
      console.error("Error adding department:", error);
      return { id: `temp-${Date.now()}`, name, universityId };
    }
  };

  const addMeme = async (meme: Omit<Meme, 'id' | 'likes' | 'comments' | 'timestamp' | 'userId'>) => {
    try {
      await addDoc(collection(db, 'memes'), {
        ...meme,
        likes: 0,
        timestamp: Date.now(),
        userId: anonymousId
      });
    } catch (error) {
      console.error("Error adding meme:", error);
    }
  };

  const likeMeme = async (id: string) => {
    try {
      const memeRef = doc(db, 'memes', id);
      const memeSnap = await getDoc(memeRef);
      if (memeSnap.exists()) {
        await updateDoc(memeRef, {
          likes: (memeSnap.data().likes || 0) + 1
        });
      }
    } catch (error) {
      console.error("Error liking meme:", error);
    }
  };

  const addMemeComment = async (memeId: string, text: string) => {
    try {
      await addDoc(collection(db, 'memes', memeId, 'comments'), {
        text,
        timestamp: Date.now(),
        userId: anonymousId
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  return { 
    submissions, universities, departments, memes, 
    addSubmission, likeSubmission, addDepartment, addMeme, likeMeme, addMemeComment,
    anonymousId
  };
};
