import { GameBoard } from './components/GameBoard';
import { GameHistory } from './components/GameHistory';
import { HeaderTabs } from './components/HeaderTabs';
import { FooterSimple } from './components/FooterSimple';
import { useGame } from './hooks/useGame';
import { Grid, Container } from '@mantine/core';

function App() {
  const gameLogic = useGame();


  return (
    <Grid>
      <Grid.Col span={12}>
        <HeaderTabs />
      </Grid.Col>
      <Grid.Col span={12}>
        <Container my="md" fluid>
          <Grid gutter="md">
            <Grid.Col span={{ base: 12, md: 8.5 }}>
              <GameBoard gameLogic={gameLogic} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 3.5 }}>
              <GameHistory history={gameLogic.gameState.history} />
            </Grid.Col>
          </Grid>
        </Container>
      </Grid.Col>
      <Grid.Col span={12}>
        <FooterSimple />
      </Grid.Col>
    </Grid>
  );
}

export default App;