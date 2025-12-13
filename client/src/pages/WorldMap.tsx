
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { World } from '@/lib/game-data';
import { Link, useLocation } from 'wouter';
import { Lock, Star, Play, ChevronRight } from 'lucide-react';
import mapBg from '@assets/generated_images/fantasy_kingdom_game_map_with_5_regions.png';

export default function WorldMap() {
  const { worlds } = useGame();
  const [, setLocation] = useLocation();

  return (
    <div className="relative min-h-screen w-full bg-slate-900 overflow-hidden">
      {/* Map Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center md:bg-contain bg-no-repeat transform scale-125 md:scale-100 origin-center transition-transform duration-1000"
        style={{ backgroundImage: `url(${mapBg})` }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
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
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-0">
        <path d="M 20% 75% Q 35% 65% 50% 60% T 75% 30%" fill="none" stroke="white" strokeWidth="4" strokeDasharray="10 10" />
        <path d="M 50% 60% Q 65% 65% 80% 65%" fill="none" stroke="white" strokeWidth="4" strokeDasharray="10 10" />
        <path d="M 75% 30% Q 60% 20% 50% 15%" fill="none" stroke="white" strokeWidth="4" strokeDasharray="10 10" />
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
      whileHover={{ scale: 1.1 }}
      onClick={() => {
        if (world.isUnlocked) {
          setLocation(`/level/${world.id}`);
        }
      }}
    >
      <div className="relative group">
        {/* Glow effect for unlocked worlds */}
        {world.isUnlocked && (
          <div className="absolute -inset-4 bg-yellow-400/30 rounded-full blur-xl animate-pulse"></div>
        )}

        {/* Node Circle */}
        <div className={`
          w-16 h-16 md:w-24 md:h-24 rounded-full flex items-center justify-center border-4 shadow-xl transition-colors
          ${world.isUnlocked 
            ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-white text-white' 
            : 'bg-slate-700 border-slate-500 text-slate-400 grayscale'}
        `}>
          {world.isUnlocked ? (
            <div className="text-2xl md:text-4xl filter drop-shadow-md">
              {getIconForWorld(world.icon)}
            </div>
          ) : (
            <Lock className="w-6 h-6 md:w-8 md:h-8" />
          )}
        </div>

        {/* Stars Badge */}
        {world.isUnlocked && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-0.5 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {[...Array(3)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3 h-3 md:w-4 md:h-4 ${i < world.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} 
              />
            ))}
          </div>
        )}

        {/* Tooltip Label */}
        <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-20">
          <motion.div 
            className={`
              px-3 py-1.5 rounded-lg text-sm md:text-base font-bold shadow-lg
              ${world.isUnlocked ? 'bg-white text-indigo-900' : 'bg-slate-800 text-slate-400'}
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

function getIconForWorld(iconType: string) {
  switch (iconType) {
    case 'valley': return '🏞️';
    case 'forest': return '🌲';
    case 'mountain': return '🏔️';
    case 'lake': return '💧';
    case 'palace': return '🏰';
    default: return '📍';
  }
}
