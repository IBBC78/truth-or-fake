import { Paper, Text, Stack, Badge, Group, ScrollArea, Container } from "@mantine/core";
import type { AdviceHistory } from "../types";

interface GameHistoryProps {
  history: AdviceHistory[];
}

export const GameHistory = ({ history }: GameHistoryProps) => {
    if (history.length === 0) return (
        <Container size="md" py="xl">
            <Paper>
                <Text size="lg" fw={800} mb="md">History</Text>
                <Text size="sm" h={300}>No history available yet.</Text>
            </Paper>
        </Container>
    );

    return (
        <Container size="md" py="xl">
            <Paper>
                <Text size="lg" fw={800} mb="md">History</Text>
                <ScrollArea>
                    <Stack gap="xs">
                        {history.map((entry, index) => ( // Map through the history entries
                            // Render each entry in a Paper component
                            <Paper key={index} p="sm" withBorder>
                                <Group justify="space-between" align="flex-start">
                                    <Text size="sm" style={{ flex: 1 }}>
                                    "{entry.advice}"
                                    </Text>
                                    <Group gap="xs">
                                        <Badge color={entry.wasReal ? 'blue' : 'orange'} size="sm"> {/* Display whether the advice was real or fake */}
                                        {entry.wasReal ? 'Vrai' : 'Faux'}
                                        </Badge>
                                        <Badge color={entry.wasCorrect ? 'green' : 'red'} size="sm">{/* Display whether the guess was correct or not */}
                                        {entry.wasCorrect ? '✓' : '✗'}
                                        </Badge>
                                    </Group>
                                </Group>
                            </Paper>
                        ))}
                    </Stack>
                </ScrollArea>
            </Paper>
        </Container>
    );
};