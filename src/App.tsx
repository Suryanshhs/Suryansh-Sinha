import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Play, RefreshCw, Timer, User, Check, Eye, EyeOff } from 'lucide-react';
import { CATEGORIES, Category } from './constants';

type GameState = 'SETUP' | 'PASSING' | 'REVEAL' | 'GAME';

interface Player {
  id: string;
  name: string;
  isImposter: boolean;
}

export default function App() {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Animals');
  const [secretWord, setSecretWord] = useState('');
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isWordVisible, setIsWordVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft]);

  const addPlayer = () => {
    if (newPlayerName.trim()) {
      setPlayers([...players, { id: Math.random().toString(36).substr(2, 9), name: newPlayerName.trim(), isImposter: false }]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (id: string) => {
    setPlayers(players.filter(p => p.id !== id));
  };

  const startGameSetup = () => {
    if (players.length < 3) {
      alert("You need at least 3 players to play!");
      return;
    }

    // Assign roles
    const imposterIndex = Math.floor(Math.random() * players.length);
    const updatedPlayers = players.map((p, i) => ({
      ...p,
      isImposter: i === imposterIndex
    }));
    
    // Pick word
    const words = CATEGORIES[selectedCategory];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    setPlayers(updatedPlayers);
    setSecretWord(randomWord);
    setCurrentPlayerIndex(0);
    setGameState('PASSING');
    setIsWordVisible(false);
  };

  const handleNextPlayer = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setGameState('PASSING');
      setIsWordVisible(false);
    } else {
      setGameState('GAME');
      setIsTimerRunning(true);
    }
  };

  const resetGame = () => {
    setGameState('SETUP');
    setTimeLeft(300);
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500/30 overflow-hidden">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-md mx-auto px-6 py-12 min-h-screen flex flex-col">
        <AnimatePresence mode="wait">
          {gameState === 'SETUP' && (
            <motion.div
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              <div className="mb-8 text-center">
                <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-br from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                  IMPOSTER SURYEA
                </h1>
                <p className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">The Ultimate Deception Game</p>
              </div>

              <div className="space-y-6 flex-1">
                {/* Category Selection */}
                <section>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Select Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(Object.keys(CATEGORIES) as Category[]).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                          selectedCategory === cat
                            ? 'bg-purple-600 border-purple-400 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
                            : 'bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Player List */}
                <section className="flex-1 flex flex-col">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Players ({players.length})</label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                      placeholder="Enter name..."
                      className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button
                      onClick={addPlayer}
                      className="bg-purple-600 p-3 rounded-xl hover:bg-purple-500 transition-colors shadow-lg"
                    >
                      <Plus size={24} />
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {players.map((player) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        key={player.id}
                        className="flex items-center justify-between bg-zinc-900/30 border border-zinc-800/50 p-3 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold">
                            {player.name[0].toUpperCase()}
                          </div>
                          <span className="font-medium">{player.name}</span>
                        </div>
                        <button
                          onClick={() => removePlayer(player.id)}
                          className="text-zinc-600 hover:text-red-400 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </motion.div>
                    ))}
                    {players.length === 0 && (
                      <div className="text-center py-8 text-zinc-600 italic text-sm">
                        Add at least 3 players to start
                      </div>
                    )}
                  </div>
                </section>
              </div>

              <button
                onClick={startGameSetup}
                disabled={players.length < 3}
                className={`mt-8 w-full py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-2 transition-all ${
                  players.length >= 3
                    ? 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_30px_rgba(147,51,234,0.4)]'
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                }`}
              >
                <Play size={20} fill="currentColor" />
                START GAME
              </button>
            </motion.div>
          )}

          {gameState === 'PASSING' && (
            <motion.div
              key="passing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mb-8 animate-pulse">
                <User size={48} className="text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-400 mb-2 uppercase tracking-tighter">Pass the phone to</h2>
              <h1 className="text-5xl font-black text-white mb-12 tracking-tight">
                {players[currentPlayerIndex].name}
              </h1>
              <button
                onClick={() => setGameState('REVEAL')}
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-xl hover:bg-zinc-200 transition-all shadow-xl"
              >
                SHOW WORD
              </button>
            </motion.div>
          )}

          {gameState === 'REVEAL' && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <div className="mb-12">
                <p className="text-zinc-500 font-bold uppercase tracking-widest mb-4">Your Secret Identity</p>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-purple-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`p-8 rounded-3xl border-2 transition-all duration-500 ${
                    isWordVisible 
                      ? 'bg-zinc-900 border-purple-500 shadow-[0_0_40px_rgba(147,51,234,0.2)]' 
                      : 'bg-zinc-900/50 border-zinc-800'
                  }`}>
                    {isWordVisible ? (
                      <div className="space-y-4">
                        {players[currentPlayerIndex].isImposter ? (
                          <div className="space-y-2">
                            <h3 className="text-red-500 text-xl font-black italic uppercase tracking-tighter">Warning</h3>
                            <h2 className="text-4xl font-black text-white">YOU ARE THE IMPOSTER</h2>
                            <p className="text-zinc-400 text-sm">Blend in and don't get caught!</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <h3 className="text-purple-400 text-xl font-black italic uppercase tracking-tighter">The Word is</h3>
                            <h2 className="text-5xl font-black text-white tracking-tight">{secretWord}</h2>
                            <p className="text-zinc-400 text-sm">Describe it without being too obvious.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-12 px-8 flex flex-col items-center gap-4">
                        <EyeOff size={48} className="text-zinc-700" />
                        <p className="text-zinc-600 font-medium">Click below to reveal</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!isWordVisible ? (
                <button
                  onClick={() => setIsWordVisible(true)}
                  className="w-full py-5 bg-purple-600 text-white rounded-2xl font-black text-xl hover:bg-purple-500 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Eye size={24} />
                  REVEAL IDENTITY
                </button>
              ) : (
                <button
                  onClick={handleNextPlayer}
                  className="w-full py-5 bg-zinc-100 text-black rounded-2xl font-black text-xl hover:bg-white transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Check size={24} />
                  I'VE SEEN IT
                </button>
              )}
            </motion.div>
          )}

          {gameState === 'GAME' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col"
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl font-black tracking-tighter mb-4 text-purple-400">DISCUSS!</h1>
                <p className="text-zinc-400">Everyone has seen their role. Now, find the imposter!</p>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative mb-12">
                  <div className={`absolute -inset-8 bg-purple-600/10 blur-3xl rounded-full transition-opacity duration-1000 ${isTimerRunning ? 'opacity-100' : 'opacity-0'}`} />
                  <div className={`text-8xl font-black tracking-tighter tabular-nums ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                  </div>
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="p-4 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    >
                      {isTimerRunning ? <Timer size={24} /> : <Play size={24} fill="currentColor" />}
                    </button>
                  </div>
                </div>

                <div className="w-full space-y-4">
                  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl">
                    <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-4">How to play</h3>
                    <ul className="space-y-3 text-sm text-zinc-300">
                      <li className="flex gap-3">
                        <span className="text-purple-500 font-bold">01</span>
                        <span>Take turns describing the secret word using only ONE word.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-500 font-bold">02</span>
                        <span>The Imposter must try to blend in by guessing what the word might be.</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-purple-500 font-bold">03</span>
                        <span>After the timer, vote on who you think the Imposter is!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="mt-12 w-full py-4 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
              >
                <RefreshCw size={18} />
                NEW GAME
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272a;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #3f3f46;
        }
      `}</style>
    </div>
  );
}
