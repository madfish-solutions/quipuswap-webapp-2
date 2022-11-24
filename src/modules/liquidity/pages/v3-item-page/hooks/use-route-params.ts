import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { SLASH, STAR } from '@config/constants';
import { isNull } from '@shared/helpers';

const POSITIONS_LIST_PATH_REGEX = /^(0-9)+$/;

export const useRouteParams = () => {
  const params = useParams();
  const data = params[STAR] || '';

  return useMemo(() => {
    const positionsListPathMatch = POSITIONS_LIST_PATH_REGEX.exec(data);
    if (isNull(positionsListPathMatch)) {
      const [tab, id] = data.split(SLASH);

      return { tab, id };
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, id] = positionsListPathMatch;

    return { tab: null, id };
  }, [data]);
};
