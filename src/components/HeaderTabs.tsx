import {
  Container,  
} from '@mantine/core';
import { ActionToggle } from './colorActionToggle';
import classes from '../css/HeaderTabs.module.css';


export function HeaderTabs() {

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection} size="md">
        <ActionToggle/>
        <div className={classes.title}>
          <h3>Truth or Fake</h3>
        </div>
        <div className={classes.subtitle}>
          <p>made by Ibrahima</p>
        </div>
      </Container>
    </div>
  );
}