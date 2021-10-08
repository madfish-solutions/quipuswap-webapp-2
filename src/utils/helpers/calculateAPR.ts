import { estimateTezInShares, estimateTezToToken, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { prettyPrice } from '.';

interface AprAndApy {
  apr: string
  apy: string
}

export const calculatingAPR = (
  dexStorage:FoundDex,
  totalValueLocked:string,
  rewardPerSecond:string,
):AprAndApy => {
  const aprAndApy: AprAndApy = {
    apr: '<0.01%',
    apy: '<0.01%',
  };

  if (rewardPerSecond === '0') {
    return aprAndApy;
  }

  if (totalValueLocked === '0') {
    aprAndApy.apr = 'Infinity';
    aprAndApy.apy = 'Infinity';

    return aprAndApy;
  }

  const total = estimateTezInShares(dexStorage, new BigNumber(totalValueLocked));
  const perSecond = estimateTezToToken(dexStorage, new BigNumber(rewardPerSecond));
  const secondsInYear = 31536000; // 365 * 24 * 60 * 60
  const daysInYear = 365;
  const one = new BigNumber(1);
  const apr = perSecond
    .multipliedBy(secondsInYear)
    .dividedBy(total)
    .multipliedBy(100);

  const apy = one
    .plus(
      apr
        .dividedBy(100)
        .dividedBy(daysInYear),
    )
    .pow(daysInYear)
    .minus(one)
    .multipliedBy(100);

  const apy2 = ((1 + 2.51 / 365) ** 365 - 1) * 100;
  console.log({ apy2 });

  console.log({ apy });

  aprAndApy.apr = `${prettyPrice(+apr.toString(), 2)}%`;
  aprAndApy.apy = `${prettyPrice(+apy.toString(), 2)}%`;

  return aprAndApy;
};
