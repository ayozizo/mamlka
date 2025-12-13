
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { useGame } from '@/lib/game-context';
import { World } from '@/lib/game-data';
import { Link, useLocation } from 'wouter';
import { Lock, Star, ChevronRight } from 'lucide-react';
import { Howl } from 'howler';

export default function WorldMap() {
  const { worlds, musicEnabled } = useGame();
  const [, setLocation] = useLocation();
  const backgroundMusicRef = useRef<Howl | null>(null);

  // Background music for world map
  useEffect(() => {
    if (musicEnabled) {
      console.log('Playing world map background music');
      
      try {
        if (!backgroundMusicRef.current) {
          backgroundMusicRef.current = new Howl({
            src: ['/music/background.mp3'],
            loop: true,
            volume: 0.15,
            preload: true,
            html5: true,
            onload: () => console.log('World map music loaded'),
            onloaderror: (id: number, error: any) => {
              console.error('World map music load error:', error);
              playFallbackMusic();
            },
            onplayerror: (id: number, error: any) => {
              console.error('World map music play error:', error);
              playFallbackMusic();
            }
          });
        }
        backgroundMusicRef.current.play();
      } catch (error) {
        console.error('World map music failed:', error);
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
        
        oscillator.frequency.value = 180; // Lower frequency for map
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
        
        oscillator.start();
        
        const stopMusic = () => {
          try {
            oscillator.stop();
            gainNode.disconnect();
            oscillator.disconnect();
          } catch (e) {}
        };
        
        backgroundMusicRef.current = { stop: stopMusic } as any;
        console.log('World map fallback music started');
      } catch (error) {
        console.error('World map fallback music failed:', error);
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
    <div className="relative min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Magical Map Background */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-800/30 via-purple-800/30 to-indigo-800/30"></div>
        
        {/* Magical regions */}
        <div className="absolute top-10 left-10 w-40 h-40 bg-green-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/4 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-2/3 right-1/3 w-28 h-28 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 right-10 w-44 h-44 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1500"></div>
        
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Back Button */}
      <div className="absolute top-4 right-4 z-20">
        <Link href="/">
          <button className="glass-button p-3 rounded-full text-white hover:bg-white/20">
            <ChevronRight className="w-6 h-6" />
          </button>
        </Link>
      </div>

      {/* World Nodes */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {worlds.map((world, index) => (
          <WorldNode key={world.id} world={world} index={index} />
        ))}
      </div>

      {/* Connection Lines (Optional visual enhancement using SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0 drop-shadow-md">
        <path d="M 20% 75% Q 35% 65% 50% 60% T 75% 30%" fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 8" className="animate-pulse" />
        <path d="M 50% 60% Q 65% 65% 80% 65%" fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 8" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        <path d="M 75% 30% Q 60% 20% 50% 15%" fill="none" stroke="white" strokeWidth="3" strokeDasharray="8 8" className="animate-pulse" style={{ animationDelay: '1s' }} />
      </svg>
    </div>
  );
}

function WorldNode({ world, index }: { world: World; index: number }) {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
      style={{ top: world.position.top, left: world.position.left }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.2, type: "spring" }}
      whileHover={{ scale: 1.15 }}
      onClick={() => {
        if (world.isUnlocked) {
          setLocation(`/level/${world.id}`);
        }
      }}
    >
      <div className="relative group flex flex-col items-center">
        {/* Glow effect for unlocked worlds */}
        {world.isUnlocked && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/40 rounded-full blur-xl animate-pulse -z-10"></div>
        )}

        {/* Node Icon - CSS based */}
        <div className={`
          relative w-20 h-20 md:w-28 md:h-28 transition-all duration-300
          ${world.isUnlocked ? 'filter-none drop-shadow-2xl' : 'grayscale opacity-70 blur-[1px]'}
        `}>
          <div className={`
            w-full h-full rounded-full flex items-center justify-center text-3xl font-bold
            ${getIconColor(world.icon)} ${getIconBgColor(world.icon)}
          `}>
            {getIconEmoji(world.icon)}
          </div>
          
          {!world.isUnlocked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 p-2 rounded-full">
                <Lock className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Stars Badge */}
        {world.isUnlocked && (
          <div className="absolute -bottom-2 flex gap-0.5 bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm border border-white/10 shadow-lg z-20">
            {[...Array(3)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 md:w-4 md:h-4 ${i < world.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500 fill-slate-500'}`} 
              />
            ))}
          </div>
        )}

        {/* Tooltip Label */}
        <div className="absolute top-full mt-2 whitespace-nowrap z-20">
          <motion.div 
            className={`
              px-3 py-1.5 rounded-lg text-sm md:text-base font-bold shadow-xl border border-white/10
              ${world.isUnlocked 
                ? 'bg-white/90 text-indigo-900 backdrop-blur-md' 
                : 'bg-slate-800/90 text-slate-400 backdrop-blur-md'}
            `}
            initial={{ y: 5, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
          >
            {world.name}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

function getIconColor(iconType: string) {
  switch (iconType) {
    case 'valley': return 'text-green-600';
    case 'forest': return 'text-emerald-600';
    case 'mountain': return 'text-blue-600';
    case 'lake': return 'text-cyan-600';
    case 'palace': return 'text-yellow-600';
    default: return 'text-green-600';
  }
}

function getIconBgColor(iconType: string) {
  switch (iconType) {
    case 'valley': return 'bg-green-100';
    case 'forest': return 'bg-emerald-100';
    case 'mountain': return 'bg-blue-100';
    case 'lake': return 'bg-cyan-100';
    case 'palace': return 'bg-yellow-100';
    default: return 'bg-green-100';
  }
}

function getIconEmoji(iconType: string) {
  switch (iconType) {
    case 'valley': return '🌿';
    case 'forest': return '🌲';
    case 'mountain': return '🏔️';
    case 'lake': return '💧';
    case 'palace': return '🏰';
    default: return '🌿';
  }
}
