import { GameBoard } from './components/GameBoard';
import { GameHistory } from './components/GameHistory';
import { HeaderTabs } from './components/HeaderTabs';
import { FooterSimple } from './components/FooterSimple';
import { useGame } from './hooks/useGame';
import { Grid, GridCol } from '@mantine/core';

function App() {
  const gameLogic = useGame();

  return (
    <Grid>
      <Grid.Col>
        <HeaderTabs />
      </Grid.Col>
      <Grid.Col>
        <GameBoard gameLogic = {gameLogic}/>
      </Grid.Col>
      <Grid.Col >
        <GameHistory history={gameLogic.gameState.history} />
      </Grid.Col>
      <GridCol>
        <FooterSimple />
      </GridCol>
    </Grid>
  );
}

export default App;