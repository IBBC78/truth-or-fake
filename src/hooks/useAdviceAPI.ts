import { useState } from "react";

// This custom hook fetches advice from an external API
export const useAdviceAPI = () => {
    // State to manage loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Function to fetch advice from the API
    const fetchAdvice = async (): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://api.adviceslip.com/advice");
            const data = await response.json(); // Parse the JSON response
            return data.slip.advice;// Return the advice from the response
        } catch (err) {
            setError("Failed to fetch advice. Please try again later.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchAdvice, loading, error };
};