
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Play, Map, Trophy, Settings } from 'lucide-react';
import generatedBg from '@assets/generated_images/magical_game_background_with_floating_particles.png';

export default function WelcomeScreen() {
  const { playerStats } = useGame();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-cover bg-center flex flex-col items-center justify-center p-4"
         style={{ backgroundImage: `url(${generatedBg})` }}>
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
        
        {/* Title Section */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="mb-4 inline-block text-6xl"
          >
            🏰
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] font-['Amiri'] animate-shine leading-tight">
            مملكة الكلمات
            <br />
            <span className="text-3xl md:text-4xl text-yellow-300">والخيال</span>
          </h1>
          <p className="text-blue-100 mt-4 text-lg font-medium drop-shadow-md">
            رحلة تعليمية ساحرة لتقوية الإملاء والتفكير
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6 w-full flex justify-around items-center"
        >
          <div className="text-center">
            <span className="block text-2xl font-bold text-yellow-400">{playerStats.level}</span>
            <span className="text-xs text-blue-100">المستوى</span>
          </div>
          <div className="h-10 w-[1px] bg-white/20"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-green-400">{playerStats.totalScore}</span>
            <span className="text-xs text-blue-100">النقاط</span>
          </div>
          <div className="h-10 w-[1px] bg-white/20"></div>
          <div className="text-center">
            <span className="block text-2xl font-bold text-purple-400">{playerStats.stars}</span>
            <span className="text-xs text-blue-100">النجوم</span>
          </div>
        </motion.div>

        {/* Menu Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <Link href="/map">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full glass-button bg-gradient-to-r from-yellow-500/80 to-orange-500/80 hover:from-yellow-400 hover:to-orange-400 text-white font-bold py-4 rounded-xl text-xl shadow-lg flex items-center justify-center gap-3 border-none ring-2 ring-yellow-300/50"
            >
              <Play className="w-6 h-6 fill-current" />
              ابدأ المغامرة
            </motion.button>
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/map">
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
                >
                <Map className="w-5 h-5" />
                الخريطة
                </motion.button>
            </Link>
            <button className="glass-button text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
              <Trophy className="w-5 h-5" />
              قاعة الشرف
            </button>
          </div>
          
          <button className="glass-button text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2">
            <Settings className="w-5 h-5" />
            الإعدادات
          </button>
        </div>

      </div>
    </div>
  );
}
