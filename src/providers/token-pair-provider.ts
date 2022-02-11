import { useEffect, useMemo, useState } from 'react';

import constate from 'constate';
import { useRouter } from 'next/router';

import { getTokenPairSlug, isFoundIndex } from '@utils/helpers';

import { useTokenSlugSearch } from './hooks/use-token-slug-search';
import { makeTokenPair } from './token-pair-provider.helpers';
import { TokenPair, TokenPairProviderValue } from './token-pair-provider.types';

const pairString = '[from-to]';
const pairLength = pairString.length;

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
  const [token1Slug, token2Slug] = tokensSlugs;
  const { loading: token1Loading, token: token1 } = useTokenSlugSearch(token1Slug);
  const { loading: token2Loading, token: token2 } = useTokenSlugSearch(token2Slug);

  const foundTokenPair = useMemo(() => makeTokenPair(token1, token2), [token1, token2]);

  const [value, setValue] = useState<TokenPairProviderValue>();
  useEffect(() => {
    setValue(
      pairShouldExist
        ? {
            isPair: true,
            pair: foundTokenPair
          }
        : undefined
    );
  }, [foundTokenPair, pairShouldExist]);

  const correctedPairSlug = value?.pair && getTokenPairSlug(value.pair.token1, value.pair.token2);
  const loading = token1Loading || token2Loading;

  useEffect(() => {
    if (correctedPairSlug && correctedPairSlug !== rawPairValue && !loading) {
      // eslint-disable-next-line no-console
      console.log(`TODO: replace url with ${actualUrl}/${correctedPairSlug}`);
    }
  }, [actualUrl, correctedPairSlug, loading, rawPairValue, router]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('TokenPairProvider', { loading, value });
  }, [loading, value]);

  const setTokenPair = (tokenPair: TokenPair) =>
    setValue({
      pair: tokenPair,
      isPair: true
    });

  return { loading, setTokenPair, value };
});
