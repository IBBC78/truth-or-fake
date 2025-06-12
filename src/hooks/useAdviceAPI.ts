import { useState } from "react";

export const useAdviceAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAdvice = async (): Promise<string> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("https://api.adviceslip.com/advice");
            const data = await response.json();
            return data.slip.advice;
        } catch (err) {
            setError("Failed to fetch advice. Please try again later.");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { fetchAdvice, loading, error };
};