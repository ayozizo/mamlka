
import { motion } from 'framer-motion';
import { useGame } from '@/lib/game-context';
import { World } from '@/lib/game-data';
import { Link, useLocation } from 'wouter';
import { Lock, Star, ChevronRight } from 'lucide-react';
import mapBg from '@assets/generated_images/fantasy_kingdom_game_map_with_5_regions.png';

// Icons
import valleyIcon from '@assets/generated_images/green_valley_game_icon.png';
import forestIcon from '@assets/generated_images/magical_forest_game_icon.png';
import mountainIcon from '@assets/generated_images/snowy_mountain_game_icon.png';
import lakeIcon from '@assets/generated_images/blue_lake_game_icon.png';
import palaceIcon from '@assets/generated_images/golden_cloud_palace_game_icon.png';

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

        {/* Node Image */}
        <div className={`
          relative w-20 h-20 md:w-28 md:h-28 transition-all duration-300
          ${world.isUnlocked ? 'filter-none drop-shadow-2xl' : 'grayscale opacity-70 blur-[1px]'}
        `}>
          <img 
            src={getIconImage(world.icon)} 
            alt={world.name} 
            className="w-full h-full object-contain" 
          />
          
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

function getIconImage(iconType: string) {
  switch (iconType) {
    case 'valley': return valleyIcon;
    case 'forest': return forestIcon;
    case 'mountain': return mountainIcon;
    case 'lake': return lakeIcon;
    case 'palace': return palaceIcon;
    default: return valleyIcon;
  }
}
