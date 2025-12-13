
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Link } from 'wouter';
import { ArrowRight, Volume2, VolumeX, Music, MicOff, Trash2, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import settingsIcon from '@assets/generated_images/magical_settings_gear_icon.png';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { soundEnabled, toggleSound, musicEnabled, toggleMusic, playerStats } = useGame();
  const { toast } = useToast();

  const handleResetProgress = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات والبدء من جديد؟')) {
      localStorage.removeItem('kingdom_stats');
      localStorage.removeItem('kingdom_worlds');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex items-center gap-4 mb-8">
           <Link href="/">
            <button className="bg-white/10 hover:bg-white/20 p-2 rounded-full text-white transition-colors">
              <ArrowRight className="w-6 h-6" />
            </button>
           </Link>
           <div className="flex items-center gap-3">
             <img src={settingsIcon} alt="Settings" className="w-10 h-10 object-contain drop-shadow-lg" />
             <h1 className="text-3xl font-bold text-white font-['Amiri']">الإعدادات</h1>
           </div>
        </div>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <h2 className="text-xl font-bold text-yellow-400 mb-4 font-['Amiri']">الصوت والموسيقى</h2>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 text-white">
                {soundEnabled ? <Volume2 className="w-5 h-5 text-green-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                <Label htmlFor="sound-mode" className="text-lg cursor-pointer">المؤثرات الصوتية</Label>
              </div>
              <Switch id="sound-mode" checked={soundEnabled} onCheckedChange={toggleSound} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-white">
                {musicEnabled ? <Music className="w-5 h-5 text-purple-400" /> : <MicOff className="w-5 h-5 text-slate-400" />}
                <Label htmlFor="music-mode" className="text-lg cursor-pointer">موسيقى الخلفية</Label>
              </div>
              <Switch id="music-mode" checked={musicEnabled} onCheckedChange={toggleMusic} />
            </div>
          </div>

          {/* Difficulty (Mock) */}
          <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
             <h2 className="text-xl font-bold text-blue-400 mb-4 font-['Amiri']">مستوى الصعوبة</h2>
             <div className="space-y-4">
               <div className="flex justify-between text-slate-300 text-sm">
                 <span>مبتدئ</span>
                 <span>خبير</span>
               </div>
               <Slider defaultValue={[33]} max={100} step={33} className="w-full" />
               <p className="text-xs text-slate-400 text-center">يتم ضبط الصعوبة تلقائياً بناءً على مستواك الحالي: {playerStats.level}</p>
             </div>
          </div>

          {/* Data Management */}
          <div className="bg-red-900/20 rounded-xl p-5 border border-red-900/50">
            <h2 className="text-xl font-bold text-red-400 mb-4 font-['Amiri']">منطقة الخطر</h2>
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleResetProgress}
            >
              <Trash2 className="w-4 h-4" />
              حذف التقدم والبدء من جديد
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center text-slate-400 text-sm">
          الإصدار 2.0.0 - نسخة الخيال
        </div>

      </motion.div>
    </div>
  );
}
