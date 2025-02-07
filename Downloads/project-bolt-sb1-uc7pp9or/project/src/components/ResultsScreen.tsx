import React from 'react';
import { useGameStore } from '../store/gameStore';
import { getPrize } from '../lib/prizes';
import { getShopCode } from '../lib/shopCodes';
import { addToLeaderboard } from '../lib/leaderboard';
import { supabase } from '../lib/supabase';

export const ResultsScreen: React.FC = () => {
  const [finalScore, setFinalScore] = React.useState<number>(0);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [session, setSession] = React.useState<any>(null);
  const [showPrizeCode, setShowPrizeCode] = React.useState(false);
  const [showShopCode, setShowShopCode] = React.useState(false);
  const [shopCode, setShopCode] = React.useState<any>(null);
  const gameStore = useGameStore();

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  React.useEffect(() => {
    const initScore = async () => {
      // Try to get score in this order:
      // 1. finalScore from localStorage (set at game end)
      // 2. currentScore from localStorage (backup during gameplay)
      // 3. score from gameStore
      const savedFinalScore = localStorage.getItem('finalScore');
      const savedCurrentScore = localStorage.getItem('currentScore');
      
      let scoreToUse = 0;
      
      if (savedFinalScore) {
        scoreToUse = parseInt(savedFinalScore, 10);
      } else if (savedCurrentScore) {
        scoreToUse = parseInt(savedCurrentScore, 10);
      } else if (gameStore.score > 0) {
        scoreToUse = gameStore.score;
      }

      if (scoreToUse > 0) {
        setFinalScore(scoreToUse);
        
        // Get shop code based on score
        try {
          const code = await getShopCode(scoreToUse);
          setShopCode(code);
        } catch (error) {
          console.error('Error getting shop code:', error);
        }
        
        // Submit score to leaderboard with session
        setIsSubmitting(true);
        try {
          await addToLeaderboard({ 
            nickname: gameStore.nickname || 'Guest', 
            score: scoreToUse,
            session 
          });
        } catch (error) {
          console.error('Error submitting score:', error);
          setError('Failed to submit score to leaderboard');
        } finally {
          setIsSubmitting(false);
        }
      }
    };

    initScore();
  }, [session, gameStore.score, gameStore.nickname]);

  const prize = getPrize(finalScore);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-subway-yellow">End of the Line!</h1>
          <div className="bg-gray-800 rounded-lg p-8 space-y-6">
            <div className="space-y-2">
              <p className="text-gray-400">Final Score</p>
              <p className="text-6xl font-bold text-subway-yellow">{finalScore}</p>
              {isSubmitting && (
                <p className="text-xl text-gray-400 mt-2">
                  Submitting score...
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <p className="text-gray-400">Played as</p>
              <p className="text-xl">{gameStore.nickname || 'Guest'}</p>
              {session && (
                <p className="text-sm text-gray-400">
                  Logged in as {session.user.email}
                </p>
              )}
            </div>

            {error && (
              <div className="bg-red-900/50 text-red-200 p-4 rounded-lg">
                {error}
              </div>
            )}

            {/* Shop Code Box - Always shown */}
            <div className={`bg-subway-yellow/10 border border-subway-yellow/30 p-6 rounded-lg space-y-4`}>
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl">🎁</span>
                  <h3 className="text-xl font-bold text-subway-yellow">
                    Shop Code
                  </h3>
                </div>
                <p className="text-sm text-gray-300">Thanks for playing! Visit our shop to redeem your rewards.</p>
              </div>
              
              <div className="bg-gray-900/50 p-4 rounded-lg space-y-2">
                <p className="text-sm text-gray-400">Your Shop Code:</p>
                {showShopCode ? (
                  <div className="font-mono text-lg bg-gray-800 p-2 rounded select-all">
                    HHNYC2024
                  </div>
                ) : (
                  <button
                    onClick={() => setShowShopCode(true)}
                    className="w-full py-2 px-4 bg-subway-yellow/20 text-subway-yellow border border-subway-yellow/30 hover:bg-subway-yellow/30 transition rounded"
                  >
                    Click to Reveal Code
                  </button>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Valid until 12/31/2024
                </p>
                <a 
                  href="https://14thst.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block mt-4 py-2 px-4 bg-subway-yellow text-black font-bold rounded hover:bg-opacity-90 transition"
                >
                  Visit Our Shop
                </a>
                <div className="text-center mt-2">
                  <p className="text-sm text-gray-400">
                    Shop Password: <span className="font-mono text-subway-yellow text-xl font-bold">2025</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Prize Box - Only shown if earned */}
            {prize && (
              <div className={`bg-${prize.level}-900/20 border border-${prize.level}-500/50 p-6 rounded-lg space-y-4 relative overflow-hidden`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    {prize.level === 'gold' && <span className="text-2xl">🏆</span>}
                    {prize.level === 'silver' && <span className="text-2xl">🥈</span>}
                    {prize.level === 'bronze' && <span className="text-2xl">🥉</span>}
                    {prize.level === 'platinum' && <span className="text-2xl">👑</span>}
                    <h3 className={`text-xl font-bold text-${prize.level}-400`}>
                      {prize.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-300">{prize.description}</p>
                </div>
                
                <div className="bg-gray-900/50 p-4 rounded-lg space-y-2">
                  <p className="text-sm text-gray-400">Your Reward Code:</p>
                  {showPrizeCode ? (
                    <div className="font-mono text-lg bg-gray-800 p-2 rounded select-all">
                      {prize.code}
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowPrizeCode(true)}
                      className={`w-full py-2 px-4 bg-${prize.level}-500/20 text-${prize.level}-300 border border-${prize.level}-500/50 rounded hover:bg-${prize.level}-500/30 transition`}
                    >
                      Click to Reveal Code
                    </button>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Save this code - you can use it to claim your reward!
                  </p>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-4">
              <a
                href="/game"
                onClick={() => {
                  localStorage.removeItem('finalScore');
                  localStorage.removeItem('currentScore');
                  gameStore.resetGame();
                }}
                className="block w-full py-3 px-4 bg-subway-yellow text-black font-bold rounded-lg hover:bg-opacity-90 transition"
              >
                Ride Again
              </a>
              
              <a
                href="/leaderboard"
                className="block w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-lg hover:bg-opacity-90 transition"
              >
                View Leaderboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};