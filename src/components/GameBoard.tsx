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
    Badge,
} from '@mantine/core';
import { useGame } from '../hooks/useGame';
import { IconCheck, IconX } from '@tabler/icons-react';
import classes from '../css/StatsCard.module.css';

interface GameBoardProps {
    gameLogic: ReturnType<typeof useGame>;
}

export const GameBoard = ({gameLogic} : GameBoardProps) => {
    const { gameState, generateNewAdvice, makeGuess, resetGame, loading } = gameLogic;

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
                    {loading ? 'Chargement...' : `"${gameState.currentAdvice}"`}
                    </Text>
                    
                    <Group>
                    <Button
                        leftSection={<IconCheck size={20} />}
                        color="green"
                        size="lg"
                        onClick={() => handleGuess(true)}
                        disabled={loading || !gameState.currentAdvice}
                    >
                        Vrai conseil
                    </Button>
                    
                    <Button
                        leftSection={<IconX size={20} />}
                        color="red"
                        size="lg"
                        onClick={() => handleGuess(false)}
                        disabled={loading || !gameState.currentAdvice}
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