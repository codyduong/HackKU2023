// @refresh reload
import { Suspense } from 'solid-js';
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start';
import '@fontsource/atkinson-hyperlegible';
import { css, renderSheets, StyleRegistry, type StyleData } from 'solid-styled';
import { useAssets } from 'solid-js/web';
import { UserProvider } from './context/User';
import { auth } from './auth';

function GlobalStyles() {
  css`
    @global {
      body {
        font-family: 'Atkinson Hyperlegible', Gordita, Roboto, Oxygen, Ubuntu,
          Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      a {
        margin-right: 1rem;
      }

      main {
        display: flex;
        flex-flow: column nowrap;
        width: 100vw;
        height: 100vh;
        align-items: center;
        padding: 4rem;
      }

      p {
        max-width: 14rem;
        line-height: 1.35;
      }

      input {
        font-size: 1.5rem;
        border-radius: 8px;
      }
    }
  `;
  return null;
}

export default function Root() {
  const sheets: StyleData[] = [];
  useAssets(() => renderSheets(sheets));

  return (
    <StyleRegistry styles={sheets}>
      <UserProvider auth={auth}>
        <Html lang="en">
          <Head>
            <Title>SolidStart - Bare</Title>
            <Meta charset="utf-8" />
            <Meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <Body>
            <GlobalStyles />
            <Suspense>
              <ErrorBoundary>
                <Routes>
                  <FileRoutes />
                </Routes>
              </ErrorBoundary>
            </Suspense>
            <Scripts />
          </Body>
        </Html>
      </UserProvider>
    </StyleRegistry>
  );
}
