import BigNumber from 'bignumber.js';

const Zero = new BigNumber(0);

export const isRewardGreaterThenZero = (reward: string): boolean => new BigNumber(reward).gt(Zero);
