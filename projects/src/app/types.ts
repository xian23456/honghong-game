export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface GameState {
  phase: 'home' | 'playing' | 'review';
  scenario: string;
  hiddenNeed: string;
  openingMessage: string;
  messages: Message[];
  angerLevel: number;
  round: number;
  maxRounds: number;
  gameResult: 'success' | 'failure' | 'timeout' | 'quit' | null;
  audioUrl: string | null;
}

export interface StartResponse {
  scenario: string;
  hiddenNeed: string;
  openingMessage: string;
  angerLevel: number;
  audioUrl: string;
}

export interface ChatResponse {
  reply: string;
  angerChange: number;
  newAngerLevel: number;
  emotion: string;
  emotionIntensity: number;
  audioUrl: string;
  gameEnded: boolean;
  gameResult: 'success' | 'failure' | 'timeout' | null;
}

export interface ReviewGoodItem {
  quote: string;
  reason: string;
}

export interface ReviewBadItem {
  quote: string;
  reason: string;
}

export interface ReviewResponse {
  summary: string;
  good: ReviewGoodItem[];
  bad: ReviewBadItem[];
  suggestion: string;
  betterExpressions: string[];
  hiddenNeed: string;
}
