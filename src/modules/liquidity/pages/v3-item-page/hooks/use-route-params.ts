import { useMemo } from 'react';

import { useMatch } from 'react-router-dom';

import { isExist } from '@shared/helpers';

import {
  CREATE_POOL_RELATIVE_PATH,
  CREATE_POSITION_RELATIVE_PATH,
  FULL_PATH_PREFIX,
  POSITIONS_RELATIVE_PATH,
  POSITION_RELATIVE_PATH
} from '../constants';

export const useRouteParams = () => {
  const createPoolMatch = useMatch(`${FULL_PATH_PREFIX}${CREATE_POOL_RELATIVE_PATH}`);
  const positionsListMatch = useMatch(`${FULL_PATH_PREFIX}${POSITIONS_RELATIVE_PATH}`);
  const positionMatch = useMatch(`${FULL_PATH_PREFIX}${POSITION_RELATIVE_PATH}`);
  const createPositionMatch = useMatch(`${FULL_PATH_PREFIX}${CREATE_POSITION_RELATIVE_PATH}`);

  return useMemo(() => {
    const allMatches = [createPoolMatch, positionsListMatch, positionMatch, createPositionMatch];

    return allMatches.find(isExist)?.params ?? {};
  }, [createPoolMatch, positionsListMatch, positionMatch, createPositionMatch]);
};
