/* This file is part of Mantine, a React component library.
 * https://mantine.dev/
 *
 * Mantine is released under the MIT license.
 */

import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import { ActionIcon, Group, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from '../css/colorActionToggle.module.css';

export function ActionToggle() {
  const { setColorScheme } = useMantineColorScheme(); // Use Mantine's color scheme management
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });// Get the current color scheme, defaulting to 'light'

  return (
    <Group justify="center">
        <ActionIcon
          onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}// Toggle the color scheme
          variant="default"
          size="xl"
          radius="md"
          aria-label="Toggle color scheme"
        >
        {computedColorScheme === 'light' ? ( // Change icon based on the current color scheme
            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
        ) : (
            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
}