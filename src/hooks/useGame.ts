import { useState, useCallback } from "react";
import type { AdviceHistory } from "../types";
import type { GameState } from "../types";
import { useAdviceAPI } from "./useAdviceAPI";
import fakeAdvice from "../data/fakeAdvices.json";

const IINITIAL_STATE: GameState = {
    score: 10,
    isGameOver: false,
    hasWon: false,
    currentAdvice: '',
    isRealAdvice: false,
    history: [],
};

export const useGame = () => {
    const [gameState, setGameState] = useState<GameState>(IINITIAL_STATE);
    const { fetchAdvice, loading } = useAdviceAPI();

    const getRandomFakeAdvice = (): string => {
        const randomIndex = Math.floor(Math.random() * fakeAdvice.length);
        return fakeAdvice[randomIndex];
    };

    const generateNewAdvice = useCallback(async () => {
        const isReal = Math.random() < 0.5;

        let advice: string;
        if (isReal) {
            advice = await fetchAdvice();
        } else {
            advice = getRandomFakeAdvice();
        }

        setGameState(prev => ({
            ...prev,
            currentAdvice: advice,
            isRealAdvice: isReal
        }));
    }, [fetchAdvice]);

    const makeGuess = (userGuessIsReal:boolean) => {
        const isCorrect = userGuessIsReal === gameState.isRealAdvice;
        const newScore = gameState.score + (isCorrect ? 1 : -1);

        const historyEntry: AdviceHistory = {
            advice: gameState.currentAdvice,
            wasReal: gameState.isRealAdvice,
            userGuess:userGuessIsReal,
            wasCorrect: isCorrect
        };

        setGameState(prev => ({
            ...prev,
            score:newScore,
            history: [historyEntry, ...prev.history.slice(0,9)],
            isGameOver:newScore <= 0 || newScore >= 20,
            hasWon:newScore >= 20
        }));
    };

    const resetGame = () => {
        setGameState(IINITIAL_STATE);
    };

    return {
        gameState,
        generateNewAdvice,
        makeGuess,
        resetGame,
        loading
    };
};

