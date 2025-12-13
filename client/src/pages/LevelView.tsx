
import { useState, useEffect } from 'react';
import { useGame } from '@/lib/game-context';
import { WORLDS, Question } from '@/lib/game-data';
import { useLocation, useRoute } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, Star, Trophy, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

export default function LevelView() {
  const [, params] = useRoute('/level/:id');
  const { worlds, completeLevel } = useGame();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const worldId = params?.id;
  const world = worlds.find(w => w.id === worldId) || WORLDS.find(w => w.id === worldId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);

  useEffect(() => {
    if (!world) {
      setLocation('/map');
    }
  }, [world, setLocation]);

  if (!world) return null;

  const currentQuestion = world.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / world.questions.length) * 100;

  const handleAnswer = (index: number) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setSelectedOption(index);
    const correct = index === currentQuestion.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      setScore(s => s + 10);
      if (Math.random() > 0.7) triggerConfetti();
    } else {
      toast({
        title: "حاول مرة أخرى!",
        description: currentQuestion.hint,
        variant: "destructive",
      });
    }

    // Auto advance after delay
    setTimeout(() => {
      if (currentQuestionIndex < world.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(null);
        setShowHint(false);
      } else {
        finishLevel();
      }
    }, 2000);
  };

  const finishLevel = () => {
    setLevelComplete(true);
    triggerBigConfetti();
    
    // Calculate stars
    const percentage = score / (world.questions.length * 10);
    let stars = 1;
    if (percentage > 0.6) stars = 2;
    if (percentage > 0.9) stars = 3;

    completeLevel(world.id, score, stars);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FBBF24', '#3B82F6', '#10B981']
    });
  };

  const triggerBigConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FBBF24', '#3B82F6']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FBBF24', '#EF4444']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (levelComplete) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
          
          <div className="mb-6 flex justify-center">
             <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-5xl animate-bounce">
                🏆
             </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-2 font-['Amiri']">أحسنت يا بطل!</h2>
          <p className="text-slate-600 mb-6">أتممت {world.name} بنجاح</p>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3].map((star) => {
               const earned = (score / (world.questions.length * 10)) >= (star === 1 ? 0 : star === 2 ? 0.6 : 0.9);
               return (
                <motion.div
                  key={star}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: star * 0.2 }}
                >
                  <Star 
                    className={`w-12 h-12 ${earned ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200 fill-slate-200'}`} 
                  />
                </motion.div>
               );
            })}
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-8">
            <div className="flex justify-between text-sm text-slate-500 mb-1">
              <span>النقاط</span>
              <span>{score}</span>
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>الإجابات الصحيحة</span>
              <span>{Math.round((score / 10))} / {world.questions.length}</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setLocation('/map')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors"
            >
              الخريطة
            </button>
            <button 
              onClick={() => {
                 // Logic to go to next level or replay
                 setLocation('/map');
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-95"
            >
              التالي
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px]"></div>

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 relative z-10">
        <button 
          onClick={() => setLocation('/map')}
          className="bg-white/10 hover:bg-white/20 p-3 rounded-full text-white backdrop-blur-sm transition-colors"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
        
        <div className="flex-1 mx-4">
          <div className="flex justify-between text-white/80 text-sm mb-2">
            <span>السؤال {currentQuestionIndex + 1} من {world.questions.length}</span>
            <span>{score} نقطة</span>
          </div>
          <Progress value={progress} className="h-3 bg-white/10" />
        </div>

        <div className="bg-yellow-500/20 px-4 py-2 rounded-full flex items-center gap-2 border border-yellow-500/50">
           <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
           <span className="text-yellow-100 font-bold">{world.difficulty}</span>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Type Badge */}
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-bold text-sm">
              {currentQuestion.type === 'spelling' ? 'إملاء' : currentQuestion.type === 'grammar' ? 'قواعد' : 'إبداع'}
            </div>

            <div className="mt-6 mb-8 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed font-['Amiri']">
                {currentQuestion.text}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selectedOption !== null}
                  className={`
                    relative p-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-[1.02] border-2
                    ${selectedOption === idx 
                      ? isCorrect 
                        ? 'bg-green-100 border-green-500 text-green-800' 
                        : 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                    }
                  `}
                >
                  {option}
                  {selectedOption === idx && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Hint Section */}
            <div className="mt-8 flex justify-center">
              {!showHint && selectedOption === null && (
                <button 
                  onClick={() => setShowHint(true)}
                  className="text-slate-400 hover:text-yellow-600 flex items-center gap-2 text-sm transition-colors"
                >
                  <Lightbulb className="w-4 h-4" />
                  أحتاج مساعدة
                </button>
              )}
              
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm border border-yellow-200 flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  {currentQuestion.hint}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
