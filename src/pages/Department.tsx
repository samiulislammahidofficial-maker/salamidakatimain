import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ChevronLeft, Heart, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from '../lib/formatDate';

export default function Department() {
  const { id } = useParams<{ id: string }>();
  const { departments, universities, submissions, likeSubmission, loading } = useData();
  const [sortBy, setSortBy] = useState<'new' | 'high' | 'funny'>('new');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const dept = departments.find(d => d.id === id);
  const uni = universities.find(u => u.id === dept?.universityId);

  if (!dept || !uni) {
    return <div className="text-center py-20">Department not found 😭</div>;
  }

  const deptSubs = submissions.filter(s => s.department === id);
  const moneySubs = deptSubs.filter(s => s.amount > 0);
  const avg = moneySubs.length > 0 
    ? Math.round(moneySubs.reduce((sum, s) => sum + s.amount, 0) / moneySubs.length)
    : 0;

  // Calculate most common type
  const typeCounts = deptSubs.reduce((acc, sub) => {
    acc[sub.type] = (acc[sub.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  let mostCommon = 'জানা নাই';
  if (deptSubs.length > 0) {
    const topType = Object.entries(typeCounts).sort(([,a], [,b]) => (b as number) - (a as number))[0][0];
    if (topType === 'money') mostCommon = 'শুধু টাকা 💰';
    else if (topType === 'food') mostCommon = 'শুধু খাবার 🍔';
    else mostCommon = 'টাকা + খাবার 😎';
  }

  const sortedSubs = [...deptSubs].sort((a, b) => {
    if (sortBy === 'new') return b.timestamp - a.timestamp;
    if (sortBy === 'high') return b.amount - a.amount;
    if (sortBy === 'funny') return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to={`/university/${uni.id}`} className="p-2 bg-blue-50/80 rounded-full shadow-sm hover:bg-blue-100 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{dept.name}</h1>
          <p className="text-slate-500">{uni.shortName} - সালামি রিপোর্ট</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
          <p className="text-sm text-blue-700 font-medium mb-1">গড় সালামি</p>
          <p className="text-3xl font-extrabold text-blue-600">{avg > 0 ? `${avg} ৳` : '---'}</p>
        </div>
        <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100">
          <p className="text-sm text-orange-700 font-medium mb-1">সবচেয়ে বেশি কী পাওয়া যায়?</p>
          <p className="text-xl font-bold text-orange-600">{mostCommon}</p>
        </div>
      </div>

      {/* Submissions Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold">মানুষজন কী পাইছে 👇</h2>
          <div className="flex gap-2 bg-blue-50/80 p-1 rounded-xl shadow-sm border border-blue-100 w-fit">
            {(['new', 'high', 'funny'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === sort 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {sort === 'new' ? 'নতুন' : sort === 'high' ? 'সবচেয়ে বেশি' : 'সবচেয়ে ফানি'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {sortedSubs.map(sub => (
            <div key={sub.id} className="bg-blue-50/80 p-5 rounded-3xl shadow-sm border border-blue-100 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {sub.amount > 0 ? `${sub.amount} ৳` : '০ ৳'}
                  </span>
                  {sub.type === 'food' && <span className="text-xl">🍔</span>}
                  {sub.type === 'both' && <span className="text-xl">+ 🍔</span>}
                </div>
                <span className="text-xs text-slate-400">
                  {formatDistanceToNow(sub.timestamp)}
                </span>
              </div>
              
              {sub.comment && (
                <p className="text-slate-700 bg-slate-50 p-3 rounded-2xl text-sm">
                  "{sub.comment}"
                </p>
              )}

              {(sub.seniorName || sub.seniorFbLink) && (
                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-2xl text-sm">
                  <p className="text-slate-700">
                    <span className="font-bold text-blue-700">সিনিয়র:</span> {sub.seniorName || 'নাম নাই'}
                  </p>
                  {sub.seniorFbLink && (
                    <a 
                      href={sub.seniorFbLink.startsWith('http') ? sub.seniorFbLink : `https://${sub.seniorFbLink}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium mt-1 inline-block"
                    >
                      ফেসবুক আইডি লিংক 🔗
                    </a>
                  )}
                </div>
              )}
              
              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={() => likeSubmission(sub.id)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-rose-500 transition-colors group"
                >
                  <Heart className={`w-4 h-4 ${sub.likes > 0 ? 'fill-rose-500 text-rose-500' : 'group-hover:fill-rose-100'}`} />
                  <span className="text-sm font-medium">{sub.likes}</span>
                </button>
              </div>
            </div>
          ))}
          
          {sortedSubs.length === 0 && (
            <div className="text-center py-10 bg-blue-50/80 rounded-3xl border border-dashed border-blue-200">
              <p className="text-slate-500">এখনো কেউ সাবমিট দেয় নাই 😭</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
