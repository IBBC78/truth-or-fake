import { GameBoard } from './components/GameBoard';
import { GameHistory } from './components/GameHistory';
import { useGame } from './hooks/useGame';
import { Grid } from '@mantine/core';

function App() {
  const { gameState } = useGame();

  return (
    <Grid>
      <Grid.Col span={8}>
        <GameBoard />
      </Grid.Col>
      <Grid.Col span={4}>
        <GameHistory history={gameState.history} />
      </Grid.Col>
    </Grid>
  );
}

export default App;