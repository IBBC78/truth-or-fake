import { Paper, Text, Stack, Badge, Group, ScrollArea } from "@mantine/core";
import type { AdviceHistory } from "../types";

interface GameHistoryProps {
  history: AdviceHistory[];
}

export const GameHistory = ({ history }: GameHistoryProps) => {
    if (history.length === 0) return null;

    return (
        <Paper shadow="md" p="md" radius="md">
          <Text size="lg" fw={700} mb="md">Historique</Text>
          <ScrollArea h={300}>
            <Stack gap="xs">
              {history.map((entry, index) => (
                <Paper key={index} p="sm" bg="gray.0">
                  <Group justify="space-between" align="flex-start">
                    <Text size="sm" style={{ flex: 1 }}>
                      "{entry.advice}"
                    </Text>
                    <Group gap="xs">
                      <Badge color={entry.wasReal ? 'blue' : 'orange'} size="sm">
                        {entry.wasReal ? 'Vrai' : 'Faux'}
                      </Badge>
                      <Badge 
                        color={entry.wasCorrect ? 'green' : 'red'} 
                        size="sm"
                      >
                        {entry.wasCorrect ? '✓' : '✗'}
                      </Badge>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
          </ScrollArea>
        </Paper>
    );
};