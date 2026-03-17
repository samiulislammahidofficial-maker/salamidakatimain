import React, { useState } from 'react';
import { useData } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';

export default function Calculator() {
  const { universities, departments, submissions } = useData();
  
  const [uniId, setUniId] = useState('');
  const [deptId, setDeptId] = useState('');
  const [year, setYear] = useState('');
  const [result, setResult] = useState<{ text: string; emoji: string; color: string } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const filteredDepts = departments.filter(d => d.universityId === uniId);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniId || !deptId || !year) return;

    setIsCalculating(true);
    setResult(null);

    setTimeout(() => {
      const deptSubs = submissions.filter(s => s.department === deptId);
      const avg = deptSubs.length > 0 
        ? Math.round(deptSubs.reduce((sum, s) => sum + s.amount, 0) / deptSubs.length)
        : 0;

      // Add some randomness based on year
      const yearMultiplier = year === '1' ? 1.2 : year === '2' ? 1.0 : year === '3' ? 0.8 : 0.5;
      const predicted = Math.round((avg || Math.random() * 500) * yearMultiplier);

      let res;
      if (predicted > 500) {
        res = { text: `তোমার কপালে আছে: ${predicted} টাকা + কাচ্চি!`, emoji: '😎🔥', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      } else if (predicted > 200) {
        res = { text: `মোটামুটি ${predicted} টাকার মতো পাবা।`, emoji: '😋', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      } else if (predicted > 0) {
        res = { text: `ভাই, তুমি শেষ… বড়জোর ${predicted} টাকা।`, emoji: '😭💀', color: 'text-orange-600 bg-orange-50 border-orange-200' };
      } else {
        res = { text: `তোমার কপালে শুধু সিঙ্গারা আর চা!`, emoji: '🥲', color: 'text-slate-600 bg-slate-50 border-slate-200' };
      }

      setResult(res);
      setIsCalculating(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">তোমার ভাগ্যে কী আছে? 🔮</h1>
        <p className="text-slate-500">ডিপার্টমেন্ট আর ইয়ার দিয়ে চেক করো</p>
      </div>

      <form onSubmit={handleCalculate} className="bg-blue-50/80 p-6 rounded-3xl shadow-sm border border-blue-100 space-y-5">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">ইউনিভার্সিটি</label>
          <select 
            required
            value={uniId}
            onChange={(e) => { setUniId(e.target.value); setDeptId(''); }}
            className="w-full p-3 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">সিলেক্ট করো...</option>
            {universities.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">ডিপার্টমেন্ট</label>
          <select 
            required
            disabled={!uniId}
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            className="w-full p-3 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all disabled:opacity-50"
          >
            <option value="">সিলেক্ট করো...</option>
            {filteredDepts.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-slate-700">তুমি কোন ইয়ার?</label>
          <select 
            required
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-3 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">সিলেক্ট করো...</option>
            <option value="1">১ম বর্ষ (ফ্রেশার)</option>
            <option value="2">২য় বর্ষ</option>
            <option value="3">৩য় বর্ষ</option>
            <option value="4">৪র্থ বর্ষ (সিনিয়র)</option>
          </select>
        </div>

        <button 
          type="submit"
          disabled={isCalculating || !uniId || !deptId || !year}
          className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? 'হিসাব হচ্ছে... 🔮' : 'ক্যালকুলেট করো 🚀'}
        </button>
      </form>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl border text-center space-y-2 ${result.color}`}
          >
            <div className="text-4xl">{result.emoji}</div>
            <p className="text-xl font-bold">{result.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
