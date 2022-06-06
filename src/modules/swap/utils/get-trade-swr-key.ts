import { Trade } from 'swap-router-sdk';

export const getTradeSWRKey = (trade: Trade) =>
  trade
    ?.map(
      ({ aTokenSlug, bTokenSlug, aTokenAmount, bTokenAmount }) =>
        `(${aTokenSlug},${bTokenSlug},${aTokenAmount.toFixed()},${bTokenAmount.toFixed()})`
    )
    .join(',') ?? null;
