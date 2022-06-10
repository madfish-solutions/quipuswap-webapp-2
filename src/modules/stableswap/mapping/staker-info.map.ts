import BigNumber from 'bignumber.js';

import { DEFAULT_TOKEN } from '@config/tokens';
import { fromDecimals } from '@shared/helpers';

import { StakerInfo } from '../types';

const DEFAULT_VALUE = new BigNumber('0');

export const stakerInfoMapper = (rawStakerInfo: Record<string, StakerInfo>) => {
  const stakerInfo: Record<string, StakerInfo> = {};
  for (const contractAddress in rawStakerInfo) {
    const yourDeposit = rawStakerInfo[contractAddress]?.yourDeposit ?? DEFAULT_VALUE;
    const yourEarned = rawStakerInfo[contractAddress]?.yourEarned ?? DEFAULT_VALUE;

    stakerInfo[contractAddress] = {
      yourDeposit: fromDecimals(yourDeposit, DEFAULT_TOKEN),
      yourEarned: fromDecimals(yourEarned, DEFAULT_TOKEN)
    };
  }

  return stakerInfo;
};
