import { QUIPU_TOKEN } from '@config/tokens';
import { toReal } from '@shared/helpers';

import { RawStakerInfo } from '../types';

export const stakerInfoMapper = (rawStakerInfo: Array<RawStakerInfo>) => {
  return rawStakerInfo.map(({ yourReward, yourDeposit }) => ({
    yourDeposit: toReal(yourDeposit, QUIPU_TOKEN),
    yourReward
  }));
};
