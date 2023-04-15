import { Title } from 'solid-start';
import { css } from 'solid-styled';

export default function Home() {
  css`
    .chip {
      display: flex;
    }
  `;

  return (
    <main>
      <Title>Hello World</Title>
      <h1>Hello world!</h1>
      <p>
        Visit{' '}
        <a href="https://start.solidjs.com" target="_blank">
          start.solidjs.com
        </a>{' '}
        to learn how to build SolidStart apps.
      </p>
    </main>
  );
}
