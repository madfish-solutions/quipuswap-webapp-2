import { ApolloClient, defaultDataIdFromObject, HttpLink, InMemoryCache } from '@apollo/client';

import { APOLLO_CLIENT_ENDPOINT } from '@app.config';

const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    if (responseObject.__typename === 'Token') {
      return `Token:${responseObject.id}:${responseObject.tokenId}`;
    } else {
      return defaultDataIdFromObject(responseObject);
    }
  }
});

export const createApolloClient = () =>
  new ApolloClient({
    link: new HttpLink({
      uri: APOLLO_CLIENT_ENDPOINT
    }),
    cache
  });
