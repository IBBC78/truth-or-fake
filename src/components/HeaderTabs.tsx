/* This file is part of Mantine, a React component library.
 * https://mantine.dev/
 *
 * Mantine is released under the MIT license.
 */

import {
  Container,  
} from '@mantine/core';
import { ActionToggle } from './colorActionToggle';
import classes from '../css/HeaderTabs.module.css';


export function HeaderTabs() {

  return (
    <div className={classes.header}>
      <Container className={classes.mainSection}>
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