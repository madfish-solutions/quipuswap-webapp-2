import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

export const useCpmmPairSlug = () => {
  const params = useParams();
  const pairSlug = useMemo(() => params['*']!.split('/')[1], [params]);

  return { pairSlug };
};
