import { estimateTezInShares, estimateTezToToken, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

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
    apr: new BigNumber(0.01),
    apyDaily: new BigNumber(0.01),
  };

  if (rewardPerSecond === '0') {
    return aprAndApy;
  }

  if (totalValueLocked === '0') {
    aprAndApy.apr = new BigNumber(Infinity);
    aprAndApy.apyDaily = new BigNumber(Infinity);

    return aprAndApy;
  }

  const total = estimateTezInShares(dexStorage, new BigNumber(totalValueLocked));
  const perSecond = estimateTezToToken(dexStorage, new BigNumber(rewardPerSecond));
  const secondsInYear = 31536000; // 365 * 24 * 60 * 60
  const daysInYear = 365;
  const one = new BigNumber(1);

  aprAndApy.apr = perSecond
    .multipliedBy(secondsInYear)
    .dividedBy(total)
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
