export type GameType = 'trivia' | 'trainline' | 'prize' | 'rush';
export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'allTime';

export interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LeaderboardEntry {
  nickname: string;
  score: number;
  timestamp: string;
}

export interface GameState {
  score: number;
  currentQuestion: number;
  nickname: string;
  isGameOver: boolean;
}

export interface Prize {
  name: string;
  description: string;
  code: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  minScore: number;
}

export interface MiniGameState {
  trainline?: {
    stops: string[];
    currentOrder: string[];
    selected: string | null;
  };
  prize?: {
    boxes: Array<{
      id: number;
      points: number;
    }>;
    selected: number | null;
  };
  rush?: {
    trains: Array<{
      id: number;
      speed: number;
      position: number;
      caught: boolean;
    }>;
    playerPosition: number;
  };
}

export interface GameSession {
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'trains' | 'stops' | 'culture' | 'history';
  score: number;
}

export type GameDifficulty = 'easy' | 'medium' | 'hard';
export type GameCategory = 'trains' | 'stops' | 'culture' | 'history';
export type PrizeLevel = 'bronze' | 'silver' | 'gold' | 'platinum';