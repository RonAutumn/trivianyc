import React from 'react';
import { useGameStore } from '../store/gameStore';
import { supabase } from '../lib/supabase';

export const LandingPage: React.FC = () => {
  const { setNickname, setAuthenticated } = useGameStore();

  const handleGuestPlay = () => {
    const guestId = `guest_${Math.random().toString(36).substring(7)}`;
    setNickname(guestId);
    window.location.href = '/game';
  };

  const handleGoogleSignIn = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/game`
        }
      });

      if (error) {
        console.error('Error signing in with Google:', error.message);
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2 text-subway-yellow">
            NYC Subway Quick Trivia
          </h1>
          <p className="text-gray-400 mb-8">
            Test your knowledge of NYC's subway system and culture
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            className="w-full py-3 px-4 bg-subway-yellow text-black font-bold rounded-lg hover:bg-opacity-90 transition"
            onClick={handleGuestPlay}
          >
            Play as Guest
          </button>
          
          <button
            className="w-full py-3 px-4 bg-white text-black font-bold rounded-lg hover:bg-opacity-90 transition flex items-center justify-center space-x-2"
            onClick={handleGoogleSignIn}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="text-center mt-2">
            <a
              href="/leaderboard"
              className="text-subway-yellow hover:text-yellow-400 text-sm"
            >
              View Leaderboard
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};