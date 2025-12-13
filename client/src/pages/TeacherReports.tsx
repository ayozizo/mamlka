
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Link } from 'wouter';
import { ArrowRight, Star, TrendingUp, Trophy, BarChart3, Users, BookOpenCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import libraryBg from '@assets/stock_images/magical_fantasy_libr_db93ec0f.jpg';

export default function TeacherReports() {
  const { playerStats, worlds } = useGame();

  // Data preparation
  const worldData = worlds.map(w => ({
    name: w.name.split(' ')[1] || w.name, 
    score: w.stars * 33,
    full: 100
  }));

  const skillsData = [
    { subject: 'الإملاء', A: 90, fullMark: 100 },
    { subject: 'القواعد', A: 75, fullMark: 100 },
    { subject: 'الإبداع', A: 85, fullMark: 100 },
    { subject: 'السرعة', A: 65, fullMark: 100 },
    { subject: 'التركيز', A: 80, fullMark: 100 },
  ];

  const completedWorlds = worlds.filter(w => w.stars > 0);
  const completionRate = worlds.length ? Math.round((completedWorlds.length / worlds.length) * 100) : 0;
  const averageStars = completedWorlds.length
    ? (completedWorlds.reduce((sum, w) => sum + w.stars, 0) / completedWorlds.length).toFixed(1)
    : '0.0';

  const totalWorlds = worlds.length;
  const completedWorldsCount = completedWorlds.length;
  const totalStars = playerStats.stars;
  const totalScore = playerStats.totalScore;
  const currentXp = playerStats.xp;

  let bestWorldName = 'لا يوجد بعد';
  if (completedWorldsCount) {
    const sorted = [...completedWorlds].sort((a, b) => b.stars - a.stars);
    bestWorldName = sorted[0].name;
  }

  const difficultyLabels: Record<string, string> = {
    Easy: 'سهل',
    Medium: 'متوسط',
    Hard: 'صعب',
    Expert: 'خبير',
  };

  const difficultyColors: Record<string, string> = {
    Easy: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/40',
    Medium: 'bg-blue-500/15 text-blue-200 border-blue-400/40',
    Hard: 'bg-orange-500/15 text-orange-200 border-orange-400/40',
    Expert: 'bg-fuchsia-500/15 text-fuchsia-200 border-fuchsia-400/40',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${libraryBg})` }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        dir="rtl"
        className="relative z-10 w-full max-w-6xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="text-right space-y-1">
            <h1 className="text-3xl md:text-4xl font-['Amiri'] font-bold text-slate-50">
              لوحة تقرير المعلم
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              نظرة شاملة ومنظمة على تقدم الطالب في عوالم المهارات الإملائية والنحوية والإبداعية داخل المملكة التعليمية.
            </p>
          </div>
          <Link href="/">
            <button className="group bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/15 transition-all hover:scale-110">
              <ArrowRight className="w-6 h-6 text-white group-hover:text-yellow-300" />
            </button>
          </Link>
        </div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-4 shadow-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">العوالم المكتملة</span>
              <BookOpenCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-slate-50">{completedWorldsCount}/{totalWorlds}</span>
              <span className="text-xs text-emerald-400 font-medium">نسبة {completionRate}%</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-4 shadow-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">معدل النجوم</span>
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-yellow-300">{averageStars}</span>
              <span className="text-xs text-slate-300">إجمالي النجوم: {totalStars}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-4 shadow-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">النقاط والخبرة</span>
              <TrendingUp className="w-5 h-5 text-sky-300" />
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-50">{totalScore}</span>
              <span className="text-xs text-slate-300">الخبرة المكتسبة (XP): {currentXp}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-700/60 p-4 shadow-lg flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">أفضل عالم حتى الآن</span>
              <Trophy className="w-5 h-5 text-amber-300" />
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-sm font-['Amiri'] font-semibold text-slate-50 truncate">{bestWorldName}</span>
              <span className="text-xs text-slate-400">حسب عدد النجوم المحققة</span>
            </div>
          </div>
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* World performance chart */}
          <div className="rounded-2xl bg-slate-900/85 border border-slate-700/60 p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/40">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <h2 className="text-base font-['Amiri'] font-bold text-slate-50">أداء العوالم</h2>
                  <p className="text-xs text-slate-400">مقارنة النجوم بين العوالم المختلفة</p>
                </div>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worldData} layout="vertical" margin={{ left: 20, right: 24, top: 8, bottom: 8 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={90}
                    tick={{ fill: '#cbd5f5', fontSize: 12, fontFamily: 'Amiri', fontWeight: 'bold' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(56, 189, 248, 0.08)' }}
                    contentStyle={{ backgroundColor: '#020617', borderRadius: 8, border: '1px solid #0ea5e9', color: '#e2e8f0' }}
                  />
                  <defs>
                    <linearGradient id="worldScoreGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="100%" stopColor="#38bdf8" />
                    </linearGradient>
                  </defs>
                  <Bar
                    dataKey="score"
                    fill="url(#worldScoreGradient)"
                    radius={[0, 10, 10, 0] as [number, number, number, number]}
                    barSize={20}
                    background={{ fill: 'rgba(15,23,42,0.7)' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Skills radar chart */}
          <div className="rounded-2xl bg-slate-900/85 border border-slate-700/60 p-5 shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-400/40">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <h2 className="text-base font-['Amiri'] font-bold text-slate-50">خريطة المهارات</h2>
                  <p className="text-xs text-slate-400">توزيع مستوى الطالب في المهارات الأساسية</p>
                </div>
              </div>
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                  <PolarGrid stroke="#6366f1" strokeOpacity={0.2} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#e5e7eb', fontSize: 12, fontFamily: 'Amiri', fontWeight: 'bold' }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar
                    name="المهارات"
                    dataKey="A"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fill="#c4b5fd"
                    fillOpacity={0.35}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Worlds table */}
        <div className="rounded-2xl bg-slate-900/85 border border-slate-700/60 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-slate-800 text-slate-100 border border-slate-600">
                <BookOpenCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h2 className="text-base font-['Amiri'] font-bold text-slate-50">تفاصيل العوالم</h2>
                <p className="text-xs text-slate-400">كل عالم مع درجة صعوبته وحالة تقدّم الطالب فيه.</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/40">
            <table className="w-full text-sm text-right">
              <thead className="bg-slate-900/80 text-slate-300 text-xs border-b border-slate-700/60">
                <tr>
                  <th className="py-3 px-4 font-medium">العالم</th>
                  <th className="py-3 px-4 font-medium">الدرجة</th>
                  <th className="py-3 px-4 font-medium">النجوم</th>
                  <th className="py-3 px-4 font-medium">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {worlds.map((w) => (
                  <tr key={w.id} className="border-t border-slate-800/80 hover:bg-slate-900/60 transition-colors">
                    <td className="py-3 px-4 align-middle">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-['Amiri'] font-semibold text-slate-50">{w.name}</span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                            difficultyColors[w.difficulty] ?? 'bg-slate-700/40 text-slate-100 border-slate-500/40'
                          }`}
                        >
                          {difficultyLabels[w.difficulty] ?? w.difficulty}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 align-middle text-slate-100">
                      <span>{w.stars * 33}</span>
                    </td>
                    <td className="py-3 px-4 align-middle">
                      <div className="flex items-center justify-end gap-1 text-yellow-400">
                        {Array(w.stars)
                          .fill(0)
                          .map((_, idx) => (
                            <Star key={idx} className="w-4 h-4 fill-yellow-400" />
                          ))}
                        {w.stars === 0 && (
                          <span className="text-[11px] text-slate-400">لم تُكتسب بعد</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 align-middle">
                      {w.stars > 0 ? (
                        <Badge variant="outline" className="bg-emerald-500/10 border-emerald-400/50 text-emerald-200 text-[11px]">
                          مكتمل جزئياً
                        </Badge>
                      ) : w.isUnlocked ? (
                        <Badge variant="outline" className="bg-sky-500/10 border-sky-400/50 text-sky-200 text-[11px]">
                          مفتوح ولم يُبدأ
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-800/80 border-slate-600 text-slate-300 text-[11px]">
                          مغلق
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
                {worlds.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-400 text-sm">
                      لا توجد بيانات عوالم بعد.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
