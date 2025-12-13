
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Play, Map, Trophy, Settings as SettingsIcon, FileText } from 'lucide-react';
import generatedBg from '@assets/generated_images/magical_game_background_with_floating_particles.png';
import gameLogo from '@assets/generated_images/golden_magical_castle_game_logo.png';

export default function WelcomeScreen() {
  const { playerStats } = useGame();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col items-center justify-center p-4"
         style={{ backgroundImage: `url(${generatedBg})` }}>
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[2px] z-0"></div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
        
        {/* Title Section */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col items-center"
        >
          <motion.img
            src={gameLogo}
            alt="Kingdom Logo"
            className="w-48 h-48 object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.6)] mb-6"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
          
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] font-['Amiri'] animate-shine leading-tight">
            مملكة الكلمات
            <br />
            <span className="text-3xl md:text-4xl text-yellow-300">والخيال</span>
          </h1>
          <p className="text-blue-100 mt-4 text-lg font-medium drop-shadow-md bg-black/20 px-4 py-1 rounded-full">
            رحلة تعليمية ساحرة لتقوية الإملاء والتفكير
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6 w-full flex justify-around items-center border-t-2 border-white/20"
        >
          <div className="text-center">
            <span className="block text-2xl font-bold text-yellow-400 font-mono">{playerStats.level}</span>
            <span className="text-xs text-blue-100 font-bold">المستوى</span>
          </div>
          <div className="h-10 w-[1px] bg-white/20"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-green-400 font-mono">{playerStats.totalScore}</span>
            <span className="text-xs text-blue-100 font-bold">النقاط</span>
          </div>
          <div className="h-10 w-[1px] bg-white/20"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-purple-400 font-mono">{playerStats.stars}</span>
            <span className="text-xs text-blue-100 font-bold">النجوم</span>
          </div>
        </motion.div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <Link href="/map">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full glass-button bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-4 rounded-xl text-xl shadow-xl flex items-center justify-center gap-3 border-none ring-4 ring-yellow-400/20"
            >
              <Play className="w-6 h-6 fill-current" />
              ابدأ المغامرة
            </motion.button>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/reports">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 bg-blue-600/30 hover:bg-blue-600/50"
                >
                <FileText className="w-5 h-5" />
                تقارير المعلم
                </motion.button>
            </Link>
            
            <Link href="/settings">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 w-full bg-slate-600/30 hover:bg-slate-600/50"
              >
                <SettingsIcon className="w-5 h-5" />
                الإعدادات
              </motion.button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
