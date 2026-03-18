import React, { createContext, useContext, useState, useEffect } from 'react';

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

const INITIAL_SUBMISSIONS: Submission[] = [
  { id: '1', university: 'du', department: 'cse-du', amount: 500, type: 'both', comment: 'ভাইয়া জোস! কাচ্চি খাওয়াইছে 😋', seniorName: 'রাহিম ভাই', seniorFbLink: 'https://facebook.com/rahim', timestamp: Date.now() - 100000, likes: 12 },
  { id: '2', university: 'buet', department: 'eee-buet', amount: 50, type: 'money', comment: 'জীবনটাই মিথ্যা 💀', timestamp: Date.now() - 200000, likes: 45 },
  { id: '3', university: 'nsus', department: 'bba-nsu', amount: 1000, type: 'money', comment: 'বড়লোক ভাইয়া 😎', timestamp: Date.now() - 300000, likes: 8 },
  { id: '4', university: 'du', department: 'iba-du', amount: 0, type: 'food', comment: 'শুধু সিঙ্গারা দিছে 😭', timestamp: Date.now() - 400000, likes: 23 },
];

const INITIAL_MEMES: Meme[] = [
  {
    id: 'm1',
    expectation: "৫০০ টাকা + কাচ্চি ভাইয়া খাওয়াবে 😎",
    reality: "১টা সিঙ্গারা আর হাফ চা 😭",
    likes: 124,
    comments: [
      { id: 'c1', text: 'ভাই একদম সত্যি কথা 😭', timestamp: Date.now() - 50000 }
    ],
    timestamp: Date.now() - 100000,
  },
  {
    id: 'm2',
    expectation: "সিনিয়র ভাইয়া ডাকছে, সালামি দিবে মনে হয় 🤑",
    reality: "অ্যাসাইনমেন্ট করে দিতে বলছে 💀",
    likes: 89,
    comments: [],
    timestamp: Date.now() - 200000,
  }
];

interface DataContextType {
  submissions: Submission[];
  universities: University[];
  departments: Department[];
  memes: Meme[];
  addSubmission: (submission: Omit<Submission, 'id' | 'timestamp' | 'likes'>) => void;
  likeSubmission: (id: string) => void;
  addDepartment: (universityId: string, name: string) => Department;
  addMeme: (meme: Omit<Meme, 'id' | 'likes' | 'comments' | 'timestamp'>) => void;
  likeMeme: (id: string) => void;
  addMemeComment: (memeId: string, text: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [universities] = useState<University[]>(INITIAL_UNIVERSITIES);
  const [departments, setDepartments] = useState<Department[]>(INITIAL_DEPARTMENTS);
  const [memes, setMemes] = useState<Meme[]>([]);

  useEffect(() => {
    const storedSubs = localStorage.getItem('salami_submissions');
    if (storedSubs) setSubmissions(JSON.parse(storedSubs));
    else {
      setSubmissions(INITIAL_SUBMISSIONS);
      localStorage.setItem('salami_submissions', JSON.stringify(INITIAL_SUBMISSIONS));
    }

    const storedDepts = localStorage.getItem('salami_departments');
    if (storedDepts) setDepartments(JSON.parse(storedDepts));
    else {
      setDepartments(INITIAL_DEPARTMENTS);
      localStorage.setItem('salami_departments', JSON.stringify(INITIAL_DEPARTMENTS));
    }

    const storedMemes = localStorage.getItem('salami_memes');
    if (storedMemes) setMemes(JSON.parse(storedMemes));
    else {
      setMemes(INITIAL_MEMES);
      localStorage.setItem('salami_memes', JSON.stringify(INITIAL_MEMES));
    }
  }, []);

  const addSubmission = (submission: Omit<Submission, 'id' | 'timestamp' | 'likes'>) => {
    const newSubmission: Submission = {
      ...submission,
      id: Math.random().toString(36).substring(7),
      timestamp: Date.now(),
      likes: 0,
    };
    const updated = [newSubmission, ...submissions];
    setSubmissions(updated);
    localStorage.setItem('salami_submissions', JSON.stringify(updated));
  };

  const likeSubmission = (id: string) => {
    const updated = submissions.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s);
    setSubmissions(updated);
    localStorage.setItem('salami_submissions', JSON.stringify(updated));
  };

  const addDepartment = (universityId: string, name: string) => {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name,
      universityId
    };
    const updated = [...departments, newDept];
    setDepartments(updated);
    localStorage.setItem('salami_departments', JSON.stringify(updated));
    return newDept;
  };

  const addMeme = (meme: Omit<Meme, 'id' | 'likes' | 'comments' | 'timestamp'>) => {
    const newMeme: Meme = {
      ...meme,
      id: `meme-${Date.now()}`,
      likes: 0,
      comments: [],
      timestamp: Date.now()
    };
    const updated = [newMeme, ...memes];
    setMemes(updated);
    localStorage.setItem('salami_memes', JSON.stringify(updated));
  };

  const likeMeme = (id: string) => {
    const updated = memes.map(m => m.id === id ? { ...m, likes: m.likes + 1 } : m);
    setMemes(updated);
    localStorage.setItem('salami_memes', JSON.stringify(updated));
  };

  const addMemeComment = (memeId: string, text: string) => {
    const updated = memes.map(m => {
      if (m.id === memeId) {
        return {
          ...m,
          comments: [...m.comments, { id: `c-${Date.now()}`, text, timestamp: Date.now() }]
        };
      }
      return m;
    });
    setMemes(updated);
    localStorage.setItem('salami_memes', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider value={{ 
      submissions, universities, departments, memes, 
      addSubmission, likeSubmission, addDepartment, addMeme, likeMeme, addMemeComment 
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
