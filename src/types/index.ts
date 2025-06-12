export interface Advice {
    id: number;
    advice: string;
}

export interface AdviceHistory {
    advice: Advice;
    wasReal:boolean;
    userGuess:boolean;
    wasCorrect: boolean;
}

export interface GameState {
    score: number;
    isGameOver: boolean;
    hasWon: boolean;
    currentAdvice: Advice | null;
    isRealAdvice: boolean;
    history: AdviceHistory[];
}

