import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { SLASH, STAR } from '@config/constants';

const POSITIONS_LIST_PATH_REGEX = /^[0-9]+$/;

export const useRouteParams = () => {
  const params = useParams();
  const data = params[STAR] || '';

  return useMemo(() => {
    if (POSITIONS_LIST_PATH_REGEX.test(data)) {
      return { tab: null, id: data };
    }

    const [tab, id] = data.split(SLASH);

    return { tab, id };
  }, [data]);
};
