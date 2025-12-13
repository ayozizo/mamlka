
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Play, Map, Trophy, Settings as SettingsIcon, FileText } from 'lucide-react';
import { Howl } from 'howler';

export default function WelcomeScreen() {
  const { playerStats, musicEnabled } = useGame();
  const backgroundMusicRef = useRef<Howl | null>(null);

  // Background music for welcome screen
  useEffect(() => {
    if (musicEnabled) {
      console.log('Playing welcome screen background music');
      
      try {
        if (!backgroundMusicRef.current) {
          backgroundMusicRef.current = new Howl({
            src: ['/music/background.mp3'],
            loop: true,
            volume: 0.2,
            preload: true,
            html5: true,
            onload: () => console.log('Welcome screen music loaded'),
            onloaderror: (id: number, error: any) => {
              console.error('Welcome screen music load error:', error);
              playFallbackMusic();
            },
            onplayerror: (id: number, error: any) => {
              console.error('Welcome screen music play error:', error);
              playFallbackMusic();
            }
          });
        }
        backgroundMusicRef.current.play();
      } catch (error) {
        console.error('Welcome screen music failed:', error);
        playFallbackMusic();
      }
    } else if (backgroundMusicRef.current) {
      try {
        backgroundMusicRef.current.stop();
        backgroundMusicRef.current = null;
      } catch (e) {}
    }

    function playFallbackMusic() {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 200; // Welcome frequency
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        oscillator.start();
        
        const stopMusic = () => {
          try {
            oscillator.stop();
            gainNode.disconnect();
            oscillator.disconnect();
          } catch (e) {}
        };
        
        backgroundMusicRef.current = { stop: stopMusic } as any;
        console.log('Welcome screen fallback music started');
      } catch (error) {
        console.error('Welcome screen fallback music failed:', error);
      }
    }

    return () => {
      if (backgroundMusicRef.current) {
        try {
          if (backgroundMusicRef.current && typeof (backgroundMusicRef.current as any).stop === 'function') {
            (backgroundMusicRef.current as any).stop();
          } else if (backgroundMusicRef.current && 'stop' in backgroundMusicRef.current) {
            backgroundMusicRef.current.stop();
          }
        } catch (e) {}
      }
    };
  }, [musicEnabled]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      
      {/* Magical background effects */}
      <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-[2px] z-0"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
        
        {/* Title Section */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center flex flex-col items-center"
        >
          {/* Logo with CSS styling instead of image */}
          <motion.div
            className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(251,191,36,0.6)]"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <div className="text-white text-6xl font-bold">م</div>
          </motion.div>
          
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
