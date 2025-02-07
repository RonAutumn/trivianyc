import { create } from 'zustand';
import type { GameState } from '../types/game';

interface GameStore extends GameState {
  setScore: (score: number) => void;
  incrementScore: (amount: number) => void;
  setCurrentQuestion: (questionNumber: number) => void;
  setNickname: (nickname: string) => void;
  setGameOver: (isOver: boolean) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  score: 0,
  currentQuestion: 0,
  nickname: '',
  isGameOver: false,
  setScore: (score) => set({ score }),
  incrementScore: (amount) => set((state) => ({ score: state.score + amount })),
  setCurrentQuestion: (questionNumber) => set({ currentQuestion: questionNumber }),
  setNickname: (nickname) => set({ nickname }),
  setGameOver: (isOver) => set({ isGameOver: isOver }),
  resetGame: () => set({
    score: 0,
    currentQuestion: 0,
    isGameOver: false
  })
}));