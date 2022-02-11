import { useEffect, useState } from 'react';

import constate from 'constate';
import { useRouter } from 'next/router';

import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { getTokenPairSlug, getTokenSlug, isFoundIndex, isTezosToken } from '@utils/helpers';
import { Token } from '@utils/types';

import { useTokenSlugSearch } from './hooks/use-token-slug-search';

const pairString = '[from-to]';
const pairLength = pairString.length;

interface TokenPair {
  from: Token;
  to: Token;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const [TokenPairProvider, useTokenPair] = constate(() => {
  const router = useRouter();

  let tokensSlugs: string[] = [];
  const pairShouldExist = isFoundIndex(router.pathname.indexOf(pairString));
  const actualUrl = pairShouldExist ? router.pathname.slice(0, -pairLength - 1) : router.pathname;
  const rawPairValue = router.query[pairString];
  if (typeof rawPairValue === 'string') {
    tokensSlugs = rawPairValue.split('-');
  } else if (typeof window !== 'undefined') {
    const lastSlash = window.location.pathname.indexOf(actualUrl);
    const sliceIndex = lastSlash + actualUrl.length + 1;
    tokensSlugs = window.location.pathname.slice(sliceIndex).split('-');
  }
  const [fromTokenSlug, toTokenSlug] = tokensSlugs;
  const { loading: fromTokenLoading, token: fromToken } = useTokenSlugSearch(fromTokenSlug);
  const { loading: toTokenLoading, token: toToken } = useTokenSlugSearch(toTokenSlug);

  const defaultToken = networksDefaultTokens[NETWORK_ID];
  const defaultFromToken = toToken && isTezosToken(toToken) ? defaultToken : TEZOS_TOKEN;
  const defaultToToken =
    fromToken && getTokenSlug(fromToken) === getTokenSlug(defaultToken) ? TEZOS_TOKEN : defaultToken;

  const [tokenPair, setTokenPair] = useState<TokenPair | null>(null);
  useEffect(() => {
    setTokenPair(
      pairShouldExist
        ? {
            from: fromToken ?? defaultFromToken,
            to: toToken ?? defaultToToken
          }
        : null
    );
  }, [fromToken, toToken, defaultFromToken, defaultToToken, pairShouldExist]);

  const correctedPairSlug = tokenPair && getTokenPairSlug(tokenPair.from, tokenPair.to);
  const loading = fromTokenLoading || toTokenLoading;

  useEffect(() => {
    if (correctedPairSlug && correctedPairSlug !== rawPairValue && !loading) {
      // router.replace(`${actualUrl}/${correctedPairSlug}`);
      // eslint-disable-next-line no-console
      console.log(`TODO: replace url with ${actualUrl}/${correctedPairSlug}`);
    }
  }, [actualUrl, correctedPairSlug, loading, rawPairValue, router]);

  // eslint-disable-next-line no-console
  console.log('TokenPairProvider', { loading, tokenPair });

  return { loading, tokenPair };
});
