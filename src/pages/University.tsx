import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ChevronLeft, Users, Coins } from 'lucide-react';

export default function University() {
  const { id } = useParams<{ id: string }>();
  const { universities, departments, submissions, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const uni = universities.find(u => u.id === id);
  const uniDepts = departments.filter(d => d.universityId === id);

  if (!uni) {
    return <div className="text-center py-20">University not found 😭</div>;
  }

  const deptStats = uniDepts.map(dept => {
    const deptSubs = submissions.filter(s => s.department === dept.id);
    const moneySubs = deptSubs.filter(s => s.amount > 0);
    const avg = moneySubs.length > 0 
      ? Math.round(moneySubs.reduce((sum, s) => sum + s.amount, 0) / moneySubs.length)
      : 0;
    
    let tag = null;
    if (avg > 500) tag = { label: 'দিলদার 😎', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    else if (avg > 0 && avg < 100) tag = { label: 'কঞ্জুস 😭', color: 'bg-red-100 text-red-700 border-red-200' };

    return { dept, count: deptSubs.length, avg, tag };
  }).sort((a, b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 bg-blue-50/80 rounded-full shadow-sm hover:bg-blue-100 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{uni.name}</h1>
          <p className="text-slate-500">এর সব ডিপার্টমেন্ট</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {deptStats.map(({ dept, count, avg, tag }) => (
          <Link 
            key={dept.id}
            to={`/department/${dept.id}`}
            className="bg-blue-50/80 p-5 rounded-3xl shadow-sm border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                {dept.name}
              </h2>
              {tag && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${tag.color}`}>
                  {tag.label}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">গড় সালামি</p>
                  <p className="font-bold">{avg > 0 ? `${avg} ৳` : 'ডেটা নাই'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">মোট সাবমিশন</p>
                  <p className="font-bold">{count}টা</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
        {deptStats.length === 0 && (
          <div className="col-span-full text-center py-10 bg-blue-50/80 rounded-3xl border border-dashed border-blue-200">
            <p className="text-slate-500 mb-2">কোনো ডিপার্টমেন্টের ডেটা নাই 😭</p>
            <Link to="/submit" className="text-blue-600 font-bold hover:underline">
              প্রথম সাবমিশনটা তুমিই দাও! 🚀
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
