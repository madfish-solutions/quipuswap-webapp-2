import { useEffect } from 'react';

import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { getWhitelistedTokenSymbol } from '@utils/helpers';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  let urlSearchParams;
  const actualUrl = location.pathname.indexOf(pairString) ? location.pathname : location.pathname.slice(0, -pairLength);
  const fromTo = searchParams.get('from-to');
  if (!fromTo) {
    const lastSlash = window.location.pathname.indexOf(actualUrl);
    const sliceIndex = lastSlash + actualUrl.length;
    urlSearchParams = window.location.pathname.slice(sliceIndex).split('-');
  } else {
    urlSearchParams = fromTo.split('-');
  }
  const params = Object.fromEntries(new Map(urlSearchParams.map((x, i) => [i === 0 ? 'from' : 'to', x])));
  const { from, to } = params;
  useEffect(() => {
    if (urlLoaded && initialLoad && token1 && token2) {
      const fromToken = getWhitelistedTokenSymbol(token1, 36);
      const toToken = getWhitelistedTokenSymbol(token2, 36);
      const url = `/${page}/${fromToken}-${toToken}`;
      navigate(url, { replace: true });
    }
    // eslint-disable-next-line
  }, [token1, token2]);

  return { from, to };
};
