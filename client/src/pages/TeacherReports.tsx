
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Link } from 'wouter';
import { ArrowRight, Star, TrendingUp, Trophy } from 'lucide-react';
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
import bookBg from '@assets/generated_images/ornate_magical_book_open_double_page.png';
import quillIcon from '@assets/generated_images/magical_quill_pen_icon.png';
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

  return (
    <div className="min-h-screen flex items-center justify-center p-2 relative overflow-hidden bg-slate-900">
       {/* Background */}
       <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${libraryBg})` }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-30">
        <Link href="/">
          <button className="glass-button p-3 rounded-full text-white bg-black/40 hover:bg-black/60 transition-all border border-white/20">
            <ArrowRight className="w-6 h-6" />
          </button>
        </Link>
      </div>

      {/* The Magical Book Container */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1, type: "spring" }}
        className="relative z-10 w-full max-w-6xl aspect-[1.4/1] md:aspect-[1.6/1]"
      >
        {/* Book Image */}
        <img src={bookBg} alt="Magical Book" className="absolute inset-0 w-full h-full object-contain pointer-events-none drop-shadow-2xl" />

        {/* Content Layer - Grid for Left and Right Pages */}
        <div className="absolute inset-0 grid grid-cols-2 pt-[10%] pb-[10%] px-[12%] gap-12">
           
           {/* RIGHT PAGE (Arabic Right) - Student Profile & Summary */}
           <div className="relative p-4 flex flex-col items-center text-center transform rotate-1 md:rotate-0">
              <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-6 font-['Amiri'] drop-shadow-sm">
                سجل المستكشف
              </h2>
              
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full border-4 border-amber-800/30 shadow-inner flex items-center justify-center mb-4">
                 <Trophy className="w-12 h-12 text-amber-700" />
              </div>

              <div className="w-full space-y-4 px-4">
                <div className="flex justify-between items-center border-b border-amber-900/10 pb-2">
                  <span className="text-amber-800 font-bold font-['Amiri'] text-xl">المستوى الحالي</span>
                  <span className="text-2xl font-bold text-amber-900">{playerStats.level}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-amber-900/10 pb-2">
                  <span className="text-amber-800 font-bold font-['Amiri'] text-xl">مجموع النجوم</span>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold text-amber-900">{playerStats.stars}</span>
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  </div>
                </div>

                <div className="flex justify-between items-center border-b border-amber-900/10 pb-2">
                  <span className="text-amber-800 font-bold font-['Amiri'] text-xl">النقاط الكلية</span>
                  <span className="text-2xl font-bold text-amber-900">{playerStats.totalScore}</span>
                </div>
              </div>

              {/* Radar Chart for Skills */}
              <div className="flex-1 w-full min-h-[150px] mt-4 relative">
                <h3 className="text-lg font-bold text-amber-800 mb-2 font-['Amiri']">خريطة المهارات</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                    <PolarGrid stroke="#b45309" strokeOpacity={0.2} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#78350f', fontSize: 12, fontFamily: 'Amiri', fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="المهارات"
                      dataKey="A"
                      stroke="#d97706"
                      strokeWidth={2}
                      fill="#f59e0b"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* LEFT PAGE (Arabic Left) - Detailed Stats */}
           <div className="relative p-4 flex flex-col transform -rotate-1 md:rotate-0">
              <h2 className="text-2xl md:text-3xl font-bold text-amber-900 mb-6 text-center font-['Amiri']">
                أداء العوالم
              </h2>

              <div className="flex-1 w-full min-h-[200px] mb-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={worldData} layout="vertical" margin={{ left: 20, right: 20 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={80} tick={{ fill: '#78350f', fontSize: 14, fontFamily: 'Amiri', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                      <Tooltip 
                        cursor={{fill: 'rgba(217, 119, 6, 0.1)'}}
                        contentStyle={{ backgroundColor: '#fffbeb', borderRadius: '8px', border: '1px solid #d97706', color: '#78350f' }}
                      />
                      <Bar dataKey="score" fill="url(#colorGradient)" radius={[0, 10, 10, 0] as [number, number, number, number]} barSize={20} background={{ fill: '#eee' }} />
                      <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#d97706" />
                          <stop offset="100%" stopColor="#fbbf24" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                 </ResponsiveContainer>
              </div>

              {/* Feedback Section */}
              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-900/10 mt-auto relative">
                 <div className="absolute -top-6 -right-6 w-16 h-16 animate-bounce">
                    <img src={quillIcon} alt="Quill" className="w-full h-full object-contain drop-shadow-md" />
                 </div>
                 <h3 className="text-lg font-bold text-amber-800 mb-2 font-['Amiri'] flex items-center gap-2">
                   <TrendingUp className="w-5 h-5" />
                   ملاحظات المعلم السحري
                 </h3>
                 <p className="text-amber-900/80 text-sm leading-relaxed font-medium">
                   "أداء ممتاز في الهمزات! يحتاج المستكشف الصغير إلى مزيد من التركيز في علامات الترقيم. استمر في التدريب يا بطل!"
                 </p>
              </div>
           </div>

        </div>
      </motion.div>
    </div>
  );
}
