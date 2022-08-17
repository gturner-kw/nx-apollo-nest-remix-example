import { createContext } from 'react';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// create cache on browser
const initialState =
  typeof window !== 'undefined' ? window.__INITIAL_STATE__ : {};

// TODO InMemoryCache is just for demo purposes - do not use this in prod
export function initApolloClient(ssrMode: boolean) {
  return new ApolloClient({
    uri: process.env.GRAPHQL_URL || 'http://localhost:4200/graphql',
    cache: new InMemoryCache().restore(initialState),
    ssrMode,
  });
}

export const ApolloContext = createContext(initialState);
