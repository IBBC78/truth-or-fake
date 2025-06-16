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

export const useGame = () => {// Custom hook to manage the game state and logic
    
    // Initialize the game state with default values
    const [gameState, setGameState] = useState<GameState>(IINITIAL_STATE);
    const { fetchAdvice, loading } = useAdviceAPI();

    // Function to get a random piece of fake advice from the predefined list
    const getRandomFakeAdvice = (): string => {
        const randomIndex = Math.floor(Math.random() * fakeAdvice.length);// Generate a random index
        return fakeAdvice[randomIndex];
    };

    // Function to generate new advice, either real or fake
    const generateNewAdvice = useCallback(async () => {
        const isReal = Math.random() < 0.5;// 50% chance of real advice

        let advice: string;
        if (isReal) {
            advice = await fetchAdvice();
        } else {
            advice = getRandomFakeAdvice();
        }

        setGameState(prev => ({// Update the game state with new advice
            ...prev,
            currentAdvice: advice,
            isRealAdvice: isReal
        }));
    }, [fetchAdvice]);
    
    // Function to handle the user's guess
    const makeGuess = (userGuessIsReal:boolean) => {
        const isCorrect = userGuessIsReal === gameState.isRealAdvice;
        const newScore = gameState.score + (isCorrect ? 1 : -1);

        // Create a history entry for the current advice
        const historyEntry: AdviceHistory = {
            advice: gameState.currentAdvice,
            wasReal: gameState.isRealAdvice,
            userGuess:userGuessIsReal,
            wasCorrect: isCorrect
        };

        // Update the game state with the new score, history, and game status
        setGameState(prev => ({
            ...prev,
            score:newScore,
            history: [historyEntry, ...prev.history.slice(0,9)],// Limit history to 10 entries
            isGameOver:newScore <= 0 || newScore >= 20,
            hasWon:newScore >= 20
        }));
    };


    // Function to reset the game state to initial values
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

