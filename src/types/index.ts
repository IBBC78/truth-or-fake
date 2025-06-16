// interfaces make it easier to define the shape of objects in TypeScript

export interface Advice {
    id: number;
    advice: string;
}

export interface AdviceHistory {
    advice: string;
    wasReal:boolean;
    userGuess:boolean;
    wasCorrect: boolean;
}

export interface GameState {
    score: number;
    isGameOver: boolean;
    hasWon: boolean;
    currentAdvice: string;
    isRealAdvice: boolean;
    history: AdviceHistory[];
}

