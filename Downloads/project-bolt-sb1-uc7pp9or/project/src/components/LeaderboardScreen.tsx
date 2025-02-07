import React, { useState, useEffect } from 'react';

interface LeaderboardEntry {
  nickname: string;
  score: number;
  timestamp: string;
}

interface LeaderboardData {
  entries: LeaderboardEntry[];
  lastUpdated: string;
}

export default function LeaderboardScreen() {
  const [gameType, setGameType] = useState<string>('trivia');
  const [timeframe, setTimeframe] = useState<string>('allTime');
  const [leaderboard, setLeaderboard] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, [gameType, timeframe]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/leaderboard/${gameType}?timeframe=${timeframe}&limit=10`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch leaderboard');
      }

      const data = await response.json();
      setLeaderboard(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-subway-yellow">Leaderboard</h1>
          <div className="space-x-4">
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              <option value="trivia">Trivia</option>
            </select>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-subway-yellow mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 text-red-200 p-6 rounded-lg text-center">
            <p>{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="mt-4 px-4 py-2 bg-red-800 rounded-lg hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : leaderboard && leaderboard.entries.length > 0 ? (
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left">Rank</th>
                  <th className="px-6 py-3 text-left">Player</th>
                  <th className="px-6 py-3 text-right">Score</th>
                  <th className="px-6 py-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.entries.map((entry, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-700 hover:bg-gray-700/50 transition"
                  >
                    <td className="px-6 py-4">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </td>
                    <td className="px-6 py-4">{entry.nickname}</td>
                    <td className="px-6 py-4 text-right font-mono text-subway-yellow">
                      {entry.score.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-gray-400">No scores yet for this category!</p>
            <p className="mt-2 text-gray-500">Be the first to set a high score!</p>
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/game"
            className="inline-block px-6 py-3 bg-subway-yellow text-black font-bold rounded-lg hover:bg-opacity-90 transition"
          >
            Play Again
          </a>
        </div>
      </div>
    </div>
  );
}