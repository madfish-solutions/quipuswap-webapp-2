/*
  Examples:
    https://better-call.dev/ghostnet/KT1Sy7BKFpAMypwHN25qmDiLbv4CZqAMH3g4/interact
    https://better-call.dev/ghostnet/KT1QUx9NV6oyagqpZw5JgNEyyvjyEHA1ikP9/storage
    https://better-call.dev/ghostnet/KT1QUx9NV6oyagqpZw5JgNEyyvjyEHA1ikP9/storage
    https://api.ghostnet.tzkt.io/v1/contracts/KT1QUx9NV6oyagqpZw5JgNEyyvjyEHA1ikP9/bigmaps/ticks/keys
 */

import { Tzkt } from '@shared/api';
import { SortDirection, sortNumbers } from '@shared/helpers';

export interface ILiquidityTikRaw {
  id: number;
  key: string;
  value: {
    next: string;
    sqrt_price: string;
  };
}

export const getLiquidityTicks = async (contractAddress: string): Promise<number[]> => {
  const ticks = await Tzkt.getContractBigmapKeys<ILiquidityTikRaw>(contractAddress, 'ticks');

  return ticks.map(({ key }) => Number(key)).sort(sortNumbers(SortDirection.ASC));
};
