import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Coins, Pizza, Wallet, User, Link as LinkIcon } from 'lucide-react';
import { useData, SalamiType } from '../data/mockData';
import { motion } from 'framer-motion';

export default function Submit() {
  const navigate = useNavigate();
  const { universities, departments, addSubmission, addDepartment } = useData();
  
  const [uniId, setUniId] = useState('');
  const [deptId, setDeptId] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [type, setType] = useState<SalamiType | ''>('');
  const [amount, setAmount] = useState('');
  const [comment, setComment] = useState('');
  const [seniorName, setSeniorName] = useState('');
  const [seniorFbLink, setSeniorFbLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredDepts = departments.filter(d => d.universityId === uniId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uniId || !type) return;
    if (deptId === 'new' && !newDeptName.trim()) return;
    if (deptId !== 'new' && !deptId) return;
    if ((type === 'money' || type === 'both') && !amount) return;

    setIsSubmitting(true);

    try {
      let finalDeptId = deptId;
      
      // Add new department if selected
      if (deptId === 'new') {
        const newDept = await addDepartment(uniId, newDeptName.trim());
        finalDeptId = newDept.id;
      }

      await addSubmission({
        university: uniId,
        department: finalDeptId,
        type: type as SalamiType,
        amount: Number(amount) || 0,
        comment,
        seniorName: seniorName.trim() || undefined,
        seniorFbLink: seniorFbLink.trim() || undefined,
      });

      setIsSubmitting(false);
      setShowSuccess(true);

      setTimeout(() => {
        navigate(`/department/${finalDeptId}`);
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl"
        >
          💰
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-blue-600"
        >
          ডেটা ঢুকে গেছে!
        </motion.h2>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">তুমি কী পাইছো? 😏</h1>
        <p className="text-slate-500">সত্যি কথা বলবা, কেউ জানবে না তুমি কে!</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-blue-50/80 p-6 rounded-3xl shadow-sm border border-blue-100 space-y-6">
        {/* University & Department */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ইউনিভার্সিটি</label>
            <select
              required
              value={uniId}
              onChange={(e) => {
                setUniId(e.target.value);
                setDeptId('');
                setNewDeptName('');
              }}
              className="w-full p-3 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">সিলেক্ট করো...</option>
              {universities.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {uniId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ডিপার্টমেন্ট</label>
              <select
                required
                value={deptId}
                onChange={(e) => setDeptId(e.target.value)}
                className="w-full p-3 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                <option value="">সিলেক্ট করো...</option>
                {filteredDepts.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
                <option value="new" className="font-bold text-blue-600">+ নতুন ডিপার্টমেন্ট যোগ করো</option>
              </select>
            </div>
          )}

          {deptId === 'new' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <label className="block text-sm font-medium text-slate-700 mb-1">নতুন ডিপার্টমেন্টের নাম</label>
              <input
                type="text"
                required
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                placeholder="যেমন: Software Engineering"
                className="w-full p-3 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </motion.div>
          )}
        </div>

        {/* Type Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">কী পাইছো?</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setType('money')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                type === 'money' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-blue-50/40 border-blue-200 text-slate-600 hover:bg-blue-50'
              }`}
            >
              <Wallet className="w-6 h-6" />
              <span className="text-sm font-medium">শুধু টাকা</span>
            </button>
            <button
              type="button"
              onClick={() => setType('food')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                type === 'food' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-blue-50/40 border-blue-200 text-slate-600 hover:bg-blue-50'
              }`}
            >
              <Pizza className="w-6 h-6" />
              <span className="text-sm font-medium">শুধু খাবার</span>
            </button>
            <button
              type="button"
              onClick={() => setType('both')}
              className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                type === 'both' 
                  ? 'bg-blue-100 border-blue-500 text-blue-700' 
                  : 'bg-blue-50/40 border-blue-200 text-slate-600 hover:bg-blue-50'
              }`}
            >
              <Coins className="w-6 h-6" />
              <span className="text-sm font-medium">দুটোই 😎</span>
            </button>
          </div>
        </div>

        {/* Amount */}
        {(type === 'money' || type === 'both') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <label className="block text-sm font-medium text-slate-700 mb-1">কতো টাকা?</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">৳</span>
              <input
                type="number"
                required
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full p-3 pl-8 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </motion.div>
        )}

        {/* Senior Info Section */}
        <div className="pt-4 border-t border-blue-100 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            সিনিয়রের তথ্য (অপশনাল)
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">সিনিয়রের নাম</label>
            <input
              type="text"
              value={seniorName}
              onChange={(e) => setSeniorName(e.target.value)}
              placeholder="যেমন: রাহিম ভাই"
              className="w-full p-3 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">সিনিয়রের ফেসবুক লিংক</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <LinkIcon className="w-4 h-4" />
              </span>
              <input
                type="url"
                value={seniorFbLink}
                onChange={(e) => setSeniorFbLink(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full p-3 pl-9 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">কিছু বলতে চাও? (অপশনাল)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="ভাইয়া জোস! / জীবনটাই মিথ্যা..."
            rows={3}
            className="w-full p-3 bg-blue-50/40 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !type || !uniId || !deptId || (deptId === 'new' && !newDeptName)}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
        >
          {isSubmitting ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              সাবমিট দাও <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
