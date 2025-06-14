import { GameBoard } from './components/GameBoard';
import { GameHistory } from './components/GameHistory';
import { ActionToggle } from './components/colorActionToggle';
import { useGame } from './hooks/useGame';
import { Grid } from '@mantine/core';

function App() {
  const gameLogic = useGame();

  return (
    <Grid>
      <Grid.Col>
        <ActionToggle/>
      </Grid.Col>
      <Grid.Col>
        <GameBoard gameLogic = {gameLogic}/>
      </Grid.Col>
      <Grid.Col>
        <GameHistory history={gameLogic.gameState.history} />
      </Grid.Col>
    </Grid>
  );
}

export default App;