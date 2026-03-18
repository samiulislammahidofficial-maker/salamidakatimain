import { Link } from 'react-router-dom';
import { useData } from '../data/mockData';

export default function Leaderboard() {
  const { universities, departments, submissions } = useData();

  const deptStats = departments.map(dept => {
    const deptSubs = submissions.filter(s => s.department === dept.id && s.amount > 0);
    const avg = deptSubs.length > 0 
      ? Math.round(deptSubs.reduce((sum, s) => sum + s.amount, 0) / deptSubs.length)
      : 0;
    const uni = universities.find(u => u.id === dept.universityId);
    return { dept, uni, avg, count: deptSubs.length };
  }).filter(stat => stat.count > 0);

  const topDildar = [...deptStats].sort((a, b) => b.avg - a.avg).slice(0, 5);
  const topKonjus = [...deptStats].sort((a, b) => a.avg - b.avg).slice(0, 5);

  if (deptStats.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-5xl">
          📉
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">লিডারবোর্ড খালি!</h1>
          <p className="text-slate-500">এখনো কোনো সালামি সাবমিট করা হয়নি। প্রথম সাবমিট করো!</p>
        </div>
        <Link
          to="/submit"
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          সালামি সাবমিট করো 🚀
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">সালামির কিং কারা? 👑</h1>
        <p className="text-slate-500">দেখো কোন ডিপার্টমেন্ট কেমন</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dildar Section */}
        <div className="bg-blue-50/80 p-6 rounded-3xl shadow-sm border border-blue-100 space-y-4">
          <h2 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <span>সবচেয়ে দিলদার</span>
            <span>😎💰</span>
          </h2>
          <div className="space-y-3">
            {topDildar.map((stat, i) => (
              <Link 
                key={stat.dept.id}
                to={`/department/${stat.dept.id}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{stat.dept.name}</h3>
                    <p className="text-xs text-slate-500">{stat.uni?.shortName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{stat.avg} ৳</p>
                  <p className="text-[10px] text-slate-400">গড় সালামি</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Konjus Section */}
        <div className="bg-blue-50/80 p-6 rounded-3xl shadow-sm border border-red-100 space-y-4">
          <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <span>সবচেয়ে কঞ্জুস</span>
            <span>😭💀</span>
          </h2>
          <div className="space-y-3">
            {topKonjus.map((stat, i) => (
              <Link 
                key={stat.dept.id}
                to={`/department/${stat.dept.id}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-red-50/50 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-200 text-red-800 flex items-center justify-center font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{stat.dept.name}</h3>
                    <p className="text-xs text-slate-500">{stat.uni?.shortName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">{stat.avg} ৳</p>
                  <p className="text-[10px] text-slate-400">গড় সালামি</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
