import { useEffect, useState } from 'react';
import {
    Container,
    Paper,
    Text,
    Button,
    Group,
    Stack,
    Title,
    Progress,
    Badge,
} from '@mantine/core';
import { useGame } from '../hooks/useGame';
import { IconCheck, IconX } from '@tabler/icons-react';
import classes from '../css/StatsCard.module.css';

interface GameBoardProps {
    gameLogic: ReturnType<typeof useGame>;
}

/**
 * GameBoard component displays the main game interface, including the current advice,
 * score, and buttons to make guesses.
 * 
 * @param {GameBoardProps} props - The properties for the GameBoard component.
 * @returns {JSX.Element} The rendered GameBoard component.
 */
export const GameBoard = ({gameLogic} : GameBoardProps) => {
    const { gameState, generateNewAdvice, makeGuess, resetGame, loading } = gameLogic;
    const [buttonsDisabled, setButtonsDisabled] = useState(false);

    useEffect(() => {
        if (!gameState.isGameOver && !gameState.currentAdvice) {
            generateNewAdvice();
        }
    }, [gameState.isGameOver, gameState.currentAdvice, generateNewAdvice]);

    const handleGuess = (isReal: boolean) => {
        // Prevent multiple clicks while processing the guess
        if (buttonsDisabled) return;
        setButtonsDisabled(true);
        makeGuess(isReal);

        if (
            // Check if the game is over after making a guess
            gameState.score + (isReal === gameState.isRealAdvice ? 1 : -1) > 0 &&
            gameState.score + (isReal === gameState.isRealAdvice ? 1 : -1) < 20
        ) {
            // If the game is not over, generate a new advice after a delay
            setTimeout(() => {
                generateNewAdvice();
                setButtonsDisabled(false);
            }, 1500);
        }
    };

    if (gameState.isGameOver) {
        return (
            <Container size="md" py="xl">
                <Paper shadow="md" p="xl" radius="md">
                <Stack align="center">
                    <Title order={1}>
                    {gameState.hasWon ? 'Victoire !' : 'Défaite !'}
                    </Title>
                    <Text size="lg">
                    Score final : {gameState.score}/20
                    </Text>
                    <Button onClick={resetGame} size="lg">
                    Rejouer 
                    </Button>
                </Stack>
                </Paper>
            </Container>
        );
    }

    return (
        <Container size="md" py="xl">
            <Stack>

                <Paper radius="md" withBorder className={classes.card}>

                    <Text ta="center" fw={700} className={classes.title}>
                        Truth or Fake
                    </Text>
                    <Text c="dimmed" ta="center" fz="sm">
                        Score: {gameState.score}/20
                    </Text>

                    <Group justify="space-between" mt="xs">
                        <Text fz="sm" c="dimmed">
                        Progress
                        </Text>
                    </Group>

                    <Progress value={(gameState.score / 20) * 100} mt={5} />

                    <Group justify="space-between" mt="md">
                        <Text fz="sm">{gameState.score} / 20 </Text>
                        <Badge size="sm">{20 - gameState.score} left</Badge>
                    </Group>
                </Paper>

                <Paper withBorder p="xl" radius="md">
                <Stack align="center">
                    <Text size="lg" ta="center" fw={500}>
                    {loading ? 'loading...' : `"${gameState.currentAdvice}"`}{/* Display the current advice or 'loading' */} 
                    </Text>
                    
                    <Group>
                    <Button
                        leftSection={<IconCheck size={20} />}
                        color="green"
                        size="lg"
                        onClick={() => handleGuess(true)}
                        disabled={buttonsDisabled || loading || !gameState.currentAdvice}
                    >
                        Vrai conseil
                    </Button>
                    
                    <Button
                        leftSection={<IconX size={20} />}
                        color="red"
                        size="lg"
                        onClick={() => handleGuess(false)}
                        disabled={buttonsDisabled || loading || !gameState.currentAdvice}
                    >
                        Faux conseil
                    </Button>
                    </Group>
                </Stack>
                </Paper>
            </Stack>
        </Container>
    )
};