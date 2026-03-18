import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, ImagePlus, Send, X } from 'lucide-react';
import { useData } from '../data/mockData';
import { formatDistanceToNow } from '../lib/formatDate';
import { motion, AnimatePresence } from 'framer-motion';

export default function Memes() {
  const { memes, addMeme, likeMeme, addMemeComment } = useData();
  const [showForm, setShowForm] = useState(false);
  const [expectation, setExpectation] = useState('');
  const [reality, setReality] = useState('');
  const [image, setImage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeCommentMeme, setActiveCommentMeme] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitMeme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expectation && !image) return;
    await addMeme({ expectation, reality, imageUrl: image });
    setExpectation('');
    setReality('');
    setImage('');
    setShowForm(false);
  };

  const handleAddComment = async (e: React.FormEvent, memeId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addMemeComment(memeId, commentText.trim());
    setCommentText('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">রিয়েলিটি চেক 😂</h1>
        <p className="text-slate-500">সালামির নামে যা হয় আর কি...</p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          {showForm ? <X className="w-5 h-5" /> : <ImagePlus className="w-5 h-5" />}
          {showForm ? 'ক্যান্সেল করো' : 'নিজের মিম বানাও'}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmitMeme}
            className="bg-blue-50/80 p-6 rounded-3xl shadow-sm border border-blue-100 space-y-4 overflow-hidden"
          >
            <h3 className="font-bold text-lg text-blue-800">নতুন মিম আপলোড করো</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expectation (কী ভাবছিলা?)</label>
                <input
                  type="text"
                  value={expectation}
                  onChange={(e) => setExpectation(e.target.value)}
                  placeholder="যেমন: ৫০০ টাকা + কাচ্চি..."
                  className="w-full p-3 bg-white/60 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Reality (কী পাইছো?)</label>
                <input
                  type="text"
                  value={reality}
                  onChange={(e) => setReality(e.target.value)}
                  placeholder="যেমন: ১টা সিঙ্গারা..."
                  className="w-full p-3 bg-white/60 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">অথবা ছবি আপলোড করো</label>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-3 bg-white/60 border border-dashed border-blue-400 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <ImagePlus className="w-5 h-5" />
                  {image ? 'ছবি পরিবর্তন করো' : 'ছবি সিলেক্ট করো'}
                </button>
                {image && (
                  <div className="mt-3 relative rounded-xl overflow-hidden border border-blue-200">
                    <img src={image} alt="Preview" className="w-full h-auto max-h-48 object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={!expectation && !image}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-xl font-bold transition-all"
            >
              মিম পোস্ট করো 🚀
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {memes.map((meme) => (
          <div key={meme.id} className="bg-blue-50/80 rounded-3xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="p-6 space-y-4">
              {meme.expectation && (
                <div className="space-y-1">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    Expectation
                  </span>
                  <p className="text-xl font-medium text-slate-800">{meme.expectation}</p>
                </div>
              )}
              
              {meme.reality && (
                <div className="space-y-1 pt-4 border-t border-blue-100">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider">
                    Reality
                  </span>
                  <p className="text-xl font-medium text-slate-800">{meme.reality}</p>
                </div>
              )}

              {meme.imageUrl && (
                <div className="pt-4 border-t border-blue-100">
                  <img src={meme.imageUrl} alt="Meme" className="w-full rounded-2xl border border-blue-200" />
                </div>
              )}
            </div>

            <div className="bg-blue-100/50 px-6 py-3 flex items-center justify-between">
              <div className="flex gap-4">
                <button 
                  onClick={() => likeMeme(meme.id)}
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">{meme.likes}</span>
                </button>
                <button 
                  onClick={() => setActiveCommentMeme(activeCommentMeme === meme.id ? null : meme.id)}
                  className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{meme.comments.length}</span>
                </button>
              </div>
              <span className="text-sm text-slate-500">
                {formatDistanceToNow(meme.timestamp)}
              </span>
            </div>

            {/* Comments Section */}
            <AnimatePresence>
              {activeCommentMeme === meme.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/60 border-t border-blue-100 px-6 py-4 space-y-4"
                >
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {meme.comments.length === 0 ? (
                      <p className="text-center text-slate-500 text-sm py-2">কোনো কমেন্ট নেই। প্রথম কমেন্ট করো!</p>
                    ) : (
                      meme.comments.map(comment => (
                        <div key={comment.id} className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                          <p className="text-slate-800 text-sm">{comment.text}</p>
                          <span className="text-xs text-slate-400 mt-1 block">
                            {formatDistanceToNow(comment.timestamp)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <form onSubmit={(e) => handleAddComment(e, meme.id)} className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="কমেন্ট লেখো..."
                      className="flex-1 p-2 px-4 bg-white border border-blue-200 rounded-full focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
