import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { getTokenSlug } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

interface RouterPairType {
  page: string;
  urlLoaded: boolean;
  initialLoad: boolean;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
}

const pairString = '[from-to]';
const pairLength = pairString.length;

export const useRouterPair = ({ page, urlLoaded, initialLoad, token1, token2 }: RouterPairType) => {
  const router = useRouter();
  let urlSearchParams;
  const actualUrl = router.pathname.indexOf(pairString) ? router.pathname : router.pathname.slice(0, -pairLength);
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
    if (urlLoaded && initialLoad && token1 && token2) {
      const fromToken = getTokenSlug(token1);
      const toToken = getTokenSlug(token2);
      const url = `/${page}/${fromToken}-${toToken}`;
      router.replace(url, undefined, { shallow: true });
    }
    // eslint-disable-next-line
  }, [token1, token2]);

  return { from, to };
};
