import { MongoClient } from 'mongodb';

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

const client = new MongoClient(url);

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  rank: number;
  timestamp: Date;
}

export async function addToLeaderboard({ 
  nickname, 
  score,
  session = null
}: { 
  nickname: string; 
  score: number;
  session?: any;
}): Promise<void> {
  try {
    // Get supabaseId if user is logged in
    const supabaseId = session?.user?.id;

    // Make API call to save score
    const response = await fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nickname,
        score,
        supabaseId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save score');
    }
  } catch (error) {
    console.error('Error adding score to leaderboard:', error);
    throw new Error('Failed to add score to leaderboard');
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    // Get scores from API
    const response = await fetch('/api/scores');
    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    const data = await response.json();
    return data.scores.map((score: any) => ({
      nickname: score.nickname,
      score: score.score,
      rank: score.rank,
      timestamp: new Date(score.timestamp)
    }));
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    throw new Error('Failed to get leaderboard');
  }
}

export async function getPlayerRank(score: number): Promise<number> {
  try {
    // Count how many scores are higher than this one
    const response = await fetch(`/api/scores/rank?score=${score}`);
    if (!response.ok) {
      throw new Error('Failed to get rank');
    }

    const data = await response.json();
    return data.rank;
  } catch (error) {
    console.error('Error getting player rank:', error);
    throw new Error('Failed to get player rank');
  }
}

export async function getUserScores(supabaseId: string): Promise<LeaderboardEntry[]> {
  try {
    // Get user's scores from API
    const response = await fetch(`/api/scores?supabaseId=${supabaseId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user scores');
    }

    const data = await response.json();
    return data.scores.map((score: any) => ({
      nickname: score.nickname,
      score: score.score,
      rank: score.rank,
      timestamp: new Date(score.timestamp)
    }));
  } catch (error) {
    console.error('Error getting user scores:', error);
    throw new Error('Failed to get user scores');
  }
}