import { useEffect } from 'react';
import {
    Container,
    Paper,
    Text,
    Button,
    Group,
    Stack,
    Title,
    Progress,
} from '@mantine/core';
import { useGame } from '../hooks/useGame';

export const GameBoard = () => {
    const { gameState, generateNewAdvice, makeGuess, resetGame, loading } = useGame();

    useEffect(() => {
        if (!gameState.isGameOver && !gameState.currentAdvice) {
            generateNewAdvice();
        }
    }, [gameState.isGameOver, gameState.currentAdvice, generateNewAdvice]);

    const handleGuess = (isReal: boolean) => {
        makeGuess(isReal);

        if (
            gameState.score + (isReal === gameState.isRealAdvice ? 1 : -1) > 0 &&
            gameState.score + (isReal === gameState.isRealAdvice ? 1 : -1) < 20
        ) {
            setTimeout(() => {
                generateNewAdvice();
            }, 1500);
        }
    };

    if (gameState.isGameOver) {
        return (
            <Container>
                <Paper>
                    <Stack>
                        <Title>
                            {gameState.hasWon ? 'Congratulations!' : 'Game Over'}
                        </Title>
                        <Text>
                            Score finale : {gameState.score}/20
                        </Text>
                        <Button onClick={resetGame}>
                            Rejouer
                        </Button>
                    </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <Container>
            <Stack>
                <Paper>
                    <Group>
                        <Text>Truth or Fake</Text>
                        <Text>Score: {gameState.score}/20</Text>
                    </Group>
                    <Progress value={(gameState.score / 20) * 100} />
                </Paper>

                <Paper>
                    <Stack>
                        <Text>{loading ? 'Chargement...' : `"${gameState.currentAdvice}"`}</Text>

                        <Group>
                            <Button onClick={()=>handleGuess(true)} disabled={loading || !gameState.currentAdvice}>Vrai conseil</Button>

                            <Button onClick={() => handleGuess(false)} disabled={loading || !gameState.currentAdvice}>Faux conseil</Button>
                        </Group>
                    </Stack>
                </Paper>
            </Stack>
        </Container>    
    )
};