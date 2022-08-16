import BigNumber from 'bignumber.js';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';

export const MOCK_ITEM = {
  apr: null,
  id: new BigNumber(1),
  maxApr: null,
  poolLabels: [],
  tokensInfo: [
    { token: QUIPU_TOKEN, atomicTokenTvl: new BigNumber(1000) },
    { token: TEZOS_TOKEN, atomicTokenTvl: new BigNumber(1000) }
  ],
  totalSupply: new BigNumber(3),
  tvlInUsd: new BigNumber(1),
  type: 'DEX_TWO',
  volumeForWeek: null,
  opportunities: [
    {
      id: '1',
      apr: 5,
      apy: 6
    }
  ]
};
