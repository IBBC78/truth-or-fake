import { Anchor, Container, Group } from '@mantine/core';
import classes from '../css/FooterSimple.module.css';

const links = [
  { link: 'https://linkedin.com/in/ibrahimabaldecisse', label: 'Linkedin' },
  { link: 'http://ibrahima.baldecisse.portfolio.s3-website.eu-west-3.amazonaws.com/', label: 'Portfolio' },
];

export function FooterSimple() {
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}