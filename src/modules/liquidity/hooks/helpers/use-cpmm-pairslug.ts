import { useMemo } from 'react';

import { Params, useParams } from 'react-router-dom';

import { TEZOS_TOKEN } from '@config/tokens';
import { isExist } from '@shared/helpers';
import { isValidAddress } from '@shared/validators';

const isTokenSlugValid = (tokenSlug: string) => {
  const [tokenAddress] = tokenSlug.split('_');

  return isValidAddress(tokenAddress) || tokenAddress === TEZOS_TOKEN.contractAddress;
};

const getCpmmPairSlug = (params: Readonly<Params<string>>) => {
  const location = params['*'];

  if (!isExist(location)) {
    throw new Error('Location is not defined');
  }

  const [, cpmmPairSlug] = location.split('/');

  if (!isExist(cpmmPairSlug)) {
    throw new Error('CpmmPairSlug is not defined');
  }

  const [tokenASlug, tokenBSlug] = cpmmPairSlug.split('-');

  if (
    !isExist(tokenASlug) ||
    !isExist(tokenBSlug) ||
    tokenASlug === tokenBSlug ||
    !isTokenSlugValid(tokenASlug) ||
    !isTokenSlugValid(tokenBSlug)
  ) {
    throw new Error('CpmmPairSlug is not valid');
  }

  return cpmmPairSlug;
};

export const useCpmmPairSlug = () => {
  const params = useParams();

  const pairSlug = useMemo(() => {
    try {
      return getCpmmPairSlug(params);
    } catch {
      return null;
    }
  }, [params]);

  return { pairSlug };
};
