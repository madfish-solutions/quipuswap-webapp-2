import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { STABLE_TOKEN, TEZOS_TOKEN } from '@utils/defaults';
import { getWhitelistedTokenSymbol, isTokenEqual } from '@utils/helpers';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

type RouterPairType = {
  page: string,
  urlLoaded:boolean,
  initialLoad:boolean,
  token1:WhitelistedToken,
  token2:WhitelistedToken,
  tokenPair?: WhitelistedTokenPair
};

const pairString = '[from-to]';
const pairLength = pairString.length;

export const useRouterPair = ({
  page, urlLoaded, initialLoad, token1, token2, tokenPair,
}:RouterPairType) => {
  const router = useRouter();
  let urlSearchParams;
  const actualUrl = router.pathname.indexOf(pairString)
    ? router.pathname
    : router.pathname.slice(0, -pairLength);
  if (!router.query['from-to'] || typeof router.query['from-to'] !== 'string') {
    const lastSlash = window.location.pathname.indexOf(actualUrl);
    const sliceIndex = lastSlash + actualUrl.length;
    urlSearchParams = window.location.pathname.slice(sliceIndex).split('-');
  } else {
    urlSearchParams = router.query['from-to'].split('-');
  }
  const params = Object.fromEntries(new Map(urlSearchParams.map((x, i) => [i === 0 ? 'from' : 'to', x])));
  const { from, to } = params;
  useEffect(() => {
    if (urlLoaded && initialLoad) {
      if (token1 && token2) {
        const fromToken = getWhitelistedTokenSymbol(token1, 36);
        const toToken = getWhitelistedTokenSymbol(token2, 36);
        const url = `/${page}/${fromToken}-${toToken}`;
        router.replace(url, undefined, { shallow: true });
      }
    }
  }, [token1, token2]);

  useEffect(() => {
    if (
      tokenPair
        && (!isTokenEqual(tokenPair.token1, token1)
        || !isTokenEqual(tokenPair.token2, token2))
    ) {
      if (urlLoaded && initialLoad) {
        const fromToken = getWhitelistedTokenSymbol(tokenPair.token1, 36);
        const toToken = getWhitelistedTokenSymbol(tokenPair.token2, 36);
        const url = `/${page}/${fromToken}-${toToken}`;
        router.replace(url, undefined, { shallow: true });
      }
    }
  }, [tokenPair]);

  useEffect(() => {
    if (!from) {
      const url = `/${page}/${getWhitelistedTokenSymbol(TEZOS_TOKEN)}-${getWhitelistedTokenSymbol(STABLE_TOKEN)}`;
      router.replace(url, undefined, { shallow: true });
      return;
    } if (!to) {
      let toToken;
      if (from === STABLE_TOKEN.metadata.symbol) {
        toToken = getWhitelistedTokenSymbol(TEZOS_TOKEN);
      } else if (from === TEZOS_TOKEN.metadata.symbol) {
        toToken = getWhitelistedTokenSymbol(STABLE_TOKEN);
      }
      const url = `/${page}/${from}-${toToken}`;
      router.replace(url, undefined, { shallow: true });
    }
  }, []);

  return { from, to };
};
