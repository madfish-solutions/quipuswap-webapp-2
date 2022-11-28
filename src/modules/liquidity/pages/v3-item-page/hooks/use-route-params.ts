import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { EMPTY_STRING, STAR } from '@config/constants';
import { isNull } from '@shared/helpers';

const LIQUIDITY_ACTION_PATH_REGEX = /([a-z-]+)\/([^/]+)/;

export const useRouteParams = () => {
  const params = useParams();
  const data = params[STAR] ?? EMPTY_STRING;

  return useMemo(() => {
    const liquidityActionParseResult = LIQUIDITY_ACTION_PATH_REGEX.exec(data);

    if (isNull(liquidityActionParseResult)) {
      return { tab: null, id: data };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, tab, id] = liquidityActionParseResult;

    return { tab, id };
  }, [data]);
};
