import { DEFAULT_TOKEN } from '@config/tokens';
import { fromDecimals } from '@shared/helpers';

import { RawStakerInfo } from '../types';

export const stakerInfoMapper = (rawStakerInfo: Array<RawStakerInfo>) => {
  return rawStakerInfo.map(({ yourReward, yourDeposit }) => ({
    yourDeposit: fromDecimals(yourDeposit, DEFAULT_TOKEN),
    yourReward
  }));
};
