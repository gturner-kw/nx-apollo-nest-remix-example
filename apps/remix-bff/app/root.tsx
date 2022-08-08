import type { MetaFunction } from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { useContext } from 'react';
import { ApolloContext } from './context/apollo';

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'New Remix App',
  viewport: 'width=device-width,initial-scale=1',
});

// intialize apollo cache - https://www.apollographql.com/docs/react/performance/server-side-rendering/
const Context = () => {
  const initialState = useContext(ApolloContext);
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__INITIAL_STATE__=${JSON.stringify(
          initialState
        ).replace(/</g, '\\u003c')};`,
      }}
    />
  );
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Context />
      </body>
    </html>
  );
}
