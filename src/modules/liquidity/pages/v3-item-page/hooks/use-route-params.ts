import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { EMPTY_STRING, STAR } from '@config/constants';
import { getFirstElement, getRouterParts } from '@shared/helpers';

const POSITIONS_LIST_PATHNAME_LENGTH = 1;

export const useRouteParams = () => {
  const params = useParams();
  const data = params[STAR] ?? EMPTY_STRING;

  return useMemo(() => {
    const routerParts = getRouterParts(data);

    if (routerParts.length === POSITIONS_LIST_PATHNAME_LENGTH) {
      return { tab: null, id: getFirstElement(routerParts) };
    }

    const [tab, id] = routerParts;

    return { tab, id };
  }, [data]);
};
