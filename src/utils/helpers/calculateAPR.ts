import { estimateTezInShares, estimateTezToToken, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import { FARM_PRECISION, TEZOS_TOKEN } from '@utils/defaults';
import { fromDecimals } from '.';

interface AprAndApy {
  apr: BigNumber
  apyDaily: BigNumber
}

export const calculatingAPR = (
  dexStorage:FoundDex,
  totalValueLocked:string,
  rewardPerSecond:string,
):AprAndApy => {
  const aprAndApy: AprAndApy = {
    apr: new BigNumber(0),
    apyDaily: new BigNumber(0),
  };

  if (totalValueLocked === '0') {
    aprAndApy.apr = new BigNumber(Infinity);
    aprAndApy.apyDaily = new BigNumber(Infinity);

    return aprAndApy;
  }

  if (rewardPerSecond === '0') {
    return aprAndApy;
  }

  const secondsInYear = 31536000; // 365 * 24 * 60 * 60

  const correctRewarsPerYear = new BigNumber(rewardPerSecond)
    .dividedBy(new BigNumber(FARM_PRECISION))
    .multipliedBy(secondsInYear)
    .toFixed(0);

  if (correctRewarsPerYear === '0') {
    return aprAndApy;
  }

  const daysInYear = 365;
  const one = new BigNumber(1);

  const total = estimateTezInShares(
    dexStorage,
    new BigNumber(totalValueLocked),
  );

  const perYear = estimateTezToToken(
    dexStorage,
    correctRewarsPerYear,
  );

  aprAndApy.apr = perYear
    .dividedBy(fromDecimals(total, TEZOS_TOKEN.metadata.decimals))
    .multipliedBy(100);

  aprAndApy.apyDaily = one
    .plus(
      aprAndApy.apr
        .dividedBy(100)
        .dividedBy(daysInYear),
    )
    .pow(daysInYear)
    .minus(one)
    .multipliedBy(100);

  return aprAndApy;
};
