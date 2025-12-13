
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Link } from 'wouter';
import { ArrowRight, Trophy, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import reportIcon from '@assets/generated_images/magical_report_scroll_icon.png';

export default function TeacherReports() {
  const { playerStats, worlds } = useGame();

  // Mock data for charts derived from real stats where possible
  const worldPerformance = worlds.map(w => ({
    name: w.name.split(' ')[1] || w.name, // Take second word for brevity
    score: w.stars * 33, // Approximate score based on stars
    attempts: w.isUnlocked ? Math.floor(Math.random() * 5) + 1 : 0
  })).filter(w => w.attempts > 0);

  const weeklyProgress = [
    { day: 'السبت', score: 20 },
    { day: 'الأحد', score: 45 },
    { day: 'الاثنين', score: 30 },
    { day: 'الثلاثاء', score: playerStats.totalScore > 50 ? 60 : playerStats.totalScore },
    { day: 'الأربعاء', score: playerStats.totalScore },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <button className="bg-slate-200 hover:bg-slate-300 p-2 rounded-full transition-colors">
              <ArrowRight className="w-6 h-6 text-slate-700" />
            </button>
          </Link>
          <div className="flex items-center gap-3">
             <img src={reportIcon} alt="Reports" className="w-12 h-12 object-contain drop-shadow-md" />
             <div>
               <h1 className="text-3xl font-bold text-slate-800 font-['Amiri']">تقرير المعلم</h1>
               <p className="text-slate-500">متابعة أداء الطالب: المستكشف الصغير</p>
             </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hidden md:block">
           <div className="text-sm text-slate-500">المستوى الحالي</div>
           <div className="text-2xl font-bold text-blue-600">{playerStats.level}</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Cards */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">إجمالي النقاط</CardTitle>
              <Trophy className="w-4 h-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{playerStats.totalScore}</div>
              <p className="text-xs text-green-500 mt-1">+12% عن الأسبوع الماضي</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">الدقة العامة</CardTitle>
              <TrendingUp className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <Progress value={85} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">العوالم المكتملة</CardTitle>
              <BookOpen className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{worlds.filter(w => w.stars > 0).length} / {worlds.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">نقاط التحسين</CardTitle>
              <AlertCircle className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-semibold text-slate-700">الهمزة المتوسطة</div>
              <p className="text-xs text-slate-400 mt-1">يحتاج إلى مزيد من التدريب</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="col-span-1 md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>الأداء في العوالم المختلفة</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={worldPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Bar dataKey="score" fill="#3B82F6" radius={[4, 4, 0, 0]} name="النتيجة" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="col-span-1">
           <Card className="h-full">
            <CardHeader>
              <CardTitle>التقدم الأسبوعي</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Detailed Breakdown */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="col-span-1 md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>تحليل المهارات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>الإملاء (الهمزات والتاءات)</span>
                    <span className="text-green-600">90%</span>
                  </div>
                  <Progress value={90} className="bg-green-100 text-green-600" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>القواعد وعلامات الترقيم</span>
                    <span className="text-yellow-600">75%</span>
                  </div>
                  <Progress value={75} className="bg-yellow-100 text-yellow-600" />
                </div>

                <div>
                  <div className="flex justify-between mb-2 text-sm font-medium">
                    <span>التفكير الإبداعي</span>
                    <span className="text-blue-600">85%</span>
                  </div>
                  <Progress value={85} className="bg-blue-100 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
