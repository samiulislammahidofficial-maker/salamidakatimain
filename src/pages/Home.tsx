import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { TrendingUp, Award, ChevronRight } from 'lucide-react';

export default function Home() {
  const { universities, departments, submissions, loading } = useData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate trending departments (most submissions)
  const deptSubmissionCounts = submissions.reduce((acc, sub) => {
    acc[sub.department] = (acc[sub.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const trendingDepts = Object.entries(deptSubmissionCounts)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([deptId, count]) => {
      const dept = departments.find(d => d.id === deptId);
      const uni = universities.find(u => u.id === dept?.universityId);
      return { dept, uni, count };
    });

  // Calculate top salami (highest average)
  const deptAvgSalami = departments.map(dept => {
    const deptSubs = submissions.filter(s => s.department === dept.id && s.amount > 0);
    const avg = deptSubs.length > 0 
      ? Math.round(deptSubs.reduce((sum, s) => sum + s.amount, 0) / deptSubs.length)
      : 0;
    const uni = universities.find(u => u.id === dept.universityId);
    return { dept, uni, avg };
  }).sort((a, b) => b.avg - a.avg).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
          সালামি ডাকাতি <span className="text-5xl">💰</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-lg mx-auto">
          কোন ডিপার্টমেন্টে কতো সালামি? আজকেই জেনে নাও!
        </p>
        <div className="pt-4">
          <Link 
            to="/submit" 
            className="inline-flex items-center justify-center px-6 py-3 text-base font-bold text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            তুমি কী পাইছো? সাবমিট দাও 🚀
          </Link>
        </div>
      </div>

      {/* Universities Grid */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>ইউনিভার্সিটি বাছাই করো</span>
          <span>🎓</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {universities.map(uni => (
            <Link 
              key={uni.id} 
              to={`/university/${uni.id}`}
              className="bg-blue-50/80 p-4 rounded-2xl shadow-sm border border-blue-100 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col items-center text-center gap-2"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg group-hover:scale-110 transition-transform">
                {uni.shortName[0]}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{uni.shortName}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{uni.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Trending Departments */}
        <section className="bg-blue-50/80 p-5 rounded-3xl shadow-sm border border-blue-100 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-orange-600">
            <TrendingUp className="w-6 h-6" />
            <span>ট্রেন্ডিং ডিপার্টমেন্ট 🔥</span>
          </h2>
          <div className="space-y-3">
            {trendingDepts.map((item, i) => item.dept && (
              <Link 
                key={item.dept.id}
                to={`/department/${item.dept.id}`}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.dept.name}</h3>
                    <p className="text-xs text-slate-500">{item.uni?.shortName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <span>{item.count} সাবমিশন</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Top Salami List */}
        <section className="bg-blue-50/80 p-5 rounded-3xl shadow-sm border border-blue-100 space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-600">
            <Award className="w-6 h-6" />
            <span>টপ সালামি লিস্ট 💰</span>
          </h2>
          <div className="space-y-3">
            {deptAvgSalami.map((item, i) => (
              <Link 
                key={item.dept.id}
                to={`/department/${item.dept.id}`}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                    #{i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{item.dept.name}</h3>
                    <p className="text-xs text-slate-500">{item.uni?.shortName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600">{item.avg} ৳</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
