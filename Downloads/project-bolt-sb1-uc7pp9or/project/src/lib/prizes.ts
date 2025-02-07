import type { Prize, PrizeLevel } from '../types/game';

const prizes: Prize[] = [
  {
    name: 'Bronze MetroCard',
    description: 'You\'re getting the hang of it! Keep riding to unlock more rewards.',
    code: 'BRONZE2024',
    level: 'bronze',
    minScore: 500
  },
  {
    name: 'Silver MetroCard',
    description: 'You\'re becoming a real New Yorker! Great job!',
    code: 'SILVER2024',
    level: 'silver',
    minScore: 1000
  },
  {
    name: 'Gold MetroCard',
    description: 'Amazing! You\'re a true subway expert!',
    code: 'GOLD2024',
    level: 'gold',
    minScore: 1500
  },
  {
    name: 'Platinum MetroCard',
    description: 'Perfect score! You\'re a legendary subway master!',
    code: 'PLATINUM2024',
    level: 'platinum',
    minScore: 2000
  }
];

export function getPrize(score: number): Prize | null {
  // Find the highest prize level achieved
  const earnedPrize = [...prizes]
    .reverse()
    .find(prize => score >= prize.minScore);
    
  return earnedPrize || null;
}

export function getPrizeLevel(score: number): PrizeLevel | null {
  const prize = getPrize(score);
  return prize?.level || null;
}