import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Question } from '../types/game';
import { MiniGame } from './MiniGame';

export default function GameScreen() {
  const [isClient, setIsClient] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [miniGameType, setMiniGameType] = useState<'trainline' | 'prize' | 'map' | 'rush'>('trainline');
  const [bonusMessage, setBonusMessage] = useState<string | null>(null);
  const gameStore = useGameStore();

  useEffect(() => {
    setIsClient(true);
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

  useEffect(() => {
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/questions/random');
      if (!response.ok) {
        throw new Error('Failed to fetch question');
      }
      const question = await response.json();
      setCurrentQuestion(question);
    } catch (error) {
      setError('Failed to load question');
      console.error('Error fetching question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    if (!currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    const points = isCorrect ? 100 : 0;
    gameStore.incrementScore(points);

    // Save current score in case of refresh
    localStorage.setItem('currentScore', gameStore.score.toString());

    const nextQuestionNumber = gameStore.currentQuestion + 1;
    gameStore.setCurrentQuestion(nextQuestionNumber);

    // Show mini-game after questions 3, 5, and 7
    if ([3, 5, 7].includes(nextQuestionNumber)) {
      setShowMiniGame(true);
      // Set mini-game type based on question number
      switch (nextQuestionNumber) {
        case 3:
          setMiniGameType('trainline');
          break;
        case 5:
          setMiniGameType('prize');
          break;
        case 7:
          setMiniGameType('rush');
          break;
      }
    } else if (nextQuestionNumber >= 8) {
      // Game over after 8 questions
      localStorage.setItem('finalScore', gameStore.score.toString());
      localStorage.removeItem('currentScore'); // Clear backup score
      gameStore.setGameOver(true);
      window.location.href = '/results';
    } else {
      // Fetch next question
      await fetchQuestion();
    }
  };

  const handleMiniGameComplete = (bonusPoints: number) => {
    if (bonusPoints > 0) {
      gameStore.incrementScore(bonusPoints);
      setBonusMessage(`+${bonusPoints} bonus points!`);
      // Clear bonus message after 2 seconds
      setTimeout(() => setBonusMessage(null), 2000);
    }
    setShowMiniGame(false);
    // Fetch next question after mini-game
    fetchQuestion();
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        {/* Header with score and question counter */}
        <div className="flex justify-between items-center">
          <div className="text-xl">
            Question {gameStore.currentQuestion + 1}/8
          </div>
          <div className="text-xl text-subway-yellow">
            Score: {gameStore.score}
          </div>
        </div>

        {showMiniGame ? (
          <MiniGame
            type={miniGameType}
            onComplete={handleMiniGameComplete}
          />
        ) : loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : currentQuestion ? (
          <div className="bg-gray-800 rounded-lg p-8 space-y-6">
            <h2 className="text-2xl font-bold text-center">
              {currentQuestion.question}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition text-left"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {bonusMessage && (
          <div className="fixed top-4 right-4 bg-subway-yellow text-black px-4 py-2 rounded-lg font-bold animate-bounce">
            {bonusMessage}
          </div>
        )}
      </div>
    </div>
  );
}