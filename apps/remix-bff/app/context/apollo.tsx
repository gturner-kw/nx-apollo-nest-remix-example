import { createContext } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// create cache on browser
const initialState =
  typeof window !== 'undefined' ? window.__INITIAL_STATE__ : {};

export function initApolloClient(ssrMode: boolean) {
  return new ApolloClient({
    uri: 'http://localhost:3333/graphql',
    cache: new InMemoryCache().restore(initialState),
    ssrMode,
  });
}

export const ApolloContext = createContext(initialState);
