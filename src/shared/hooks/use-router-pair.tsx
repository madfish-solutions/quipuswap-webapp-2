import { useEffect } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { networksDefaultTokens, NETWORK_ID } from '@config/config';
import { getTokenPairSlug, getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

interface RouterPairType {
  page: string;
  urlLoaded: boolean;
  initialLoad: boolean;
  token1: Token;
  token2: Token;
}

export const useRouterPair = ({ page, urlLoaded, initialLoad, token1, token2 }: RouterPairType) => {
  const params = useParams();
  const navigate = useNavigate();
  const urlSearchParams = params.fromTo?.split('-');
  let from_ = 'tez';
  let to_ = getTokenSlug(networksDefaultTokens[NETWORK_ID]);
  if (urlSearchParams) {
    const fromTo = Object.fromEntries(new Map(urlSearchParams.map((x, i) => [i === 0 ? 'from' : 'to', x])));
    const { from, to } = fromTo;
    from_ = from;
    to_ = to;
  }

  useEffect(() => {
    if (urlLoaded && initialLoad && token1 && token2) {
      const url = `/${page}/${getTokenPairSlug(token1, token2)}`;
      navigate(url);
    }
    // eslint-disable-next-line
  }, [urlLoaded, initialLoad, token1, token2]);

  return { from: from_, to: to_ };
};
