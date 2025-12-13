
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Link } from 'wouter';
import { ArrowRight, Volume2, VolumeX, Music, MicOff, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import frameBg from '@assets/generated_images/magical_control_panel_frame.png';
import libraryBg from '@assets/stock_images/magical_fantasy_libr_db93ec0f.jpg';

export default function Settings() {
  const { soundEnabled, toggleSound, musicEnabled, toggleMusic, playerStats } = useGame();
  const { toast } = useToast();

  const handleResetProgress = () => {
    localStorage.removeItem('kingdom_stats');
    localStorage.removeItem('kingdom_worlds');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Immersive Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${libraryBg})` }}
      >
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px]"></div>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full blur-[1px] z-10"
          initial={{ 
            x: Math.random() * window.innerWidth, 
            y: Math.random() * window.innerHeight,
            opacity: 0
          }}
          animate={{ 
            y: [null, Math.random() * -100],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: Math.random() * 5 + 3,
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}

      {/* Magical Frame Container */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, rotateX: 20 }}
        animate={{ scale: 1, opacity: 1, rotateX: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative z-20 w-full max-w-2xl min-h-[600px] flex items-center justify-center"
      >
        {/* The Frame Image acting as border */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
           {/* We scale the frame slightly to fit content nicely. 
               Since the frame image might be complex, we can also just use it as a border or use CSS if the image isn't fitting perfectly.
               For this "Masterpiece", we'll build a custom CSS glass panel that LOOKS like the frame if the image is tricky, 
               but let's try to use the image as a rich border.
           */}
           <img src={frameBg} alt="" className="w-full h-full object-contain opacity-90 drop-shadow-[0_0_50px_rgba(59,130,246,0.6)]" />
        </div>

        {/* Content Area */}
        <div className="relative z-10 w-[80%] h-[70%] bg-slate-900/50 backdrop-blur-xl rounded-[3rem] p-8 border border-white/10 shadow-[0_0_40px_rgba(56,189,248,0.25)] flex flex-col gap-6">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
             <div className="flex items-center gap-4">
               <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg border border-white/20">
                 <SettingsIcon className="w-8 h-8 text-white animate-spin-slow" />
               </div>
               <div>
                 <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-300 font-['Amiri'] drop-shadow-sm">
                   لوحة التحكم السحرية
                 </h1>
                 <p className="text-blue-200 text-sm">تخصيص تجربة اللعب</p>
               </div>
             </div>
             
             <Link href="/">
              <button className="group bg-white/5 hover:bg-white/10 p-3 rounded-full border border-white/10 transition-all hover:scale-110">
                <ArrowRight className="w-6 h-6 text-white group-hover:text-yellow-400" />
              </button>
             </Link>
          </div>

          {/* Player quick stats row */}
          <div className="grid grid-cols-3 gap-3 mt-2 text-center text-xs sm:text-sm">
            <Badge variant="outline" className="bg-slate-900/60 border-cyan-400/40 text-cyan-100 flex flex-col gap-1 py-2 rounded-2xl">
              <span className="text-[11px] opacity-80">المستوى</span>
              <span className="text-lg font-bold text-yellow-300">{playerStats.level}</span>
            </Badge>
            <Badge variant="outline" className="bg-slate-900/60 border-emerald-400/40 text-emerald-100 flex flex-col gap-1 py-2 rounded-2xl">
              <span className="text-[11px] opacity-80">مجموع النجوم</span>
              <span className="text-lg font-bold text-amber-300 flex items-center justify-center gap-1">
                {playerStats.stars}
              </span>
            </Badge>
            <Badge variant="outline" className="bg-slate-900/60 border-violet-400/40 text-violet-100 flex flex-col gap-1 py-2 rounded-2xl">
              <span className="text-[11px] opacity-80">النقاط الكلية</span>
              <span className="text-lg font-bold text-white">{playerStats.totalScore}</span>
            </Badge>
          </div>

          {/* Settings Grid */}
          <div className="grid gap-6 py-4">
            
            {/* Audio Controls */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900/50 to-slate-900/50 rounded-2xl border border-blue-500/30 group hover:border-blue-400/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${soundEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-700/50 text-slate-400'}`}>
                    {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                  </div>
                  <div>
                    <Label className="text-xl text-white font-['Amiri'] cursor-pointer">المؤثرات الصوتية</Label>
                    <p className="text-xs text-slate-400">أصوات التفاعل والنجاح</p>
                  </div>
                </div>
                <Switch checked={soundEnabled} onCheckedChange={toggleSound} className="data-[state=checked]:bg-green-500" />
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-900/50 to-slate-900/50 rounded-2xl border border-purple-500/30 group hover:border-purple-400/50 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${musicEnabled ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-700/50 text-slate-400'}`}>
                    {musicEnabled ? <Music className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                  </div>
                  <div>
                    <Label className="text-xl text-white font-['Amiri'] cursor-pointer">الموسيقى الساحرة</Label>
                    <p className="text-xs text-slate-400">موسيقى الخلفية الهادئة</p>
                  </div>
                </div>
                <Switch checked={musicEnabled} onCheckedChange={toggleMusic} className="data-[state=checked]:bg-purple-500" />
              </div>
            </div>

            {/* Difficulty Slider */}
            <div className="p-6 bg-gradient-to-b from-slate-800/50 to-slate-900/50 rounded-2xl border border-white/10">
               <div className="flex justify-between items-center mb-4">
                 <h2 className="text-lg font-bold text-yellow-100 flex items-center gap-2">
                   <Sparkles className="w-4 h-4 text-yellow-400" />
                   مستوى التحدي
                 </h2>
                 <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/30">
                   المستوى {playerStats.level}
                 </span>
               </div>
               <Slider defaultValue={[Math.min(playerStats.level * 10, 100)]} max={100} step={1} className="w-full" disabled />
               <p className="text-center text-xs text-slate-400 mt-3">
                 تزداد الصعوبة تلقائياً مع تقدمك في اللعبة
               </p>
            </div>

            {/* Danger Zone */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full py-6 rounded-xl bg-red-500/10 hover:bg-red-500/25 border border-red-500/60 text-red-200 hover:text-red-50 transition-all group shadow-[0_0_30px_rgba(239,68,68,0.35)]"
                >
                  <Trash2 className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="font-bold text-lg">بدء رحلة جديدة</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-950/95 border border-red-500/40 text-slate-50 backdrop-blur-2xl shadow-[0_0_60px_rgba(239,68,68,0.5)]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-red-100 font-['Amiri'] text-xl">
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                    تأكيد إعادة تعيين التقدم
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-300 text-sm leading-relaxed">
                    سيؤدي هذا إلى حذف جميع تقدم الطالب في العوالم والنجوم والنقاط، والبدء من الصفر.
                    لا يمكن التراجع عن هذه الخطوة.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row-reverse gap-3 sm:flex-row sm:justify-end">
                  <AlertDialogAction
                    className="bg-red-600/90 hover:bg-red-700 text-white border border-red-400/70 shadow-md px-6"
                    onClick={() => {
                      handleResetProgress();
                      toast({
                        title: 'تم إعادة تعيين التقدم',
                        description: 'تم حذف البيانات بنجاح، وجاهزون لبدء رحلة جديدة.',
                        className: 'bg-slate-950/95 border border-red-500/40 text-red-100',
                      });
                    }}
                  >
                    نعم، احذف كل شيء
                  </AlertDialogAction>
                  <AlertDialogCancel className="bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-100">
                    إلغاء
                  </AlertDialogCancel>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  // Custom Settings Icon using SVG path for gear
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
