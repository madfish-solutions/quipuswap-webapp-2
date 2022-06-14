import { DEFAULT_TOKEN } from '@config/tokens';
import { fromDecimals } from '@shared/helpers';

import { StakerInfo } from '../types';

export const stakerInfoMapper = (rawStakerInfo: Array<StakerInfo>) => {
  return rawStakerInfo.map(({ yourEarned, yourDeposit }) => ({
    yourDeposit: fromDecimals(yourDeposit, DEFAULT_TOKEN),
    yourEarned: fromDecimals(yourEarned, DEFAULT_TOKEN)
  }));
};
