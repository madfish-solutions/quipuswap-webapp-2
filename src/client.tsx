import React from 'react';

import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
  HttpLink,
  InMemoryCache,
  defaultDataIdFromObject
} from '@apollo/client';

import { APOLLO_CLIENT_ENDPOINT } from '@utils/defaults';

let globalApolloClient: ApolloClient<NormalizedCacheObject>;

const cache = new InMemoryCache({
  dataIdFromObject(responseObject) {
    if (responseObject.__typename === 'Token') {
      return `Token:${responseObject.id}:${responseObject.tokenId}`;
    } else {
      return defaultDataIdFromObject(responseObject);
    }
  }
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // set to true for SSR
    link: new HttpLink({
      uri: APOLLO_CLIENT_ENDPOINT
    }),
    cache
  });
}

// @ts-ignore
function initializeApollo(initialState: never = null) {
  const localApolloClient = globalApolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    localApolloClient.cache.restore(initialState);
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return localApolloClient;
  }

  // Create the Apollo Client once in the client
  if (!globalApolloClient) {
    globalApolloClient = localApolloClient;
  }

  return localApolloClient;
}

export const withApollo =
  ({ ssr = true } = {}) =>
  // @ts-ignore
  // eslint-disable-next-line sonarjs/cognitive-complexity
  PageComponent => {
    // @ts-ignore
    const WithApollo = ({ apolloClient, apolloState, ...props }) => {
      let client;
      if (apolloClient) {
        // Happens on: getDataFromTree & next.js ssr
        client = apolloClient;
      } else {
        // Happens on: next.js csr
        // client = initApolloClient(apolloState, undefined);
        client = initializeApollo(apolloState);
      }

      return (
        <ApolloProvider client={client}>
          <PageComponent {...props} />
        </ApolloProvider>
      );
    };
    // Set the correct displayName in development
    if (process.env.NODE_ENV !== 'production') {
      const displayName = PageComponent.displayName || PageComponent.name || 'Component';
      WithApollo.displayName = `withApollo(${displayName})`;
    }
    if (ssr || PageComponent.getInitialProps) {
      WithApollo.getInitialProps = async (ctx: { apolloClient?: never; res?: never; AppTree?: never }) => {
        const { AppTree } = ctx;
        // Initialize ApolloClient, add it to the ctx object so
        // we can use it in `PageComponent.getInitialProp`.
        // @ts-ignore
        const apolloClient = initializeApollo(null);
        // @ts-ignore
        ctx.apolloClient = apolloClient;

        // Run wrapped getInitialProps methods
        let pageProps = { pageProps: {} };
        if (PageComponent.getInitialProps) {
          pageProps = await PageComponent.getInitialProps(ctx);
        }
        // Only on the server:
        if (typeof window === 'undefined') {
          // When redirecting, the response is finished.
          // No point in continuing to render
          // @ts-ignore
          if (ctx.res && ctx.res.finished) {
            return pageProps;
          }
          // Only if ssr is enabled
          if (ssr) {
            try {
              // Run all GraphQL queries
              const { getDataFromTree } = await import('@apollo/client/react/ssr');
              // @ts-ignore
              await getDataFromTree(<AppTree {...pageProps} apolloClient={apolloClient} />);
            } catch (error) {
              // Prevent Apollo Client GraphQL errors from crashing SSR.
              // Handle them in components via the data.error prop:
              // https://www.apollographql.com/docs/react/api/react-apollo.html#graphql-query-data-error
              // eslint-disable-next-line no-console
              console.error('Error while running `getDataFromTree`', error);
            }
            // getDataFromTree does not call componentWillUnmount
            // head side effect therefore need to be cleared manually
            // Head.rewind()
          }
        }
        // Extract query data from the Apollo store
        const apolloState = apolloClient.cache.extract();

        return {
          ...pageProps,
          apolloState
        };
      };
    }

    return WithApollo;
  };
