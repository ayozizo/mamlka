
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { World, WORLDS } from './game-data';
import { useToast } from '@/hooks/use-toast';

interface PlayerStats {
  level: number;
  xp: number;
  totalScore: number;
  stars: number;
}

interface GameState {
  playerStats: PlayerStats;
  worlds: World[];
  currentWorldId: string | null;
  completedLevels: string[];
  soundEnabled: boolean;
  musicEnabled: boolean;
  unlockWorld: (worldId: string) => void;
  completeLevel: (worldId: string, score: number, stars: number) => void;
  setCurrentWorld: (worldId: string | null) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  addXp: (amount: number) => void;
}

const GameContext = createContext<GameState | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [playerStats, setPlayerStats] = useState<PlayerStats>(() => {
    const saved = localStorage.getItem('kingdom_stats');
    return saved ? JSON.parse(saved) : { level: 1, xp: 0, totalScore: 0, stars: 0 };
  });

  const [worlds, setWorlds] = useState<World[]>(() => {
    const saved = localStorage.getItem('kingdom_worlds');
    return saved ? JSON.parse(saved) : WORLDS;
  });

  const [currentWorldId, setCurrentWorld] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('kingdom_stats', JSON.stringify(playerStats));
  }, [playerStats]);

  useEffect(() => {
    localStorage.setItem('kingdom_worlds', JSON.stringify(worlds));
  }, [worlds]);

  const unlockWorld = (worldId: string) => {
    setWorlds(prev => prev.map(w => w.id === worldId ? { ...w, isUnlocked: true } : w));
    toast({
      title: "عالم جديد مفتوح!",
      description: `لقد قمت بفتح ${worlds.find(w => w.id === worldId)?.name}`,
      variant: "default",
    });
  };

  const addXp = (amount: number) => {
    setPlayerStats(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      if (newLevel > prev.level) {
        toast({
          title: "مستوى جديد!",
          description: `مبروك! وصلت للمستوى ${newLevel}`,
          className: "bg-yellow-500 text-white border-none"
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalScore: prev.totalScore + amount
      };
    });
  };

  const completeLevel = (worldId: string, score: number, stars: number) => {
    // Update world stats
    setWorlds(prev => {
      const newWorlds = prev.map(w => {
        if (w.id === worldId) {
          return { ...w, stars: Math.max(w.stars, stars) };
        }
        return w;
      });

      // Check if we should unlock the next world
      const currentIndex = newWorlds.findIndex(w => w.id === worldId);
      if (currentIndex !== -1 && currentIndex < newWorlds.length - 1) {
        if (stars >= 2) { // Require 2 stars to unlock next
             newWorlds[currentIndex + 1].isUnlocked = true;
        }
      }
      return newWorlds;
    });

    addXp(score);
    
    setPlayerStats(prev => ({
      ...prev,
      stars: prev.stars + stars
    }));
  };

  const toggleSound = () => setSoundEnabled(prev => !prev);
  const toggleMusic = () => setMusicEnabled(prev => !prev);

  return (
    <GameContext.Provider value={{
      playerStats,
      worlds,
      currentWorldId,
      completedLevels: worlds.filter(w => w.stars > 0).map(w => w.id),
      soundEnabled,
      musicEnabled,
      unlockWorld,
      completeLevel,
      setCurrentWorld,
      toggleSound,
      toggleMusic,
      addXp
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
