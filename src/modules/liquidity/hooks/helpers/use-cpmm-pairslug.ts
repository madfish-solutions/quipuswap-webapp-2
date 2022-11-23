import { useMemo } from 'react';

import { Params, useParams } from 'react-router-dom';

import { isExist, tokenPairSlugIsValid } from '@shared/helpers';

const getCpmmPairSlug = (params: Readonly<Params<string>>) => {
  const location = params['*'] ?? '';

  const [, cpmmPairSlug] = location.split('/');

  return cpmmPairSlug ?? null;
};

export const useCpmmPairSlug = () => {
  const params = useParams();

  const pairSlug = useMemo(() => getCpmmPairSlug(params), [params]);

  return { pairSlug, pairSlugIsValid: isExist(pairSlug) && tokenPairSlugIsValid(pairSlug) };
};
